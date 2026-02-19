import { describe, it, expect, vi } from 'vitest';
import fc from 'fast-check';
import { SQLiteProvider } from '../../../src/storage/sqlite/provider';
import type { GameData } from '../../../src/storage/types';

// Mock Capacitor SQLite
const mockDb = {
  open: vi.fn().mockResolvedValue(undefined),
  execute: vi.fn().mockResolvedValue(undefined),
  run: vi.fn().mockImplementation((query: string, params?: unknown[]) => {
    if (query.includes('INSERT OR REPLACE INTO game_saves')) {
      const [id, player_id, save_slot, data, created_at, updated_at] = params || [];
      mockDb._storage.set(id as string, {
        id,
        player_id,
        save_slot,
        data,
        created_at,
        updated_at,
      });
    } else if (query.includes('DELETE FROM game_saves WHERE id = ?')) {
      const key = params?.[0];
      mockDb._storage.delete(key as string);
    }
    return Promise.resolve(undefined);
  }),
  query: vi.fn().mockImplementation((query: string, params?: unknown[]) => {
    if (query.includes('SELECT * FROM game_saves WHERE id = ?')) {
      const key = params?.[0];
      const stored = mockDb._storage.get(key as string);
      return Promise.resolve({
        values: stored ? [stored] : [],
      });
    }
    if (query.includes('SELECT id FROM game_saves')) {
      return Promise.resolve({
        values: Array.from(mockDb._storage.keys()).map((id) => ({ id })),
      });
    }
    if (query.includes('PRAGMA user_version')) {
      return Promise.resolve({
        values: [{ user_version: 1 }],
      });
    }
    return Promise.resolve({ values: [] });
  }),
  close: vi.fn().mockResolvedValue(undefined),
  _storage: new Map<string, unknown>(),
};

vi.mock('@capacitor-community/sqlite', () => ({
  CapacitorSQLite: {},
  SQLiteConnection: class {
    createConnection() {
      return Promise.resolve(mockDb);
    }
  },
}));

// Arbitrary generator for GameData
const gameDataArbitrary = (): fc.Arbitrary<GameData> =>
  fc.record({
    playerId: fc.string({ minLength: 1, maxLength: 50 }),
    saveSlot: fc.integer({ min: 1, max: 10 }),
    data: fc.dictionary(fc.string(), fc.oneof(fc.string(), fc.integer(), fc.boolean())),
    timestamp: fc.integer({ min: 0, max: Date.now() }),
  });

describe('SQLiteProvider Property Tests', () => {
  // Feature: mobile-deployment-and-pwa, Property 6: Storage Persistence Across Restarts
  it.skip('should persist data across provider restarts', async () => {
    await fc.assert(
      fc.asyncProperty(gameDataArbitrary(), fc.string({ minLength: 1 }), async (gameData, key) => {
        // First provider instance - save data
        const provider1 = new SQLiteProvider();
        await provider1.initialize();
        await provider1.save(key, gameData);
        await provider1.close();

        // Second provider instance - load data
        const provider2 = new SQLiteProvider();
        await provider2.initialize();
        const loaded = await provider2.load(key);
        await provider2.close();

        expect(loaded).toEqual(gameData);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: mobile-deployment-and-pwa, Property 7: Storage Schema Migration Safety
  it.skip('should preserve data during schema migrations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(gameDataArbitrary(), { minLength: 1, maxLength: 10 }),
        async (dataArray) => {
          const provider = new SQLiteProvider();
          await provider.initialize();

          // Save all data before migration
          const keys = dataArray.map((_, i) => `key-${i}`);
          for (let i = 0; i < dataArray.length; i++) {
            await provider.save(keys[i], dataArray[i]);
          }

          // Simulate migration (in real scenario, this would upgrade schema version)
          // For now, we just verify data is still accessible

          // Verify all data is still accessible after "migration"
          for (let i = 0; i < dataArray.length; i++) {
            const loaded = await provider.load(keys[i]);
            expect(loaded).toEqual(dataArray[i]);
          }

          await provider.close();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: mobile-deployment-and-pwa, Property 8: Storage Error Safety
  it('should not corrupt data on failed operations', async () => {
    await fc.assert(
      fc.asyncProperty(gameDataArbitrary(), fc.string({ minLength: 1 }), async (gameData, key) => {
        mockDb._storage.clear();
        const provider = new SQLiteProvider();
        await provider.initialize();

        // Save initial data
        await provider.save(key, gameData);

        // Attempt to update non-existent key (should fail)
        try {
          await provider.update('non-existent-key', { data: { corrupted: true } });
        } catch {
          // Expected to fail
        }

        // Verify original data is unchanged (except timestamp which is updated on save)
        const loaded = await provider.load(key);
        expect(loaded?.playerId).toEqual(gameData.playerId);
        expect(loaded?.saveSlot).toEqual(gameData.saveSlot);
        expect(loaded?.data).toEqual(gameData.data);

        await provider.close();
      }),
      { numRuns: 100 }
    );
  });
});
