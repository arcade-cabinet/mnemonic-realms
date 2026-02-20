import { afterEach, describe, expect, it } from 'vitest';
import { universe } from 'koota';
import { createGameWorld } from '../../../../engine/ecs/world.js';
import {
  Facing,
  Health,
  Player,
  Position,
  Velocity,
  Interactable,
  Dialogue,
} from '../../../../engine/ecs/traits.js';
import { TILE_SIZE } from '../../../../engine/renderer/types.js';
import { AIPlayer } from '../../../../engine/testing/ai-player.js';
import type { AIPlayerConfig } from '../../../../engine/testing/ai-player.js';
import { speedrunStrategy } from '../../../../engine/testing/strategies/speedrun.js';
import { completionistStrategy } from '../../../../engine/testing/strategies/completionist.js';
import type { LoadedMap } from '../../../../engine/world/loader.js';

function makeMinimalMap(): LoadedMap {
  return {
    id: 'test-map',
    width: 5,
    height: 5,
    tileWidth: 16,
    tileHeight: 16,
    layerOrder: ['ground'],
    layers: new Map([['ground', new Uint16Array(25)]]),
    tileStringTable: [''],
    collision: new Uint8Array(25), // all passable
    entities: [],
    spawnPoints: [],
    vibrancyAreas: [],
    transitions: [],
  };
}

function makeConfig(world: ReturnType<typeof createGameWorld>): AIPlayerConfig {
  const map = makeMinimalMap();
  return {
    strategy: speedrunStrategy,
    world,
    collisionGrid: map.collision,
    mapWidth: map.width,
    mapData: map,
  };
}

afterEach(() => {
  universe.reset();
});

describe('AIPlayer', () => {
  it('constructs without error', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 0, y: 0 }), Velocity({ x: 0, y: 0 }), Player);
    const ai = new AIPlayer(makeConfig(world));
    expect(ai).toBeDefined();
    expect(ai.getCurrentGoal()).toBe('idle');
  });

  it('tick returns telemetry with position', () => {
    const world = createGameWorld();
    world.spawn(
      Position({ x: TILE_SIZE, y: TILE_SIZE }),
      Velocity({ x: 0, y: 0 }),
      Facing({ direction: 'down' }),
      Player,
    );
    const ai = new AIPlayer(makeConfig(world));
    const telemetry = ai.tick(16);

    expect(telemetry.tick).toBe(1);
    expect(telemetry.position.x).toBe(TILE_SIZE);
    expect(telemetry.position.y).toBe(TILE_SIZE);
    expect(telemetry.errors).toEqual([]);
  });

  it('reports error when no player entity exists', () => {
    const world = createGameWorld();
    const ai = new AIPlayer(makeConfig(world));
    const telemetry = ai.tick(16);

    expect(telemetry.errors).toContain('No player entity found');
  });

  it('detects stuck state after threshold ticks', () => {
    const world = createGameWorld();
    // Place player at (0,0) with a wall blocking all movement
    const grid = new Uint8Array(25).fill(1);
    grid[0] = 0; // only (0,0) is passable
    const map = makeMinimalMap();
    map.collision = grid;

    world.spawn(
      Position({ x: 0, y: 0 }),
      Velocity({ x: 0, y: 0 }),
      Facing({ direction: 'down' }),
      Player,
    );

    const config: AIPlayerConfig = {
      strategy: speedrunStrategy,
      world,
      collisionGrid: grid,
      mapWidth: 5,
      mapData: map,
    };
    const ai = new AIPlayer(config);

    // Not stuck initially
    expect(ai.isStuck()).toBe(false);

    // Tick many times — player can't move
    for (let i = 0; i < 60; i++) {
      ai.tick(16);
    }

    expect(ai.isStuck()).toBe(true);
  });

  it('setStrategy changes the active strategy', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 0, y: 0 }), Velocity({ x: 0, y: 0 }), Player);
    const ai = new AIPlayer(makeConfig(world));

    ai.setStrategy(completionistStrategy);
    // Tick to verify no crash with new strategy
    const telemetry = ai.tick(16);
    expect(telemetry.errors).toEqual([]);
  });

  it('getTelemetryLog accumulates entries', () => {
    const world = createGameWorld();
    world.spawn(
      Position({ x: 0, y: 0 }),
      Velocity({ x: 0, y: 0 }),
      Facing({ direction: 'down' }),
      Player,
    );
    const ai = new AIPlayer(makeConfig(world));

    ai.tick(16);
    ai.tick(16);
    ai.tick(16);

    const log = ai.getTelemetryLog();
    expect(log).toHaveLength(3);
    expect(log[0].tick).toBe(1);
    expect(log[2].tick).toBe(3);
  });

  it('evaluates interact goal when facing an interactable', () => {
    const world = createGameWorld();
    world.spawn(
      Position({ x: TILE_SIZE, y: TILE_SIZE }),
      Velocity({ x: 0, y: 0 }),
      Facing({ direction: 'right' }),
      Player,
    );
    // Place an NPC to the right of the player
    world.spawn(
      Position({ x: 2 * TILE_SIZE, y: TILE_SIZE }),
      Interactable,
      Dialogue({ id: 'test-npc', lines: ['Hello!'], portrait: '' }),
    );

    const ai = new AIPlayer(makeConfig(world));
    ai.tick(16);

    expect(ai.getCurrentGoal()).toBe('interact');
  });
});

