/**
 * Minimal 4×4 map fixture for loader/spawner tests.
 */
import type { RuntimeMapData } from '../../../../gen/assemblage/pipeline/runtime-types.js';

/** A minimal 4×4 map with a few objects for testing. */
export const FIXTURE_MAP: RuntimeMapData = {
  id: 'test-map',
  width: 4,
  height: 4,
  tileWidth: 16,
  tileHeight: 16,
  layerOrder: ['ground', 'objects'],
  layers: {
    ground: [
      'terrain:grass', 'terrain:grass', 'terrain:grass', 'terrain:grass',
      'terrain:grass', 'terrain:path', 'terrain:path', 'terrain:grass',
      'terrain:grass', 'terrain:path', 'terrain:path', 'terrain:grass',
      'terrain:grass', 'terrain:grass', 'terrain:grass', 'terrain:grass',
    ],
    objects: [
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 'object:well', 0,
      0, 0, 0, 0,
    ],
  },
  collision: [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    1, 1, 0, 0,
  ],
  visuals: [
    { objectRef: 'building.house-red-1', x: 0, y: 0 },
  ],
  objects: [
    {
      name: 'artun-npc',
      type: 'npc',
      x: 1,
      y: 1,
      properties: {
        sprite: 'artun',
        dialogue: 'artun-greeting',
        portrait: 'artun.png',
        facing: 'down',
      },
    },
    {
      name: 'treasure-1',
      type: 'chest',
      x: 3,
      y: 2,
      properties: {
        sprite: 'chest-wood',
        item: 'potion',
        quantity: 2,
      },
    },
    {
      name: 'door-tavern',
      type: 'transition',
      x: 2,
      y: 0,
      width: 1,
      height: 1,
      properties: {
        targetWorld: 'tavern-interior',
        targetX: 5,
        targetY: 10,
      },
    },
    {
      name: 'quest-trigger-1',
      type: 'trigger',
      x: 0,
      y: 3,
      properties: {
        eventId: 'mq01-start',
        condition: 'quest.mq01 == false',
      },
    },
    {
      name: 'player-spawn',
      type: 'spawn',
      x: 2,
      y: 2,
    },
    {
      name: 'stone-memory-1',
      type: 'npc',
      x: 3,
      y: 3,
      properties: {
        subtype: 'resonance-stone',
        fragment: 'A faint memory echoes...',
        sprite: 'resonance-stone',
      },
    },
  ],
  hooks: [
    {
      objectName: 'artun-npc',
      eventClass: 'ArtunEvent',
      importPath: './events/artun.ts',
    },
  ],
  spawnPoints: [
    { id: 'player-spawn', x: 2, y: 2 },
  ],
  transitions: [
    {
      id: 'door-tavern',
      x: 2,
      y: 0,
      width: 1,
      height: 1,
      target: 'tavern-interior',
      type: 'door',
    },
  ],
  vibrancyAreas: [
    {
      id: 'town-center',
      x: 0,
      y: 0,
      width: 4,
      height: 4,
      initialState: 'remembered',
    },
  ],
};

