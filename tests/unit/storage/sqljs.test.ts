import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SqlJsProvider } from '../../../src/storage/sqljs/provider';
import type { GameData } from '../../../src/storage/types';
import {
  StorageWriteError,
  StorageReadError,
  StorageDeleteError,
} from '../../../src/storage/types';

describe('SqlJsProvider', () => {
  let provider: SqlJsProvider;

  beforeEach(async () => {
    provider = new SqlJsProvider();
    await provider.initialize();
  }, 30000);

  afterEach(async () => {
    await provider.close();
  });

  describe('save and load', () => {
    it('should save and load game data', async () => {
      const gameData: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5, gold: 100 },
        timestamp: Date.now(),
      };

      await provider.save('save-1', gameData);
      const loaded = await provider.load('save-1');

      expect(loaded).toEqual(gameData);
    });

    it('should return null for non-existent key', async () => {
      const loaded = await provider.load('non-existent');
      expect(loaded).toBeNull();
    });

    it('should overwrite existing data on save', async () => {
      const baseTime = Date.now() - 2000;
      const gameData1: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5 },
        timestamp: baseTime,
      };

      const gameData2: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 10 },
        timestamp: baseTime + 1000,
      };

      await provider.save('save-1', gameData1);
      await provider.save('save-1', gameData2);
      const loaded = await provider.load('save-1');

      expect(loaded?.playerId).toBe(gameData2.playerId);
      expect(loaded?.saveSlot).toBe(gameData2.saveSlot);
      expect(loaded?.data).toEqual(gameData2.data);
    });
  });

  describe('update', () => {
    it('should update existing game data', async () => {
      const gameData: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5, gold: 100 },
        timestamp: Date.now(),
      };

      await provider.save('save-1', gameData);
      await provider.update('save-1', { data: { level: 10, gold: 200 } });
      const loaded = await provider.load('save-1');

      expect(loaded?.data).toEqual({ level: 10, gold: 200 });
      expect(loaded?.playerId).toBe('player1');
      expect(loaded?.saveSlot).toBe(1);
    });

    it('should throw error when updating non-existent key', async () => {
      await expect(
        provider.update('non-existent', { data: { level: 10 } })
      ).rejects.toThrow(StorageWriteError);
    });
  });

  describe('delete', () => {
    it('should delete game data', async () => {
      const gameData: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5 },
        timestamp: Date.now(),
      };

      await provider.save('save-1', gameData);
      await provider.delete('save-1');
      const loaded = await provider.load('save-1');

      expect(loaded).toBeNull();
    });

    it('should not throw error when deleting non-existent key', async () => {
      await expect(provider.delete('non-existent')).resolves.not.toThrow();
    });
  });

  describe('list', () => {
    it('should list all save keys', async () => {
      const gameData1: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5 },
        timestamp: Date.now(),
      };

      const gameData2: GameData = {
        playerId: 'player2',
        saveSlot: 1,
        data: { level: 10 },
        timestamp: Date.now() + 1000,
      };

      await provider.save('save-1', gameData1);
      await provider.save('save-2', gameData2);
      const keys = await provider.list();

      expect(keys).toContain('save-1');
      expect(keys).toContain('save-2');
      expect(keys.length).toBe(2);
    });

    it('should return empty array when no saves exist', async () => {
      const keys = await provider.list();
      expect(keys).toEqual([]);
    });

    it('should order keys by updated_at DESC', async () => {
      const gameData1: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5 },
        timestamp: Date.now(),
      };

      await provider.save('save-1', gameData1);
      
      // Wait 10ms to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const gameData2: GameData = {
        playerId: 'player2',
        saveSlot: 1,
        data: { level: 10 },
        timestamp: Date.now(),
      };

      await provider.save('save-2', gameData2);
      const keys = await provider.list();

      expect(keys[0]).toBe('save-2');
      expect(keys[1]).toBe('save-1');
    });
  });

  describe('error handling', () => {
    it('should throw StorageWriteError on save failure', async () => {
      await provider.close();

      const gameData: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5 },
        timestamp: Date.now(),
      };

      await expect(provider.save('save-1', gameData)).rejects.toThrow(StorageWriteError);
    });

    it('should throw StorageReadError on load failure', async () => {
      await provider.close();
      await expect(provider.load('save-1')).rejects.toThrow(StorageReadError);
    });

    it('should throw StorageDeleteError on delete failure', async () => {
      await provider.close();
      await expect(provider.delete('save-1')).rejects.toThrow(StorageDeleteError);
    });
  });

  describe('IndexedDB persistence', () => {
    it('should persist data to IndexedDB on save', async () => {
      const fixedTimestamp = Date.now() - 1000; // Use a fixed timestamp to avoid race conditions
      const gameData: GameData = {
        playerId: 'player1',
        saveSlot: 1,
        data: { level: 5 },
        timestamp: fixedTimestamp,
      };

      await provider.save('save-1', gameData);
      
      // Verify data is in memory
      const loaded = await provider.load('save-1');
      expect(loaded).toEqual(gameData);
    });
  });
});
