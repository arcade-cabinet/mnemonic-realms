/**
 * Shared setup for playtest suite.
 *
 * Creates Koota world, loads maps, spawns player entity.
 * Provides afterEach cleanup via universe.reset().
 */

import { universe } from 'koota';
import { afterEach } from 'vitest';
import { createGameWorld } from '../../../engine/ecs/world.js';
import {
  Facing,
  Health,
  Player,
  Position,
  Velocity,
} from '../../../engine/ecs/traits.js';
import { TILE_SIZE } from '../../../engine/renderer/types.js';
import type { LoadedMap } from '../../../engine/world/loader.js';
import type { AIPlayerConfig } from '../../../engine/testing/ai-player.js';
import type { PlaythroughStrategy } from '../../../engine/testing/strategies/types.js';
import type { QuestChain } from '../../../engine/testing/behaviors/quest-following.js';
import { loadTestMap, OVERWORLD_MAP } from './mock-maps.js';

// ── World Setup ────────────────────────────────────────────────────────────

/** Create a fresh Koota world and spawn a player entity at the given tile. */
export function createTestWorld(spawnTileX = 2, spawnTileY = 2) {
  const world = createGameWorld();
  world.spawn(
    Position({ x: spawnTileX * TILE_SIZE, y: spawnTileY * TILE_SIZE }),
    Velocity({ x: 0, y: 0 }),
    Facing({ direction: 'down' }),
    Health({ current: 100, max: 100 }),
    Player,
  );
  return world;
}

/** Build an AIPlayerConfig from a world, map, and strategy. */
export function buildConfig(
  world: ReturnType<typeof createGameWorld>,
  map: LoadedMap,
  strategy: PlaythroughStrategy,
  questChains?: QuestChain[],
): AIPlayerConfig {
  return {
    strategy,
    world,
    collisionGrid: map.collision,
    mapWidth: map.width,
    mapData: map,
    questChains,
  };
}

/** Load the default overworld map. */
export function loadDefaultMap(): LoadedMap {
  return loadTestMap(OVERWORLD_MAP);
}

// ── Cleanup ────────────────────────────────────────────────────────────────

/** Register afterEach cleanup — call in each describe block or at file level. */
export function registerCleanup(): void {
  afterEach(() => {
    universe.reset();
  });
}

// ── Tick Runner ────────────────────────────────────────────────────────────

/** Run the AI player for N ticks, collecting telemetry. */
export function runTicks(
  ai: { tick: (dt: number) => unknown },
  count: number,
  deltaTime = 16,
): void {
  for (let i = 0; i < count; i++) {
    ai.tick(deltaTime);
  }
}

