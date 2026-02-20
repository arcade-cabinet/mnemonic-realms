/**
 * Everwick — Map 1 composition.
 *
 * The central village of Mnemonic Realms. The most-remembered place in the
 * world — warm lantern light, cobblestone paths, flowering hedges.
 * Starting vibrancy: 60 (Normal). Size: 60x60 tiles at 16px.
 *
 * Creative decision: "Village Hub" was a design-doc placeholder. "Everwick"
 * follows the compound-word naming convention of surrounding zones
 * (Heartfield, Ambergrove, Millbrook, Sunridge). "Ever" = enduring/eternal,
 * "wick" = Old English for settlement — the eternal dwelling.
 *
 * Layout based on docs/maps/overworld-layout.md § Everwick.
 * All coordinates are in 16px tile units (design doc coords × 2).
 *
 * Buildings:
 *   - Elder's House (Artun): Large BlueWood, northeast
 *   - Inn Bright Hearth (Nyro): Large RedWood, east
 *   - General Shop (Khali): Medium GreenWood, center-east
 *   - Blacksmith Hark: Medium RedWood, south-east
 *   - Hana's Workshop: Medium BlueWood, south-west
 *   - Quest Board: Bulletin board, west of center
 *   - Well: Village center
 *
 * Gates: South (→ Heartfield), East (→ Ambergrove), West (→ Millbrook),
 *        North (→ Sunridge, locked until Act II)
 */

import { createHouse } from '../assemblages/buildings/house.ts';
import { createForestBorder } from '../assemblages/terrain/forest-border.ts';
import type { MapComposition } from '../types.ts';

// Map constants
const W = 60;
const H = 60;
const TILE_SIZE = 16;

// Standard RPG-JS tile layers
const LAYERS = ['ground', 'ground2', 'road', 'objects', 'objects_upper'];

// --- Assemblage definitions ---

// Forest borders (4 edges with gate gaps)
const northBorder = createForestBorder({
  edge: 'north',
  length: W,
  depth: 4,
  gap: { start: 27, end: 33 }, // North gate centered at tile 30
});

const southBorder = createForestBorder({
  edge: 'south',
  length: W,
  depth: 4,
  gap: { start: 27, end: 33 }, // South gate
});

// Vertical borders skip corner tiles (covered by horizontal borders)
const westBorder = createForestBorder({
  edge: 'west',
  length: H - 8, // Skip 4 tiles at each end (corners)
  depth: 4,
  gap: { start: 22, end: 28 }, // West gate (adjusted for offset)
});

const eastBorder = createForestBorder({
  edge: 'east',
  length: H - 8,
  depth: 4,
  gap: { start: 22, end: 28 }, // East gate (adjusted for offset)
});

// Buildings
const eldersHouse = createHouse({
  id: 'elders-house',
  name: "Elder's House (Artun)",
  objectRef: 'house.blue-large-1',
  width: 12,
  height: 9,
  npc: {
    name: 'artun',
    x: 6,
    y: 8,
    type: 'npc',
    properties: { dialogue: 'artun-intro', sprite: 'npc_callum' },
  },
});

const innBrightHearth = createHouse({
  id: 'inn-bright-hearth',
  name: 'Inn Bright Hearth (Nyro)',
  objectRef: 'house.red-large-1',
  width: 12,
  height: 9,
  npc: {
    name: 'nyro',
    x: 6,
    y: 8,
    type: 'npc',
    properties: { dialogue: 'nyro-inn', sprite: 'npc_ren' },
  },
});

const generalShop = createHouse({
  id: 'general-shop',
  name: 'General Shop (Khali)',
  objectRef: 'house.green-medium-1',
  width: 10,
  height: 8,
  npc: {
    name: 'khali',
    x: 5,
    y: 7,
    type: 'npc',
    properties: { dialogue: 'khali-shop', sprite: 'npc_maren' },
  },
});

const blacksmith = createHouse({
  id: 'blacksmith',
  name: 'Blacksmith (Hark)',
  objectRef: 'house.red-medium-alt-1',
  width: 10,
  height: 8,
  npc: {
    name: 'hark',
    x: 5,
    y: 7,
    type: 'npc',
    properties: { dialogue: 'hark-forge', sprite: 'npc_torvan' },
  },
});

const workshop = createHouse({
  id: 'workshop',
  name: "Hana's Workshop",
  objectRef: 'house.blue-medium-1',
  width: 10,
  height: 8,
  npc: {
    name: 'hana',
    x: 5,
    y: 7,
    type: 'npc',
    properties: { dialogue: 'hana-workshop', sprite: 'npc_lira' },
  },
});

// --- Map composition ---

export const composition: MapComposition = {
  id: 'everwick',
  name: 'Everwick',
  width: W,
  height: H,
  tileWidth: TILE_SIZE,
  tileHeight: TILE_SIZE,
  paletteName: 'village-premium',
  defaultGround: 'ground.grass',
  layers: LAYERS,

  placements: [
    // Forest borders
    { assemblage: northBorder, x: 0, y: 0 },
    { assemblage: southBorder, x: 0, y: H - 4 },
    { assemblage: westBorder, x: 0, y: 4 }, // Start after north corner
    { assemblage: eastBorder, x: W - 4, y: 4 }, // Start after north corner

    // Buildings — spread out to avoid overlaps
    // Building images are larger in tile units at 16px than design doc suggests
    { assemblage: eldersHouse, x: 36, y: 14 },
    { assemblage: innBrightHearth, x: 44, y: 24 },
    { assemblage: generalShop, x: 34, y: 34 },
    { assemblage: blacksmith, x: 46, y: 36 },
    { assemblage: workshop, x: 14, y: 38 },
  ],

  // Paths connecting locations
  paths: [
    // Main north-south road through village center
    {
      terrain: 'road',
      layer: 'road',
      width: 3,
      points: [
        { x: 30, y: 4 }, // North gate
        { x: 30, y: 12 }, // Center approach
        { x: 30, y: 28 }, // Central square
        { x: 30, y: 50 }, // South gate approach
        { x: 30, y: 56 }, // South gate
      ],
    },
    // East-west road through central square
    {
      terrain: 'road',
      layer: 'road',
      width: 3,
      points: [
        { x: 4, y: 29 }, // West gate
        { x: 14, y: 29 }, // Workshop area
        { x: 30, y: 29 }, // Central square
        { x: 44, y: 29 }, // Shop area
        { x: 56, y: 29 }, // East gate
      ],
    },
    // Path to lookout hill
    {
      terrain: 'road',
      layer: 'road',
      width: 2,
      points: [
        { x: 30, y: 12 }, // Main road junction
        { x: 26, y: 8 }, // Lookout hill approach
      ],
    },
    // Path to training ground
    {
      terrain: 'road',
      layer: 'road',
      width: 2,
      points: [
        { x: 20, y: 29 }, // From main east-west road
        { x: 20, y: 22 }, // Training ground
      ],
    },
    // Path from buildings to main road
    {
      terrain: 'road',
      layer: 'road',
      width: 2,
      points: [
        { x: 34, y: 24 }, // Elder's house front
        { x: 30, y: 24 }, // Main road
      ],
    },
  ],

  // Map-level visual objects (decorative elements not in assemblages)
  visuals: [
    // Well in central square
    { objectRef: 'well.blue', x: 29, y: 27 },

    // Quest board west of center
    { objectRef: 'prop.bulletin-board-1', x: 16, y: 27 },

    // Lamp posts along main road
    { objectRef: 'prop.lamppost-1', x: 28, y: 20 },
    { objectRef: 'prop.lamppost-1', x: 32, y: 20 },
    { objectRef: 'prop.lamppost-1', x: 28, y: 36 },
    { objectRef: 'prop.lamppost-1', x: 32, y: 36 },

    // Lookout hill decorations
    { objectRef: 'tree.emerald-5', x: 22, y: 5 },
    { objectRef: 'bush.emerald-1', x: 28, y: 9 },

    // Training ground area trees
    { objectRef: 'tree.emerald-3', x: 12, y: 18 },
    { objectRef: 'tree.emerald-4', x: 24, y: 18 },

    // Memorial garden trees
    { objectRef: 'tree.light-1', x: 14, y: 30 },
    { objectRef: 'tree.light-2', x: 12, y: 32 },
    { objectRef: 'bush.emerald-2', x: 10, y: 30 },

    // Market stalls near shop
    { objectRef: 'market.stand-1', x: 42, y: 32 },
    { objectRef: 'market.stand-2', x: 44, y: 34 },

    // Barrels near blacksmith
    { objectRef: 'prop.barrel-empty', x: 44, y: 40 },
    { objectRef: 'prop.barrel-water', x: 45, y: 40 },
    { objectRef: 'prop.crate-medium', x: 44, y: 42 },

    // Scattered decorative trees throughout village
    { objectRef: 'tree.emerald-2', x: 8, y: 12 },
    { objectRef: 'tree.emerald-1', x: 48, y: 12 },
    { objectRef: 'tree.light-3', x: 50, y: 42 },
    { objectRef: 'tree.emerald-3', x: 8, y: 48 },
    { objectRef: 'bush.emerald-large', x: 48, y: 48 },
  ],

  // Event objects
  objects: [
    // Player spawn (center of village)
    {
      name: 'player-spawn',
      type: 'spawn',
      x: 30,
      y: 32,
    },

    // Wandering villagers
    {
      name: 'villager-a',
      type: 'npc',
      x: 28,
      y: 30,
      properties: { dialogue: 'villager-gossip-1', sprite: 'npc_villager_m1' },
    },
    {
      name: 'villager-b',
      type: 'npc',
      x: 32,
      y: 32,
      properties: { dialogue: 'villager-gossip-2', sprite: 'npc_villager_f1' },
    },
    {
      name: 'villager-c',
      type: 'npc',
      x: 20,
      y: 44,
      properties: { dialogue: 'villager-gossip-3', sprite: 'npc_villager_m2' },
    },

    // Gate transitions
    {
      name: 'south-gate',
      type: 'transition',
      x: 28,
      y: 56,
      width: 4,
      height: 1,
      properties: { map: 'heartfield', x: 30, y: 0 },
    },
    {
      name: 'east-gate',
      type: 'transition',
      x: 56,
      y: 27,
      width: 1,
      height: 4,
      properties: { map: 'ambergrove', x: 0, y: 40 },
    },
    {
      name: 'west-gate',
      type: 'transition',
      x: 3,
      y: 27,
      width: 1,
      height: 4,
      properties: { map: 'millbrook', x: 78, y: 40 },
    },
    {
      name: 'north-gate',
      type: 'transition',
      x: 28,
      y: 3,
      width: 4,
      height: 1,
      properties: { map: 'sunridge', x: 40, y: 78, condition: 'MQ-04' },
    },

    // Resonance stones
    {
      name: 'rs-ew-01',
      type: 'trigger',
      x: 28,
      y: 28,
      properties: { type: 'resonance-stone', fragment: 'joy/neutral/1' },
    },
    {
      name: 'rs-ew-02',
      type: 'trigger',
      x: 18,
      y: 32,
      properties: { type: 'resonance-stone', fragment: 'calm/earth/1' },
    },
    {
      name: 'rs-ew-03',
      type: 'trigger',
      x: 20,
      y: 34,
      properties: { type: 'resonance-stone', fragment: 'joy/light/1' },
    },

    // Treasure chests
    {
      name: 'ch-ew-01',
      type: 'chest',
      x: 26,
      y: 6,
      properties: { item: 'C-HP-01', quantity: 2 },
    },
    {
      name: 'ch-ew-02',
      type: 'chest',
      x: 18,
      y: 22,
      properties: { item: 'C-SP-01', quantity: 2, condition: 'MQ-01' },
    },

    // Quest board trigger
    {
      name: 'quest-board',
      type: 'trigger',
      x: 16,
      y: 28,
      properties: { type: 'quest-board' },
    },

    // Artun's telescope on lookout hill
    {
      name: 'telescope',
      type: 'trigger',
      x: 26,
      y: 6,
      properties: { type: 'narrative-lookout' },
    },

    // Hidden depths entrance
    {
      name: 'depths-entrance',
      type: 'transition',
      x: 16,
      y: 34,
      width: 1,
      height: 1,
      properties: {
        map: 'depths-l1',
        x: 20,
        y: 0,
        condition: 'MQ-05',
        hidden: true,
      },
    },

    // Opening cutscene trigger
    {
      name: 'opening-cutscene',
      type: 'trigger',
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      properties: { type: 'auto-cutscene', scene: 'opening', condition: 'MQ-01' },
    },
  ],
};

export default composition;
