/**
 * NPC AI System — Pure function for NPC behavior state machine.
 *
 * State machine:
 * - 'idle' → stays in place
 * - 'patrol' → follows PatrolPath points in order, wraps around
 * - 'follow' → moves toward the player entity
 *
 * Grid-based movement same as player (16px tile-to-tile).
 * Uses collision checking before moving.
 * Position stores x,y in PIXELS (tile × 16).
 */

import type { Entity, World } from 'koota';
import { TILE_SIZE } from '../../renderer/types.js';
import { npcAiQuery, patrollingQuery, playerQuery } from '../queries.js';
import { AiState, Facing, PatrolPath, Position } from '../traits.js';
import { checkCollision } from './collision.js';

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Derive facing direction from a step vector. */
function directionFromStep(stepX: number, stepY: number): 'up' | 'down' | 'left' | 'right' {
  if (stepY < 0) return 'up';
  if (stepY > 0) return 'down';
  if (stepX < 0) return 'left';
  return 'right';
}

/** Compute a one-tile step toward a target, preferring the axis with the larger delta. */
function computeStep(dx: number, dy: number): { stepX: number; stepY: number } {
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { stepX: dx > 0 ? TILE_SIZE : -TILE_SIZE, stepY: 0 };
  }
  return { stepX: 0, stepY: dy > 0 ? TILE_SIZE : -TILE_SIZE };
}

/**
 * Move an NPC one tile toward a target position.
 * Returns true if movement occurred, false if blocked or already at target.
 */
function moveToward(
  entity: Entity,
  targetX: number,
  targetY: number,
  collisionGrid: Uint8Array,
  mapWidth: number,
): boolean {
  const pos = entity.get(Position);
  const dx = targetX - pos.x;
  const dy = targetY - pos.y;

  if (dx === 0 && dy === 0) return false;

  const { stepX, stepY } = computeStep(dx, dy);
  const newX = pos.x + stepX;
  const newY = pos.y + stepY;

  if (
    checkCollision(
      collisionGrid,
      mapWidth,
      Math.round(newX / TILE_SIZE),
      Math.round(newY / TILE_SIZE),
    )
  ) {
    return false;
  }

  entity.set(Position, { x: newX, y: newY });

  if (entity.has(Facing)) {
    entity.set(Facing, { direction: directionFromStep(stepX, stepY) });
  }

  return true;
}

// ── NPC AI System ───────────────────────────────────────────────────────────

/**
 * Run the NPC AI system for one tick.
 *
 * Iterates all NPC entities with AI state and applies behavior:
 * - idle: no movement
 * - patrol: move toward next patrol point, advance when reached
 * - follow: move toward the player
 *
 * @param world - The Koota ECS world
 * @param collisionGrid - Collision grid (Uint8Array, 1=blocked, 0=passable)
 * @param mapWidth - Map width in tiles
 */
export function npcAiSystem(world: World, collisionGrid: Uint8Array, mapWidth: number): void {
  // Handle patrol NPCs
  const patrollers = world.query(patrollingQuery);
  for (const entity of patrollers) {
    const ai = entity.get(AiState);
    if (ai.state !== 'patrol') continue;

    const path = entity.get(PatrolPath);
    if (!path.points || path.points.length === 0) continue;

    const target = path.points[path.currentIndex];
    const targetPx = target.x * TILE_SIZE;
    const targetPy = target.y * TILE_SIZE;

    const pos = entity.get(Position);

    // If at target, advance to next point
    if (pos.x === targetPx && pos.y === targetPy) {
      const nextIndex = (path.currentIndex + 1) % path.points.length;
      entity.set(PatrolPath, { points: path.points, currentIndex: nextIndex });
      continue;
    }

    moveToward(entity, targetPx, targetPy, collisionGrid, mapWidth);
  }

  // Handle follow NPCs
  const allAi = world.query(npcAiQuery);
  const players = world.query(playerQuery);
  const player = players.length > 0 ? players[0] : null;

  for (const entity of allAi) {
    const ai = entity.get(AiState);
    if (ai.state !== 'follow') continue;
    if (!player) continue;

    const playerPos = player.get(Position);
    moveToward(entity, playerPos.x, playerPos.y, collisionGrid, mapWidth);
  }

  // 'idle' NPCs: no action needed
}
