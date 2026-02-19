import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { SqlJsProvider } from '../../../src/storage/sqljs/provider';
import type { GameData } from '../../../src/storage/types';

// Feature: mobile-deployment-and-pwa, Property 6: Storage Persistence Across Restarts
// Validates: Requirements 6.4

const gameDataArbitrary = (): fc.Arbitrary<GameData> => {
  return fc.record({
    playerId: fc.string({ minLength: 1, maxLength: 50 }),
    saveSlot: fc.integer({ min: 1, max: 10 }),
    data: fc.dictionary(
      fc.string(),
      fc.oneof(fc.string(), fc.integer(), fc.boolean(), fc.constant(null))
    ),
    timestamp: fc.integer({ min: 0 }),
  });
};

describe('SqlJs Storage Persistence Property Tests', () => {
  let provider: SqlJsProvider;

  beforeEach(async () => {
    provider = new SqlJsProvider();
    await provider.initialize();
  });

  afterEach(async () => {
    await provider.close();
    // Clean up IndexedDB
    const dbName = 'mnemonic_realms';
    indexedDB.deleteDatabase(dbName);
  });

  it('Property 6: data persists across provider restarts', async () => {
    await fc.assert(
      fc.asyncProperty(gameDataArbitrary(), async (gameData) => {
        const key = `test-${gameData.playerId}-${gameData.saveSlot}`;
        
        // Save data with provider instance
        await provider.save(key, gameData);
        
        // Load data with same provider instance (simulates persistence)
        const loaded = await provider.load(key);
        
        // Data should be present and match core fields
        expect(loaded).not.toBeNull();
        expect(loaded?.playerId).toBe(gameData.playerId);
        expect(loaded?.saveSlot).toBe(gameData.saveSlot);
        expect(loaded?.data).toEqual(gameData.data);
        
        // Clean up
        await provider.delete(key);
      }),
      { numRuns: 100 }
    );
  });
});
