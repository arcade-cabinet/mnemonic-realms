/**
 * World Transition System — Pure state machine for seamless zone changes.
 *
 * Handles transitions between all world types:
 * - overworld ↔ overworld (region boundaries)
 * - overworld ↔ child-world (shop doors, dungeon entrances)
 * - overworld ↔ encounter (combat transitions)
 *
 * This is a PURE state machine — no React, no Skia, no async.
 * The caller is responsible for async JSON loading and rendering.
 * The transition system tells the caller WHAT to do, but doesn't DO it.
 */

import { TILE_SIZE } from '../renderer/types.js';
import type { LoadedMap } from './loader.js';

// ── Types ───────────────────────────────────────────────────────────────────

export type TransitionType = 'overworld' | 'child-world' | 'encounter';
export type TransitionPhase = 'idle' | 'loading' | 'crossfade' | 'complete';

export interface TransitionState {
  phase: TransitionPhase;
  type: TransitionType;
  targetMapId: string;
  targetSpawnId: string;
  progress: number;
  fromMapData?: LoadedMap;
  toMapData?: LoadedMap;
}

/** Result of completing a transition. */
export interface TransitionResult {
  state: TransitionState;
  mapData: LoadedMap;
  spawnId: string;
}

/** Transition target info from a transition zone entity. */
export interface TransitionTarget {
  targetMap: string;
  targetX: number;
  targetY: number;
}

/** Minimal entity shape for transition zone lookup. */
export interface TransitionEntity {
  position: { x: number; y: number };
  transition: { targetMap: string; targetX: number; targetY: number };
}

// ── Default crossfade duration (ms) ─────────────────────────────────────────

const DEFAULT_CROSSFADE_DURATION = 500;

// ── State machine functions ─────────────────────────────────────────────────

/** Create the initial idle transition state. */
export function createTransitionState(): TransitionState {
  return {
    phase: 'idle',
    type: 'overworld',
    targetMapId: '',
    targetSpawnId: '',
    progress: 0,
  };
}

/** Begin a transition to a new map. Sets phase to 'loading'. */
export function beginTransition(
  state: TransitionState,
  targetMapId: string,
  targetSpawnId: string,
  type: TransitionType,
): TransitionState {
  return {
    ...state,
    phase: 'loading',
    type,
    targetMapId,
    targetSpawnId,
    progress: 0,
    toMapData: undefined,
  };
}

/** Called when async JSON fetch completes. Sets phase to 'crossfade'. */
export function onMapLoaded(state: TransitionState, newMapData: LoadedMap): TransitionState {
  return {
    ...state,
    phase: 'crossfade',
    progress: 0,
    toMapData: newMapData,
  };
}

/**
 * Advance the crossfade progress.
 * @param dt - Delta time in milliseconds
 * @param duration - Total crossfade duration in milliseconds (default 500ms)
 */
export function updateCrossfade(
  state: TransitionState,
  dt: number,
  duration: number = DEFAULT_CROSSFADE_DURATION,
): TransitionState {
  const newProgress = Math.min(state.progress + dt / duration, 1);
  return {
    ...state,
    progress: newProgress,
    phase: newProgress >= 1 ? 'complete' : 'crossfade',
  };
}

/**
 * Complete the transition — returns the new map data and spawn point,
 * then resets state to idle.
 */
export function completeTransition(state: TransitionState): TransitionResult {
  if (!state.toMapData) {
    throw new Error('completeTransition called without loaded map data');
  }
  return {
    state: createTransitionState(),
    mapData: state.toMapData,
    spawnId: state.targetSpawnId,
  };
}

/**
 * Check if the player is standing on a transition zone.
 *
 * Player position is in PIXELS. Transition entity positions are in TILES.
 * Converts player position to tiles for comparison.
 */
export function findTransitionAtPosition(
  transitions: TransitionEntity[],
  playerX: number,
  playerY: number,
): TransitionTarget | null {
  const tileX = Math.round(playerX / TILE_SIZE);
  const tileY = Math.round(playerY / TILE_SIZE);

  for (const entity of transitions) {
    if (entity.position.x === tileX && entity.position.y === tileY) {
      return {
        targetMap: entity.transition.targetMap,
        targetX: entity.transition.targetX,
        targetY: entity.transition.targetY,
      };
    }
  }

  return null;
}

/**
 * Find a spawn point in the loaded map data by ID.
 * Spawn points are stored in TILES; returns position in PIXELS.
 */
export function getSpawnPosition(
  mapData: LoadedMap,
  spawnId: string,
): { x: number; y: number } | null {
  const spawn = mapData.spawnPoints.find((sp) => sp.id === spawnId);
  if (!spawn) return null;
  return { x: spawn.x * TILE_SIZE, y: spawn.y * TILE_SIZE };
}
