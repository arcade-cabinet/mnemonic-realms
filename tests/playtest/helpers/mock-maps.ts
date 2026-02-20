/**
 * Mock map fixtures for playtest suite.
 *
 * Provides minimal RuntimeMapData objects and LoadedMap helpers
 * for testing AI player traversal across different world types.
 */

import type { RuntimeMapData } from '../../../gen/assemblage/pipeline/runtime-types.js';
import type { LoadedMap } from '../../../engine/world/loader.js';
import { loadMapData } from '../../../engine/world/loader.js';

// ── Overworld Map (10×10) ──────────────────────────────────────────────────

const OVERWORLD_SIZE = 10;

function makeGrassLayer(size: number): string[] {
  return Array.from({ length: size * size }, () => 'terrain:grass');
}

function makeOpenCollision(size: number): number[] {
  return Array.from({ length: size * size }, () => 0);
}

export const OVERWORLD_MAP: RuntimeMapData = {
  id: 'settled-lands-everwick',
  width: OVERWORLD_SIZE,
  height: OVERWORLD_SIZE,
  tileWidth: 16,
  tileHeight: 16,
  layerOrder: ['ground'],
  layers: { ground: makeGrassLayer(OVERWORLD_SIZE) },
  collision: makeOpenCollision(OVERWORLD_SIZE),
  visuals: [],
  objects: [
    { name: 'player-spawn', type: 'spawn', x: 2, y: 2 },
    {
      name: 'artun-npc',
      type: 'npc',
      x: 4,
      y: 4,
      properties: { sprite: 'artun', dialogueId: 'artun-greeting', portrait: 'artun.png', facing: 'down' },
    },
    {
      name: 'shop-door',
      type: 'transition',
      x: 7,
      y: 3,
      width: 1,
      height: 1,
      properties: { target: 'everwick-shop', targetX: 2, targetY: 4 },
    },
    {
      name: 'quest-trigger-mq01',
      type: 'trigger',
      x: 5,
      y: 5,
      properties: { eventId: 'mq01-start', condition: 'quest.mq01 == false' },
    },
  ],
  hooks: [],
  spawnPoints: [{ id: 'player-spawn', x: 2, y: 2 }],
  transitions: [
    { id: 'shop-door', x: 7, y: 3, width: 1, height: 1, target: 'everwick-shop', type: 'door' },
  ],
  vibrancyAreas: [
    { id: 'everwick-center', x: 0, y: 0, width: 10, height: 10, initialState: 'remembered' },
  ],
};

// ── Shop Interior (5×5) ────────────────────────────────────────────────────

export const SHOP_MAP: RuntimeMapData = {
  id: 'everwick-shop',
  width: 5,
  height: 5,
  tileWidth: 16,
  tileHeight: 16,
  layerOrder: ['ground'],
  layers: { ground: makeGrassLayer(5) },
  collision: makeOpenCollision(5),
  visuals: [],
  objects: [
    { name: 'player-spawn', type: 'spawn', x: 2, y: 4 },
    {
      name: 'shopkeeper',
      type: 'npc',
      x: 2,
      y: 1,
      properties: { sprite: 'shopkeeper', dialogueId: 'shop-greeting', portrait: 'shopkeeper.png', facing: 'down' },
    },
    {
      name: 'exit-door',
      type: 'transition',
      x: 2,
      y: 4,
      width: 1,
      height: 1,
      properties: { target: 'settled-lands-everwick', targetX: 7, targetY: 4 },
    },
  ],
  hooks: [],
  spawnPoints: [{ id: 'player-spawn', x: 2, y: 4 }],
  transitions: [
    { id: 'exit-door', x: 2, y: 4, width: 1, height: 1, target: 'settled-lands-everwick', type: 'door' },
  ],
  vibrancyAreas: [
    { id: 'shop-interior', x: 0, y: 0, width: 5, height: 5, initialState: 'remembered' },
  ],
};

// ── Dungeon Map (8×8) ──────────────────────────────────────────────────────

export const DUNGEON_MAP: RuntimeMapData = {
  id: 'whispering-caves-floor1',
  width: 8,
  height: 8,
  tileWidth: 16,
  tileHeight: 16,
  layerOrder: ['ground'],
  layers: { ground: makeGrassLayer(8) },
  collision: makeOpenCollision(8),
  visuals: [],
  objects: [
    { name: 'player-spawn', type: 'spawn', x: 1, y: 7 },
    {
      name: 'floor2-stairs',
      type: 'transition',
      x: 6,
      y: 1,
      width: 1,
      height: 1,
      properties: { target: 'whispering-caves-floor2', targetX: 1, targetY: 7 },
    },
  ],
  hooks: [],
  spawnPoints: [{ id: 'player-spawn', x: 1, y: 7 }],
  transitions: [
    { id: 'floor2-stairs', x: 6, y: 1, width: 1, height: 1, target: 'whispering-caves-floor2', type: 'stairs' },
  ],
  vibrancyAreas: [
    { id: 'caves-entrance', x: 0, y: 4, width: 8, height: 4, initialState: 'remembered' },
    { id: 'caves-depths', x: 0, y: 0, width: 8, height: 4, initialState: 'partial' },
  ],
};

/** Load a RuntimeMapData into a LoadedMap for engine use. */
export function loadTestMap(data: RuntimeMapData): LoadedMap {
  return loadMapData(data);
}

