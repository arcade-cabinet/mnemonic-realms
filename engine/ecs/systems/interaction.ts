/**
 * Interaction System — Pure functions for entity interaction detection.
 *
 * Checks the tile in the player's facing direction for an Interactable entity.
 * Returns the entity and determines interaction type from trait composition.
 *
 * Position stores x,y in PIXELS (tile × 16).
 * Facing offsets: up→(0,-16), down→(0,+16), left→(-16,0), right→(+16,0).
 */

import type { Entity, World } from 'koota';
import { TILE_SIZE } from '../../renderer/types.js';
import { interactableQuery } from '../queries.js';
import { Chest, Dialogue, Position, ResonanceStone, Transition } from '../traits.js';

// ── Types ───────────────────────────────────────────────────────────────────

export type InteractionType = 'dialogue' | 'chest' | 'transition' | 'resonance-stone';

export interface DialogueData {
  id: string;
  lines: string[] | null;
  portrait: string;
}

export interface ChestData {
  contents: string[] | null;
  opened: boolean;
}

export interface TransitionData {
  targetMap: string;
  targetX: number;
  targetY: number;
}

export interface ResonanceStoneData {
  stoneId: string;
  discovered: boolean;
  message: string;
}

export type InteractionResult =
  | { type: 'dialogue'; data: DialogueData }
  | { type: 'chest'; data: ChestData }
  | { type: 'transition'; data: TransitionData }
  | { type: 'resonance-stone'; data: ResonanceStoneData }
  | null;

// ── Facing offsets ──────────────────────────────────────────────────────────

const FACING_OFFSETS: Record<string, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -TILE_SIZE },
  down: { dx: 0, dy: TILE_SIZE },
  left: { dx: -TILE_SIZE, dy: 0 },
  right: { dx: TILE_SIZE, dy: 0 },
};

// ── Find interactable entity ────────────────────────────────────────────────

/**
 * Find an interactable entity at the tile the player is facing.
 *
 * @param world - The Koota ECS world
 * @param playerX - Player X position in pixels
 * @param playerY - Player Y position in pixels
 * @param facing - Player facing direction
 * @returns The interactable entity, or null if none found
 */
export function findInteractable(
  world: World,
  playerX: number,
  playerY: number,
  facing: string,
): Entity | null {
  const offset = FACING_OFFSETS[facing];
  if (!offset) return null;

  const targetX = playerX + offset.dx;
  const targetY = playerY + offset.dy;

  const entities = world.query(interactableQuery);

  for (const entity of entities) {
    const pos = entity.get(Position);
    if (pos.x === targetX && pos.y === targetY) {
      return entity;
    }
  }

  return null;
}

// ── Trigger interaction ─────────────────────────────────────────────────────

/**
 * Determine the interaction type and extract data from an interactable entity.
 *
 * Checks trait composition to determine type:
 * - Dialogue → 'dialogue'
 * - Chest → 'chest'
 * - Transition → 'transition'
 * - ResonanceStone → 'resonance-stone'
 *
 * @param entity - The interactable entity
 * @returns Interaction result with type and data, or null if no recognized traits
 */
export function triggerInteraction(entity: Entity): InteractionResult {
  if (entity.has(Dialogue)) {
    const dlg = entity.get(Dialogue);
    return {
      type: 'dialogue',
      data: { id: dlg.id, lines: dlg.lines, portrait: dlg.portrait },
    };
  }

  if (entity.has(Chest)) {
    const chest = entity.get(Chest);
    return {
      type: 'chest',
      data: { contents: chest.contents, opened: chest.opened },
    };
  }

  if (entity.has(Transition)) {
    const trans = entity.get(Transition);
    return {
      type: 'transition',
      data: { targetMap: trans.targetMap, targetX: trans.targetX, targetY: trans.targetY },
    };
  }

  if (entity.has(ResonanceStone)) {
    const stone = entity.get(ResonanceStone);
    return {
      type: 'resonance-stone',
      data: { stoneId: stone.stoneId, discovered: stone.discovered, message: stone.message },
    };
  }

  return null;
}
