import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SQLiteProvider } from '../../../src/storage/sqlite/provider';
import type { GameData } from '../../../src/storage/types';
import {
  StorageInitializationError,
  StorageWriteError,
  StorageReadError,
  StorageDeleteError,
} from '../../../src/storage/types';

// Mock Capacitor SQLite
const mockDb = {
  open: vi.fn().mockResolvedValue(undefined),
  execute: vi.fn().mockResolvedValue(undefined),
  run: vi.fn().mockResolvedValue(undefined),
  query: vi.fn().mockImplementation((query: string, params?: unknown[]) => {
    if (query.includes('SELECT * FROM game_saves WHERE id = ?')) {
      const key = params?.[0];
      const stored = mockDb._storage.get(key);
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

// Override run to simulate INSERT/UPDATE/DELETE
mockDb.run = vi.fn().mockImplementation((query: string, params?: unknown[]) => {
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
});

vi.mock('@capacitor-community/sqlite', () => ({
  CapacitorSQLite: {},
  SQLiteConnection: class {
    createConnection() {
      return Promise.resolve(mockDb);
    }
  },
}));

describe('SQLiteProvider', () => {
  let provider: SQLiteProvider;

  beforeEach(async () => {
    // Clear mock storage before each test
    mockDb._storage.clear();
    provider = new SQLiteProvider();
    await provider.initialize();
  });

  afterEach(async () => {
    await provider.close();
  });

  describe('save and load', () => {
    it('should save and load game data', async () => {
      const testData: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5, gold: 100 },
        timestamp: Date.now(),
      };

      await provider.save('test-key', testData);
      const loaded = await provider.load('test-key');

      expect(loaded).toEqual(testData);
    });

    it('should return null for non-existent key', async () => {
      const loaded = await provider.load('non-existent');
      expect(loaded).toBeNull();
    });

    it('should overwrite existing data on save', async () => {
      const data1: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5 },
        timestamp: Date.now(),
      };

      const data2: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 10 },
        timestamp: Date.now(),
      };

      await provider.save('test-key', data1);
      await provider.save('test-key', data2);
      const loaded = await provider.load('test-key');

      expect(loaded?.data).toEqual(data2.data);
    });
  });

  describe('update', () => {
    it('should update existing data', async () => {
      const initial: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5, gold: 100 },
        timestamp: Date.now(),
      };

      await provider.save('test-key', initial);
      await provider.update('test-key', { data: { level: 10, gold: 200 } });
      const loaded = await provider.load('test-key');

      expect(loaded?.data).toEqual({ level: 10, gold: 200 });
    });

    it('should throw error when updating non-existent key', async () => {
      await expect(
        provider.update('non-existent', { data: { level: 10 } })
      ).rejects.toThrow(StorageWriteError);
    });
  });

  describe('delete', () => {
    it('should delete existing data', async () => {
      const testData: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5 },
        timestamp: Date.now(),
      };

      await provider.save('test-key', testData);
      await provider.delete('test-key');
      const loaded = await provider.load('test-key');

      expect(loaded).toBeNull();
    });

    it('should not throw error when deleting non-existent key', async () => {
      await expect(provider.delete('non-existent')).resolves.not.toThrow();
    });
  });

  describe('list', () => {
    it('should list all saved keys', async () => {
      const data1: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: {},
        timestamp: Date.now(),
      };

      const data2: GameData = {
        playerId: 'player2',
        saveSlot: 1,
        data: {},
        timestamp: Date.now(),
      };

      await provider.save('key1', data1);
      await provider.save('key2', data2);
      const keys = await provider.list();

      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });

    it('should return empty array when no data exists', async () => {
      const keys = await provider.list();
      expect(keys).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should throw StorageWriteError on save failure', async () => {
      const provider = new SQLiteProvider();
      // Don't initialize - should fail

      await expect(
        provider.save('key', {
          playerId: 'player1',
          saveSlot: 1,
          data: {},
          timestamp: Date.now(),
        })
      ).rejects.toThrow(StorageWriteError);
    });

    it('should throw StorageReadError on load failure', async () => {
      const provider = new SQLiteProvider();
      // Don't initialize - should fail

      await expect(provider.load('key')).rejects.toThrow(StorageReadError);
    });

    it('should throw StorageDeleteError on delete failure', async () => {
      const provider = new SQLiteProvider();
      // Don't initialize - should fail

      await expect(provider.delete('key')).rejects.toThrow(StorageDeleteError);
    });
  });

  describe('connection management', () => {
    it('should close connection without errors', async () => {
      await expect(provider.close()).resolves.not.toThrow();
    });

    it('should handle multiple close calls gracefully', async () => {
      await provider.close();
      await expect(provider.close()).resolves.not.toThrow();
    });
  });
});
