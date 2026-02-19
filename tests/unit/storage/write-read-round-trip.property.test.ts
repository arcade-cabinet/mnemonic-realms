/**
 * Property Test: Storage Write-Read Round Trip
 * 
 * **Validates: Requirements 4.5**
 * 
 * Property 5: Storage Write-Read Round Trip
 * For any valid GameData object written through the Storage Abstraction using 
 * the save method, reading it back using the load method shall return a GameData 
 * object that is deeply equal to the original.
 * 
 * @module property/storage/write-read-round-trip
 */

import fc from 'fast-check';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameData } from '../../../src/storage/types';

// Mock Capacitor modules
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(),
    getPlatform: vi.fn(),
  },
}));

vi.mock('@capacitor/device', () => ({
  Device: {
    getInfo: vi.fn(),
  },
}));

describe('Property Test: Storage Write-Read Round Trip', () => {
  beforeEach(async () => {
    vi.resetModules();
    const { resetCache } = await import('../../../src/platform/detector');
    resetCache();
  });

  /**
   * Arbitrary generator for GameData objects
   */
  const gameDataArbitrary = () => fc.record({
    playerId: fc.uuid(),
    saveSlot: fc.integer({ min: 1, max: 10 }),
    data: fc.dictionary(
      fc.string({ minLength: 1, maxLength: 20 }),
      fc.oneof(
        fc.string(),
        fc.integer(),
        fc.boolean(),
        fc.constant(null),
        fc.array(fc.string()),
        fc.dictionary(fc.string(), fc.string()),
      ),
    ),
    timestamp: fc.integer({ min: 1_600_000_000_000, max: 2_000_000_000_000 }),
  });

  it.skip('Property 5: Storage write-read round trip (will be enabled when providers are implemented)', async () => {
    await fc.assert(
      fc.asyncProperty(
        gameDataArbitrary(),
        async (gameData: GameData) => {
          const { createStorageDriver } = await import('../../../src/storage/factory');
          const storage = await createStorageDriver();
          const key = `test-${gameData.playerId}-${gameData.saveSlot}`;

          try {
            await storage.save(key, gameData);
            const loaded = await storage.load(key);

            expect(loaded).toEqual(gameData);
          } finally {
            await storage.delete(key);
            await storage.close();
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
