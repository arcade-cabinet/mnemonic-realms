/**
 * Heartfield — Map 2 composition.
 *
 * Rolling golden farmland south of Everwick. The first open-world zone the
 * player explores. Safe, warm, visually inviting at vibrancy 55 (Normal).
 * Size: 80x80 tiles at 16px (1280x1280px).
 *
 * "Heart" = the emotional core of the Settled Lands, "field" = the literal
 * farmland. Where people grow wheat and memories grow wild.
 *
 * Layout based on docs/maps/overworld-layout.md § Heartfield.
 * All coordinates are in 16px tile units.
 *
 * Key locations:
 *   - Heartfield Hamlet (~30,28): 4-5 farming families, well, fences
 *   - Old Windmill (~60,16): Abandoned hilltop, resonance stone, chest
 *   - Wheat Fields West (4-28, 10-40): Golden farm terrain, random encounters
 *   - Wheat Fields East (44-64, 10-34): More farmland, grass serpent ambushes
 *   - Stagnation Clearing (~66,56): Crystallized 10x10 zone, frozen stone
 *   - Stream: Runs through hamlet area
 *
 * Gates: North (→ Everwick), East (→ Ambergrove), South (→ Shimmer Marsh, MQ-04+)
 *
 * Scenes on this map:
 *   - Scene 5: First exploration (open world tutorial)
 *   - Scene 6: Stagnation Clearing discovery
 *   - Scene 10: Breaking the stagnation (broadcast tutorial)
 *   - Scene 11: The Clearing Grows (Act I climax)
 */

import { createForestBorder } from '../assemblages/terrain/forest-border.ts';
import { createHouse } from '../assemblages/buildings/house.ts';
import { createWheatField } from '../assemblages/terrain/wheat-field.ts';
import { createWindmill } from '../assemblages/buildings/windmill.ts';
import { createStagnationClearing } from '../assemblages/terrain/stagnation-clearing.ts';
import type { MapComposition } from '../types.ts';

const W = 80;
const H = 80;
const TILE_SIZE = 16;
const LAYERS = ['ground', 'ground2', 'road', 'objects', 'objects_upper'];

// --- Assemblage definitions ---

// Forest border along north edge (Everwick is behind these trees)
const northBorder = createForestBorder({
  edge: 'north',
  length: W,
  depth: 4,
  gap: { start: 28, end: 34 }, // North gate centered at tile 30
});

// Light tree line along east edge (path to Ambergrove)
const eastBorder = createForestBorder({
  edge: 'east',
  length: H - 8,
  depth: 3,
  gap: { start: 36, end: 44 }, // East gate at tile 40 (offset by 4)
});

// Wheat fields — the golden rolling farmland
// Sized to NOT overlap hamlet buildings (x 24-44, y 24-44) or windmill (x 56, y 12)
const wheatWest = createWheatField({
  id: 'wheat-west',
  width: 18,
  height: 30,
  border: true,
  hayBales: true,
});

const wheatEast = createWheatField({
  id: 'wheat-east',
  width: 8,
  height: 14,
  border: true,
  hayBales: true,
});

// Small wheat patch south of hamlet
const wheatHamlet = createWheatField({
  id: 'wheat-hamlet',
  width: 10,
  height: 8,
  border: true,
});

// Hamlet buildings — farming families in hay and green houses
const hamletHouse1 = createHouse({
  id: 'hamlet-house-1',
  name: "Farmer Gale's House",
  objectRef: 'house.hay-large-1',
  width: 10,
  height: 8,
  npc: {
    name: 'farmer-gale',
    x: 5,
    y: 7,
    type: 'npc',
    properties: {
      dialogue: 'farmer-gale-windmill',
      sprite: 'npc_farmer_m1',
      movement: 'patrol',
      patrolRange: '26,26->44,44',
    },
  },
});

const hamletHouse2 = createHouse({
  id: 'hamlet-house-2',
  name: "Farmer Suri's House",
  objectRef: 'house.green-small-1',
  width: 8,
  height: 6,
  npc: {
    name: 'farmer-suri',
    x: 4,
    y: 5,
    type: 'npc',
    properties: { dialogue: 'farmer-suri', sprite: 'npc_farmer_f1' },
  },
});

const hamletHouse3 = createHouse({
  id: 'hamlet-house-3',
  name: "Farmer Edric's House",
  objectRef: 'house.hay-medium-1',
  width: 8,
  height: 7,
  npc: {
    name: 'farmer-edric',
    x: 4,
    y: 6,
    type: 'npc',
    properties: {
      dialogue: 'farmer-edric',
      sprite: 'npc_farmer_m2',
      movement: 'patrol',
      patrolRange: '20,36->40,50',
    },
  },
});

const hamletHouse4 = createHouse({
  id: 'hamlet-house-4',
  name: 'Hamlet Elder House',
  objectRef: 'house.green-medium-1',
  width: 8,
  height: 7,
  npc: {
    name: 'hamlet-elder',
    x: 4,
    y: 6,
    type: 'npc',
    properties: { dialogue: 'hamlet-elder', sprite: 'npc_elder_f1' },
  },
});

const hamletShelter = createHouse({
  id: 'hamlet-shelter',
  name: 'Hamlet Hay Shelter',
  objectRef: 'shelter.hay',
  width: 6,
  height: 5,
  dirtGround: true,
});

// Old Windmill on hilltop — abandoned, holds dissolved memory deposit
const oldWindmill = createWindmill({
  id: 'old-windmill',
  name: 'The Old Windmill',
  objectRef: 'house.hay-large-1',
  width: 12,
  height: 10,
  resonanceStone: {
    id: 'RS-HF-02',
    x: 6,
    y: 8,
    fragments: 'awe/wind/2',
  },
  chest: {
    id: 'CH-HF-01',
    x: 8,
    y: 4,
    contents: 'Antidote (C-SC-01) x3',
  },
});

// Stagnation Clearing — crystallized zone at southeast
const stagnation = createStagnationClearing({
  id: 'stagnation-clearing',
  width: 10,
  height: 10,
  frozenStone: {
    id: 'RS-HF-03',
    fragments: 'sorrow/dark/1',
    notes: 'Frozen until broadcast mechanic unlocked (Scene 10)',
  },
  cutsceneTrigger: {
    id: 'EV-HF-003',
    linkedQuest: 'MQ-04',
  },
});

// --- Map composition ---

export const composition: MapComposition = {
  id: 'heartfield',
  name: 'Heartfield',
  width: W,
  height: H,
  tileWidth: TILE_SIZE,
  tileHeight: TILE_SIZE,
  paletteName: 'village-premium',
  defaultGround: 'ground.grass',
  layers: LAYERS,

  placements: [
    // Natural borders
    { assemblage: northBorder, x: 0, y: 0 },
    { assemblage: eastBorder, x: W - 3, y: 4 },

    // Wheat fields — sized/positioned to avoid hamlet (24-44,24-44) and windmill (56,12)
    { assemblage: wheatWest, x: 4, y: 10 },   // 4-22, 10-40 (clears house-1 at x=26)
    { assemblage: wheatEast, x: 46, y: 6 },    // 46-54, 6-20 (clears windmill at x=56)
    { assemblage: wheatHamlet, x: 14, y: 46 }, // 14-24, 46-54 (SW of hamlet)

    // Heartfield Hamlet — cluster of farming houses around well at ~(32,32)
    { assemblage: hamletHouse1, x: 26, y: 24 },  // Farmer Gale, NW of well
    { assemblage: hamletHouse2, x: 38, y: 24 },  // Farmer Suri, NE of well
    { assemblage: hamletHouse3, x: 24, y: 36 },  // Farmer Edric, SW of well
    { assemblage: hamletHouse4, x: 36, y: 36 },  // Hamlet Elder, SE of well
    { assemblage: hamletShelter, x: 30, y: 44 }, // Hay shelter, south of ring

    // Old Windmill on northeast hilltop
    { assemblage: oldWindmill, x: 56, y: 12 },

    // Stagnation Clearing at southeast
    { assemblage: stagnation, x: 64, y: 54 },
  ],

  // Paths connecting locations
  paths: [
    // Main north-south road from Everwick gate through hamlet
    {
      terrain: 'road',
      layer: 'road',
      width: 3,
      points: [
        { x: 30, y: 4 }, // North gate
        { x: 30, y: 16 }, // Past wheat fields
        { x: 30, y: 28 }, // Hamlet center
        { x: 30, y: 48 }, // South of hamlet
        { x: 30, y: 70 }, // Approaching south edge
      ],
    },
    // East branch to windmill
    {
      terrain: 'road',
      layer: 'road',
      width: 2,
      points: [
        { x: 30, y: 20 }, // Junction on main road
        { x: 42, y: 18 }, // Between wheat fields
        { x: 56, y: 16 }, // Windmill approach
      ],
    },
    // East branch to Ambergrove gate
    {
      terrain: 'road',
      layer: 'road',
      width: 2,
      points: [
        { x: 38, y: 32 }, // Hamlet east side
        { x: 52, y: 36 }, // Approaching east edge
        { x: 66, y: 40 }, // East gate approach
        { x: 77, y: 40 }, // East gate
      ],
    },
    // Hamlet inner path (cross-road)
    {
      terrain: 'road',
      layer: 'road',
      width: 2,
      points: [
        { x: 22, y: 32 }, // West hamlet
        { x: 30, y: 32 }, // Center
        { x: 40, y: 32 }, // East hamlet
      ],
    },
    // South trail toward stagnation area
    {
      terrain: 'road',
      layer: 'road',
      width: 2,
      points: [
        { x: 38, y: 32 }, // From hamlet
        { x: 50, y: 44 }, // Midpoint
        { x: 62, y: 54 }, // Stagnation clearing approach
      ],
    },
    // Fence lines along wheat field edges (using fence terrain)
    {
      terrain: 'fence',
      layer: 'objects',
      width: 1,
      points: [
        { x: 3, y: 10 }, // West field, north edge
        { x: 28, y: 10 }, // West field, north edge end
      ],
    },
    {
      terrain: 'fence',
      layer: 'objects',
      width: 1,
      points: [
        { x: 44, y: 10 }, // East field, north edge
        { x: 64, y: 10 }, // East field — dissolves here (fence stops)
      ],
    },
  ],

  // Map-level visual objects
  visuals: [
    // Hamlet well
    { objectRef: 'well.generic', x: 32, y: 30 },

    // Hamlet bulletin board (side quests)
    { objectRef: 'prop.bulletin-board-1', x: 28, y: 34 },

    // Sign posts
    { objectRef: 'prop.sign-south', x: 30, y: 8 }, // "Heartfield" entrance sign
    { objectRef: 'prop.sign-north', x: 30, y: 66 }, // South road sign

    // Scattered trees throughout open areas
    { objectRef: 'tree.emerald-3', x: 16, y: 50 },
    { objectRef: 'tree.emerald-1', x: 50, y: 46 },
    { objectRef: 'tree.light-1', x: 8, y: 60 },
    { objectRef: 'tree.light-2', x: 72, y: 44 },
    { objectRef: 'tree.emerald-4', x: 40, y: 56 },
    { objectRef: 'tree.dark-1', x: 14, y: 68 },

    // Stream/creek area near hamlet (visual decoration)
    { objectRef: 'bush.emerald-1', x: 20, y: 44 },
    { objectRef: 'bush.emerald-2', x: 42, y: 44 },
    { objectRef: 'bush.emerald-large', x: 46, y: 48 },

    // Windmill area decorations
    { objectRef: 'tree.emerald-5', x: 52, y: 8 },
    { objectRef: 'bush.emerald-1', x: 68, y: 14 },

    // Hidden treasure area
    { objectRef: 'tree.emerald-6', x: 6, y: 18 },
    { objectRef: 'bush.emerald-3', x: 12, y: 22 },

    // Barrels near hamlet
    { objectRef: 'prop.barrel-empty', x: 34, y: 34 },
    { objectRef: 'prop.barrel-water', x: 26, y: 38 },
    { objectRef: 'prop.crate-medium', x: 36, y: 42 },

    // Lamp posts along hamlet road
    { objectRef: 'prop.lamppost-1', x: 28, y: 26 },
    { objectRef: 'prop.lamppost-1', x: 32, y: 26 },
  ],

  // Event objects
  objects: [
    // Player spawn (entering from Everwick via north gate)
    {
      name: 'player-spawn',
      type: 'spawn',
      x: 30,
      y: 4,
    },

    // Child NPC near stream
    {
      name: 'child-npc',
      type: 'npc',
      x: 32,
      y: 30,
      properties: {
        dialogue: 'hamlet-child',
        sprite: 'npc_child_01',
        movement: 'wander',
        condition: 'after Solara recall',
      },
    },

    // Traveling merchant (rotating stock)
    {
      name: 'traveling-merchant',
      type: 'npc',
      x: 34,
      y: 28,
      properties: {
        dialogue: 'traveling-merchant',
        sprite: 'npc_merchant',
        movement: 'static',
      },
    },

    // Gate transitions
    {
      name: 'north-gate',
      type: 'transition',
      x: 28,
      y: 0,
      width: 4,
      height: 1,
      properties: { map: 'everwick', x: 30, y: 56 },
    },
    {
      name: 'east-gate',
      type: 'transition',
      x: 78,
      y: 38,
      width: 1,
      height: 4,
      properties: { map: 'ambergrove', x: 0, y: 40 },
    },
    {
      name: 'south-gate',
      type: 'transition',
      x: 38,
      y: 78,
      width: 4,
      height: 1,
      properties: { map: 'shimmer-marsh', x: 40, y: 0, condition: 'MQ-04+' },
    },

    // Resonance stones
    {
      name: 'RS-HF-01',
      type: 'trigger',
      x: 36,
      y: 28,
      properties: {
        eventType: 'action',
        fragments: 'joy/earth/1',
        description: 'Resonance Stone near hamlet',
      },
    },
    // RS-HF-02 is inside the windmill assemblage
    // RS-HF-03 is inside the stagnation clearing assemblage
    {
      name: 'RS-HF-04',
      type: 'trigger',
      x: 16,
      y: 60,
      properties: {
        eventType: 'action',
        fragments: 'calm/earth/1',
        description: 'Hidden behind tree',
      },
    },

    // Treasure chests
    // CH-HF-01 is inside the windmill assemblage
    {
      name: 'CH-HF-02',
      type: 'chest',
      x: 10,
      y: 20,
      properties: { contents: 'Minor Potion (C-HP-01) x2' },
    },
    {
      name: 'CH-HF-03',
      type: 'chest',
      x: 72,
      y: 50,
      properties: { contents: 'Smoke Bomb (C-SP-05) x2' },
    },

    // Event triggers
    {
      name: 'EV-HF-001',
      type: 'trigger',
      x: 30,
      y: 28,
      properties: {
        eventType: 'action',
        linkedQuest: 'SQ-02',
        repeat: 'quest',
        description: 'Farmer Gale windmill dialogue',
      },
    },
    {
      name: 'EV-HF-002',
      type: 'trigger',
      x: 60,
      y: 16,
      properties: {
        eventType: 'touch',
        linkedQuest: 'SQ-02',
        repeat: 'quest',
        description: 'Old Windmill entrance',
      },
    },
    // EV-HF-003 (stagnation cutscene) is inside the stagnation clearing assemblage
    {
      name: 'EV-HF-009',
      type: 'trigger',
      x: 68,
      y: 58,
      properties: {
        eventType: 'action',
        linkedQuest: 'SQ-14',
        repeat: 'once',
        description: 'Broadcast joy into frozen Lira',
      },
    },

    // Hana companion entry dialogue trigger
    {
      name: 'hana-heartfield-intro',
      type: 'trigger',
      x: 28,
      y: 6,
      width: 6,
      height: 2,
      properties: {
        eventType: 'auto',
        repeat: 'once',
        description: 'Hana introduction dialogue when first entering Heartfield',
        scene: 'act1-scene5',
      },
    },
  ],
};

export default composition;
