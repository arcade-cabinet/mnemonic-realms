import { afterEach, describe, expect, it } from 'vitest';
import { universe } from 'koota';
import { createGameWorld } from '../../../../../engine/ecs/world.js';
import {
  AiState,
  Facing,
  Npc,
  PatrolPath,
  Player,
  Position,
} from '../../../../../engine/ecs/traits.js';
import { npcAiSystem } from '../../../../../engine/ecs/systems/npc-ai.js';
import { TILE_SIZE } from '../../../../../engine/renderer/types.js';

afterEach(() => {
  universe.reset();
});

// Helper: create a passable collision grid
function makePassableGrid(width: number, height: number): Uint8Array {
  return new Uint8Array(width * height); // all zeros = passable
}

describe('npcAiSystem — idle', () => {
  it('idle NPC does not move', () => {
    const world = createGameWorld();
    const npc = world.spawn(
      Position({ x: 2 * TILE_SIZE, y: 2 * TILE_SIZE }),
      Npc,
      AiState({ state: 'idle' }),
    );

    const grid = makePassableGrid(10, 10);
    npcAiSystem(world, grid, 10);

    const pos = npc.get(Position);
    expect(pos.x).toBe(2 * TILE_SIZE);
    expect(pos.y).toBe(2 * TILE_SIZE);
  });
});

describe('npcAiSystem — patrol', () => {
  it('moves toward first patrol point', () => {
    const world = createGameWorld();
    const npc = world.spawn(
      Position({ x: 2 * TILE_SIZE, y: 2 * TILE_SIZE }),
      Npc,
      AiState({ state: 'patrol' }),
      Facing({ direction: 'down' }),
      PatrolPath({
        points: [{ x: 4, y: 2 }, { x: 4, y: 4 }, { x: 2, y: 4 }],
        currentIndex: 0,
      }),
    );

    const grid = makePassableGrid(10, 10);
    npcAiSystem(world, grid, 10);

    const pos = npc.get(Position);
    // Should move one tile toward (4*16, 2*16) = right
    expect(pos.x).toBe(3 * TILE_SIZE);
    expect(pos.y).toBe(2 * TILE_SIZE);
  });

  it('advances to next patrol point when reaching current target', () => {
    const world = createGameWorld();
    const npc = world.spawn(
      Position({ x: 4 * TILE_SIZE, y: 2 * TILE_SIZE }), // already at point 0
      Npc,
      AiState({ state: 'patrol' }),
      Facing({ direction: 'down' }),
      PatrolPath({
        points: [{ x: 4, y: 2 }, { x: 4, y: 4 }],
        currentIndex: 0,
      }),
    );

    const grid = makePassableGrid(10, 10);
    npcAiSystem(world, grid, 10);

    // Should advance currentIndex to 1
    const path = npc.get(PatrolPath);
    expect(path.currentIndex).toBe(1);
  });

  it('wraps patrol index back to 0', () => {
    const world = createGameWorld();
    const npc = world.spawn(
      Position({ x: 2 * TILE_SIZE, y: 4 * TILE_SIZE }), // at last point
      Npc,
      AiState({ state: 'patrol' }),
      Facing({ direction: 'down' }),
      PatrolPath({
        points: [{ x: 4, y: 2 }, { x: 2, y: 4 }],
        currentIndex: 1,
      }),
    );

    const grid = makePassableGrid(10, 10);
    npcAiSystem(world, grid, 10);

    const path = npc.get(PatrolPath);
    expect(path.currentIndex).toBe(0);
  });

  it('does not move when blocked by collision', () => {
    const world = createGameWorld();
    const npc = world.spawn(
      Position({ x: 2 * TILE_SIZE, y: 2 * TILE_SIZE }),
      Npc,
      AiState({ state: 'patrol' }),
      Facing({ direction: 'down' }),
      PatrolPath({
        points: [{ x: 3, y: 2 }],
        currentIndex: 0,
      }),
    );

    // Block tile (3,2)
    const grid = makePassableGrid(10, 10);
    grid[2 * 10 + 3] = 1;

    npcAiSystem(world, grid, 10);

    const pos = npc.get(Position);
    expect(pos.x).toBe(2 * TILE_SIZE); // stayed
    expect(pos.y).toBe(2 * TILE_SIZE);
  });

  it('updates facing direction when moving', () => {
    const world = createGameWorld();
    const npc = world.spawn(
      Position({ x: 2 * TILE_SIZE, y: 2 * TILE_SIZE }),
      Npc,
      AiState({ state: 'patrol' }),
      Facing({ direction: 'down' }),
      PatrolPath({
        points: [{ x: 2, y: 0 }], // target is above
        currentIndex: 0,
      }),
    );

    const grid = makePassableGrid(10, 10);
    npcAiSystem(world, grid, 10);

    expect(npc.get(Facing).direction).toBe('up');
  });
});

describe('npcAiSystem — follow', () => {
  it('moves toward player', () => {
    const world = createGameWorld();
    world.spawn(
      Position({ x: 5 * TILE_SIZE, y: 5 * TILE_SIZE }),
      Player,
    );

    const npc = world.spawn(
      Position({ x: 3 * TILE_SIZE, y: 5 * TILE_SIZE }),
      Npc,
      AiState({ state: 'follow' }),
      Facing({ direction: 'down' }),
    );

    const grid = makePassableGrid(10, 10);
    npcAiSystem(world, grid, 10);

    const pos = npc.get(Position);
    // Should move one tile right toward player
    expect(pos.x).toBe(4 * TILE_SIZE);
    expect(pos.y).toBe(5 * TILE_SIZE);
  });

  it('does not move when no player exists', () => {
    const world = createGameWorld();
    const npc = world.spawn(
      Position({ x: 3 * TILE_SIZE, y: 3 * TILE_SIZE }),
      Npc,
      AiState({ state: 'follow' }),
      Facing({ direction: 'down' }),
    );

    const grid = makePassableGrid(10, 10);
    npcAiSystem(world, grid, 10);

    const pos = npc.get(Position);
    expect(pos.x).toBe(3 * TILE_SIZE);
    expect(pos.y).toBe(3 * TILE_SIZE);
  });

  it('does not move when already at player position', () => {
    const world = createGameWorld();
    world.spawn(
      Position({ x: 3 * TILE_SIZE, y: 3 * TILE_SIZE }),
      Player,
    );

    const npc = world.spawn(
      Position({ x: 3 * TILE_SIZE, y: 3 * TILE_SIZE }),
      Npc,
      AiState({ state: 'follow' }),
      Facing({ direction: 'down' }),
    );

    const grid = makePassableGrid(10, 10);
    npcAiSystem(world, grid, 10);

    const pos = npc.get(Position);
    expect(pos.x).toBe(3 * TILE_SIZE);
    expect(pos.y).toBe(3 * TILE_SIZE);
  });
});

