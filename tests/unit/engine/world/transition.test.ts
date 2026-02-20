import { describe, expect, it } from 'vitest';
import { TILE_SIZE } from '../../../../engine/renderer/types.js';
import { loadMapData } from '../../../../engine/world/loader.js';
import type {
  TransitionEntity,
  TransitionState,
} from '../../../../engine/world/transition.js';
import {
  beginTransition,
  completeTransition,
  createTransitionState,
  findTransitionAtPosition,
  getSpawnPosition,
  onMapLoaded,
  updateCrossfade,
} from '../../../../engine/world/transition.js';
import { FIXTURE_MAP } from './fixture.js';

// ── Helper: create a loaded map from fixture ────────────────────────────────

function makeLoadedMap() {
  return loadMapData(FIXTURE_MAP);
}

// ── Transition entity fixtures ──────────────────────────────────────────────

const TRANSITION_ENTITIES: TransitionEntity[] = [
  {
    position: { x: 2, y: 0 },
    transition: { targetMap: 'tavern-interior', targetX: 5, targetY: 10 },
  },
  {
    position: { x: 0, y: 3 },
    transition: { targetMap: 'frontier', targetX: 59, targetY: 30 },
  },
];

// ── State machine tests ─────────────────────────────────────────────────────

describe('createTransitionState', () => {
  it('starts idle', () => {
    const state = createTransitionState();
    expect(state.phase).toBe('idle');
    expect(state.targetMapId).toBe('');
    expect(state.targetSpawnId).toBe('');
    expect(state.progress).toBe(0);
  });
});

describe('beginTransition', () => {
  it('sets correct phase and target', () => {
    const state = createTransitionState();
    const next = beginTransition(state, 'tavern-interior', 'from-town', 'child-world');
    expect(next.phase).toBe('loading');
    expect(next.type).toBe('child-world');
    expect(next.targetMapId).toBe('tavern-interior');
    expect(next.targetSpawnId).toBe('from-town');
    expect(next.progress).toBe(0);
  });

  it('does not mutate original state', () => {
    const state = createTransitionState();
    beginTransition(state, 'tavern-interior', 'from-town', 'child-world');
    expect(state.phase).toBe('idle');
  });
});

describe('onMapLoaded', () => {
  it('transitions to crossfade', () => {
    const state = beginTransition(
      createTransitionState(),
      'tavern-interior',
      'from-town',
      'child-world',
    );
    const mapData = makeLoadedMap();
    const next = onMapLoaded(state, mapData);
    expect(next.phase).toBe('crossfade');
    expect(next.progress).toBe(0);
    expect(next.toMapData).toBe(mapData);
  });
});

describe('updateCrossfade', () => {
  it('advances progress correctly', () => {
    let state: TransitionState = onMapLoaded(
      beginTransition(createTransitionState(), 'test', 'spawn', 'overworld'),
      makeLoadedMap(),
    );
    state = updateCrossfade(state, 100, 500);
    expect(state.progress).toBeCloseTo(0.2);
    expect(state.phase).toBe('crossfade');
  });

  it('completes at progress >= 1', () => {
    let state: TransitionState = onMapLoaded(
      beginTransition(createTransitionState(), 'test', 'spawn', 'overworld'),
      makeLoadedMap(),
    );
    state = updateCrossfade(state, 500, 500);
    expect(state.progress).toBe(1);
    expect(state.phase).toBe('complete');
  });

  it('clamps progress to 1 when overshooting', () => {
    let state: TransitionState = onMapLoaded(
      beginTransition(createTransitionState(), 'test', 'spawn', 'overworld'),
      makeLoadedMap(),
    );
    state = updateCrossfade(state, 1000, 500);
    expect(state.progress).toBe(1);
    expect(state.phase).toBe('complete');
  });
});

describe('completeTransition', () => {
  it('returns map data and resets to idle', () => {
    const mapData = makeLoadedMap();
    let state: TransitionState = beginTransition(
      createTransitionState(),
      'tavern-interior',
      'player-spawn',
      'child-world',
    );
    state = onMapLoaded(state, mapData);
    state = updateCrossfade(state, 500, 500);

    const result = completeTransition(state);
    expect(result.mapData).toBe(mapData);
    expect(result.spawnId).toBe('player-spawn');
    expect(result.state.phase).toBe('idle');
    expect(result.state.targetMapId).toBe('');
  });
});

describe('full lifecycle', () => {
  it('idle → loading → crossfade → complete → idle', () => {
    const mapData = makeLoadedMap();

    let state = createTransitionState();
    expect(state.phase).toBe('idle');

    state = beginTransition(state, 'tavern-interior', 'from-town', 'child-world');
    expect(state.phase).toBe('loading');

    state = onMapLoaded(state, mapData);
    expect(state.phase).toBe('crossfade');
    expect(state.progress).toBe(0);

    // Advance halfway
    state = updateCrossfade(state, 250, 500);
    expect(state.phase).toBe('crossfade');
    expect(state.progress).toBeCloseTo(0.5);

    // Complete crossfade
    state = updateCrossfade(state, 250, 500);
    expect(state.phase).toBe('complete');

    // Finalize
    const result = completeTransition(state);
    expect(result.state.phase).toBe('idle');
    expect(result.mapData).toBe(mapData);
    expect(result.spawnId).toBe('from-town');
  });
});

// ── Transition zone lookup tests ────────────────────────────────────────────

describe('findTransitionAtPosition', () => {
  it('finds correct transition when player is on zone', () => {
    // Player at tile (2, 0) in pixels
    const result = findTransitionAtPosition(
      TRANSITION_ENTITIES,
      2 * TILE_SIZE,
      0 * TILE_SIZE,
    );
    expect(result).not.toBeNull();
    expect(result!.targetMap).toBe('tavern-interior');
    expect(result!.targetX).toBe(5);
    expect(result!.targetY).toBe(10);
  });

  it('returns null when not on transition', () => {
    // Player at tile (1, 1) — no transition there
    const result = findTransitionAtPosition(
      TRANSITION_ENTITIES,
      1 * TILE_SIZE,
      1 * TILE_SIZE,
    );
    expect(result).toBeNull();
  });

  it('returns null for empty transitions array', () => {
    const result = findTransitionAtPosition([], 0, 0);
    expect(result).toBeNull();
  });
});

// ── Spawn point lookup tests ────────────────────────────────────────────────

describe('getSpawnPosition', () => {
  it('finds spawn point by ID and returns pixel position', () => {
    const mapData = makeLoadedMap();
    const pos = getSpawnPosition(mapData, 'player-spawn');
    expect(pos).not.toBeNull();
    // Fixture spawn is at tile (2, 2) → pixels (32, 32)
    expect(pos!.x).toBe(2 * TILE_SIZE);
    expect(pos!.y).toBe(2 * TILE_SIZE);
  });

  it('returns null for unknown ID', () => {
    const mapData = makeLoadedMap();
    const pos = getSpawnPosition(mapData, 'nonexistent-spawn');
    expect(pos).toBeNull();
  });
});

