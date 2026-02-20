import type { World } from 'koota';
import { createWorld } from 'koota';

/**
 * Creates a new Koota ECS world for the game.
 *
 * The world manages all game entities (player, NPCs, chests, triggers, etc.)
 * using SoA (struct-of-arrays) storage for cache-friendly iteration.
 *
 * Tiles are NOT entities — they stay as typed arrays for performance.
 * Only behavioral objects (20-50 per map) become entities with traits.
 */
export function createGameWorld(): World {
  return createWorld();
}
