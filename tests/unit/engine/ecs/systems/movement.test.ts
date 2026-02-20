import { afterEach, describe, expect, it } from 'vitest';
import { universe } from 'koota';
import { createGameWorld } from '../../../../../engine/ecs/world.js';
import {
  Facing,
  Player,
  Position,
  Velocity,
} from '../../../../../engine/ecs/traits.js';
import { movementSystem } from '../../../../../engine/ecs/systems/movement.js';
import { TILE_SIZE } from '../../../../../engine/renderer/types.js';

afterEach(() => {
  universe.reset();
});

describe('movementSystem', () => {
  it('moves entity by velocity × TILE_SIZE', () => {
    const world = createGameWorld();
    const entity = world.spawn(
      Position({ x: 16, y: 16 }), // tile (1,1)
      Velocity({ x: 1, y: 0 }),   // move right
      Player,
    );

    movementSystem(world);

    const pos = entity.get(Position);
    expect(pos.x).toBe(2 * TILE_SIZE); // 32
    expect(pos.y).toBe(1 * TILE_SIZE); // 16
  });

  it('clears velocity after applying movement', () => {
    const world = createGameWorld();
    const entity = world.spawn(
      Position({ x: 0, y: 0 }),
      Velocity({ x: 1, y: 0 }),
      Player,
    );

    movementSystem(world);

    const vel = entity.get(Velocity);
    expect(vel.x).toBe(0);
    expect(vel.y).toBe(0);
  });

  it('does not move entity with zero velocity', () => {
    const world = createGameWorld();
    const entity = world.spawn(
      Position({ x: 32, y: 48 }),
      Velocity({ x: 0, y: 0 }),
      Player,
    );

    movementSystem(world);

    const pos = entity.get(Position);
    expect(pos.x).toBe(32);
    expect(pos.y).toBe(48);
  });

  it('moves entity up (negative y)', () => {
    const world = createGameWorld();
    const entity = world.spawn(
      Position({ x: 32, y: 32 }), // tile (2,2)
      Velocity({ x: 0, y: -1 }),  // move up
    );

    movementSystem(world);

    const pos = entity.get(Position);
    expect(pos.x).toBe(32);
    expect(pos.y).toBe(16); // tile (2,1)
  });

  it('moves entity left (negative x)', () => {
    const world = createGameWorld();
    const entity = world.spawn(
      Position({ x: 48, y: 16 }), // tile (3,1)
      Velocity({ x: -1, y: 0 }),  // move left
    );

    movementSystem(world);

    const pos = entity.get(Position);
    expect(pos.x).toBe(32); // tile (2,1)
    expect(pos.y).toBe(16);
  });

  it('updates facing direction when entity has Facing trait', () => {
    const world = createGameWorld();
    const entity = world.spawn(
      Position({ x: 16, y: 16 }),
      Velocity({ x: 0, y: -1 }),
      Facing({ direction: 'down' }),
      Player,
    );

    movementSystem(world);

    expect(entity.get(Facing).direction).toBe('up');
  });

  it('blocks movement into collision grid', () => {
    const world = createGameWorld();
    // 3x3 grid, center tile blocked
    const grid = new Uint8Array([
      0, 0, 0,
      0, 1, 0,
      0, 0, 0,
    ]);
    const entity = world.spawn(
      Position({ x: 0 * TILE_SIZE, y: 1 * TILE_SIZE }), // tile (0,1)
      Velocity({ x: 1, y: 0 }), // try to move right into (1,1) which is blocked
    );

    movementSystem(world, grid, 3);

    const pos = entity.get(Position);
    expect(pos.x).toBe(0 * TILE_SIZE); // stayed
    expect(pos.y).toBe(1 * TILE_SIZE);
  });

  it('allows movement into passable tile with collision grid', () => {
    const world = createGameWorld();
    const grid = new Uint8Array([
      0, 0, 0,
      0, 1, 0,
      0, 0, 0,
    ]);
    const entity = world.spawn(
      Position({ x: 0, y: 0 }), // tile (0,0)
      Velocity({ x: 1, y: 0 }), // move right to (1,0) which is passable
    );

    movementSystem(world, grid, 3);

    const pos = entity.get(Position);
    expect(pos.x).toBe(1 * TILE_SIZE);
    expect(pos.y).toBe(0);
  });

  it('blocks movement out of bounds with collision grid', () => {
    const world = createGameWorld();
    const grid = new Uint8Array([0, 0, 0, 0]); // 2x2 all passable
    const entity = world.spawn(
      Position({ x: 0, y: 0 }),
      Velocity({ x: -1, y: 0 }), // try to move left out of bounds
    );

    movementSystem(world, grid, 2);

    const pos = entity.get(Position);
    expect(pos.x).toBe(0); // stayed
    expect(pos.y).toBe(0);
  });

  it('moves multiple entities independently', () => {
    const world = createGameWorld();
    const e1 = world.spawn(Position({ x: 0, y: 0 }), Velocity({ x: 1, y: 0 }));
    const e2 = world.spawn(Position({ x: 32, y: 32 }), Velocity({ x: 0, y: 1 }));

    movementSystem(world);

    expect(e1.get(Position)).toEqual({ x: 16, y: 0 });
    expect(e2.get(Position)).toEqual({ x: 32, y: 48 });
  });
});

