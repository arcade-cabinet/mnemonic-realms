import { afterEach, describe, expect, it } from 'vitest';
import { universe } from 'koota';
import { createGameWorld } from '../../../../../engine/ecs/world.js';
import { Player, Position, Velocity } from '../../../../../engine/ecs/traits.js';
import { TILE_SIZE } from '../../../../../engine/renderer/types.js';
import { findPath, moveAlongPath } from '../../../../../engine/testing/behaviors/navigation.js';

afterEach(() => {
  universe.reset();
});

describe('findPath', () => {
  it('returns single-element path when start equals goal', () => {
    const grid = new Uint8Array([0, 0, 0, 0]); // 2x2 all passable
    const path = findPath(grid, 2, { x: 0, y: 0 }, { x: 0, y: 0 });
    expect(path).toEqual([{ x: 0, y: 0 }]);
  });

  it('finds straight-line path on open grid', () => {
    // 3x1 row, all passable
    const grid = new Uint8Array([0, 0, 0]);
    const path = findPath(grid, 3, { x: 0, y: 0 }, { x: 2, y: 0 });
    expect(path).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ]);
  });

  it('navigates around obstacles', () => {
    // 3x3 grid with center blocked
    const grid = new Uint8Array([
      0, 0, 0,
      0, 1, 0,
      0, 0, 0,
    ]);
    const path = findPath(grid, 3, { x: 0, y: 1 }, { x: 2, y: 1 });
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toEqual({ x: 0, y: 1 });
    expect(path[path.length - 1]).toEqual({ x: 2, y: 1 });
    // Should not pass through (1,1)
    const passesCenter = path.some((t) => t.x === 1 && t.y === 1);
    expect(passesCenter).toBe(false);
  });

  it('returns empty array when goal is blocked', () => {
    const grid = new Uint8Array([0, 1, 0, 0]); // 2x2, (1,0) blocked
    const path = findPath(grid, 2, { x: 0, y: 0 }, { x: 1, y: 0 });
    expect(path).toEqual([]);
  });

  it('returns empty array when goal is unreachable', () => {
    // 3x3 grid with wall blocking right side
    const grid = new Uint8Array([
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    ]);
    const path = findPath(grid, 3, { x: 0, y: 0 }, { x: 2, y: 0 });
    expect(path).toEqual([]);
  });

  it('returns empty array for out-of-bounds start', () => {
    const grid = new Uint8Array([0, 0, 0, 0]);
    const path = findPath(grid, 2, { x: -1, y: 0 }, { x: 1, y: 0 });
    expect(path).toEqual([]);
  });

  it('returns empty array for out-of-bounds goal', () => {
    const grid = new Uint8Array([0, 0, 0, 0]);
    const path = findPath(grid, 2, { x: 0, y: 0 }, { x: 5, y: 5 });
    expect(path).toEqual([]);
  });

  it('finds path on larger grid', () => {
    // 5x5 grid with L-shaped wall
    const grid = new Uint8Array([
      0, 0, 0, 0, 0,
      0, 1, 1, 1, 0,
      0, 0, 0, 1, 0,
      0, 0, 0, 1, 0,
      0, 0, 0, 0, 0,
    ]);
    const path = findPath(grid, 5, { x: 0, y: 0 }, { x: 4, y: 4 });
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toEqual({ x: 0, y: 0 });
    expect(path[path.length - 1]).toEqual({ x: 4, y: 4 });
  });
});

describe('moveAlongPath', () => {
  it('sets velocity toward next tile in path', () => {
    const world = createGameWorld();
    const player = world.spawn(
      Position({ x: 0, y: 0 }),
      Velocity({ x: 0, y: 0 }),
      Player,
    );

    const path = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
    const nextIdx = moveAlongPath(world, path, 0);

    expect(nextIdx).toBe(1);
    const vel = player.get(Velocity);
    expect(vel.x).toBe(1);
    expect(vel.y).toBe(0);
  });

  it('returns -1 when at end of path', () => {
    const world = createGameWorld();
    world.spawn(
      Position({ x: 2 * TILE_SIZE, y: 0 }),
      Velocity({ x: 0, y: 0 }),
      Player,
    );

    const path = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
    const nextIdx = moveAlongPath(world, path, 2);
    expect(nextIdx).toBe(-1);
  });

  it('returns -1 when no player entity exists', () => {
    const world = createGameWorld();
    const path = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
    const nextIdx = moveAlongPath(world, path, 0);
    expect(nextIdx).toBe(-1);
  });
});

