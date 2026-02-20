/**
 * Movement System — Pure function for grid-based tile-to-tile movement.
 *
 * Iterates all entities with Position + Velocity (movableQuery),
 * applies velocity as tile offsets (×TILE_SIZE for pixel position),
 * then clears velocity so entities stop unless keys are held.
 *
 * Position stores x,y in PIXELS (tile position × 16).
 * Velocity stores dx,dy as tile offsets (-1, 0, 1).
 * Movement is tile-to-tile: exactly 16px per step.
 */

import type { World } from 'koota';
import { TILE_SIZE } from '../../renderer/types.js';
import { movableQuery } from '../queries.js';
import { Facing, Position, Velocity } from '../traits.js';
import { checkCollision } from './collision.js';

/**
 * Direction from velocity offset.
 */
function velocityToFacing(dx: number, dy: number): 'up' | 'down' | 'left' | 'right' | null {
  if (dy < 0) return 'up';
  if (dy > 0) return 'down';
  if (dx < 0) return 'left';
  if (dx > 0) return 'right';
  return null;
}

/**
 * Run the movement system for one tick.
 *
 * @param world - The Koota ECS world
 * @param collisionGrid - Optional collision grid (Uint8Array, 1=blocked, 0=passable)
 * @param mapWidth - Map width in tiles (required if collisionGrid is provided)
 */
export function movementSystem(world: World, collisionGrid?: Uint8Array, mapWidth?: number): void {
  const entities = world.query(movableQuery);

  for (const entity of entities) {
    const vel = entity.get(Velocity);
    const dx = vel.x;
    const dy = vel.y;

    // Skip if no movement intent
    if (dx === 0 && dy === 0) continue;

    const pos = entity.get(Position);
    const currentTileX = Math.round(pos.x / TILE_SIZE);
    const currentTileY = Math.round(pos.y / TILE_SIZE);
    const targetTileX = currentTileX + dx;
    const targetTileY = currentTileY + dy;

    // Update facing direction if entity has Facing trait
    const facing = velocityToFacing(dx, dy);
    if (facing && entity.has(Facing)) {
      entity.set(Facing, { direction: facing });
    }

    // Check collision if grid is provided
    if (collisionGrid && mapWidth != null) {
      if (checkCollision(collisionGrid, mapWidth, targetTileX, targetTileY)) {
        // Blocked — clear velocity but don't move
        entity.set(Velocity, { x: 0, y: 0 });
        continue;
      }
    }

    // Apply movement (tile offset → pixel position)
    entity.set(Position, {
      x: targetTileX * TILE_SIZE,
      y: targetTileY * TILE_SIZE,
    });

    // Clear velocity after applying (player stops unless keys held)
    entity.set(Velocity, { x: 0, y: 0 });
  }
}
