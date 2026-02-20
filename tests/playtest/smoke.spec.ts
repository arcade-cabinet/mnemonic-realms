/**
 * Smoke Test — Quick sanity check for the playtest infrastructure.
 *
 * Verifies: map loads, player spawns, AI ticks without errors,
 * player moves, no stuck state after 100 ticks.
 */

import { describe, expect, it } from 'vitest';
import { AIPlayer } from '../../engine/testing/ai-player.js';
import { completionistStrategy } from '../../engine/testing/strategies/completionist.js';
import { speedrunStrategy } from '../../engine/testing/strategies/speedrun.js';
import { sideQuestFocusStrategy } from '../../engine/testing/strategies/side-quest-focus.js';
import { TILE_SIZE } from '../../engine/renderer/types.js';
import {
  createTestWorld,
  buildConfig,
  loadDefaultMap,
  registerCleanup,
  runTicks,
} from './helpers/setup.js';

registerCleanup();

describe('Smoke Test', () => {
  it('loads a map and spawns a player', () => {
    const map = loadDefaultMap();
    expect(map.id).toBe('settled-lands-everwick');
    expect(map.width).toBe(10);
    expect(map.collision).toBeInstanceOf(Uint8Array);
    expect(map.spawnPoints.length).toBeGreaterThan(0);
  });

  it('AI player ticks 100 times without errors', () => {
    const map = loadDefaultMap();
    const world = createTestWorld(2, 2);
    const config = buildConfig(world, map, completionistStrategy);
    const ai = new AIPlayer(config);

    const errors: string[] = [];
    for (let i = 0; i < 100; i++) {
      const t = ai.tick(16);
      errors.push(...t.errors);
    }

    expect(errors).toEqual([]);
  });

  it('player moves from spawn position within 100 ticks', () => {
    const map = loadDefaultMap();
    const world = createTestWorld(2, 2);
    const config = buildConfig(world, map, completionistStrategy);
    const ai = new AIPlayer(config);

    const startPos = { x: 2 * TILE_SIZE, y: 2 * TILE_SIZE };
    runTicks(ai, 100);

    const log = ai.getTelemetryLog();
    const lastEntry = log[log.length - 1];

    // Player should have moved from spawn
    const moved =
      lastEntry.position.x !== startPos.x ||
      lastEntry.position.y !== startPos.y;
    expect(moved).toBe(true);
  });

  it('AI player is not stuck after 100 ticks on open map', () => {
    const map = loadDefaultMap();
    const world = createTestWorld(2, 2);
    const config = buildConfig(world, map, completionistStrategy);
    const ai = new AIPlayer(config);

    runTicks(ai, 100);
    expect(ai.isStuck()).toBe(false);
  });

  it('all three strategies construct without error', () => {
    const map = loadDefaultMap();

    for (const strategy of [completionistStrategy, speedrunStrategy, sideQuestFocusStrategy]) {
      const world = createTestWorld(2, 2);
      const config = buildConfig(world, map, strategy);
      const ai = new AIPlayer(config);
      const t = ai.tick(16);
      expect(t.errors).toEqual([]);
    }
  });

  it('telemetry log accumulates entries', () => {
    const map = loadDefaultMap();
    const world = createTestWorld(2, 2);
    const config = buildConfig(world, map, speedrunStrategy);
    const ai = new AIPlayer(config);

    runTicks(ai, 50);

    const log = ai.getTelemetryLog();
    expect(log).toHaveLength(50);
    expect(log[0].tick).toBe(1);
    expect(log[49].tick).toBe(50);
  });
});

