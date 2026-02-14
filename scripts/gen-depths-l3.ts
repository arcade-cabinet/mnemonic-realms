#!/usr/bin/env npx tsx
/** Generate depths-l3.tmx — Resonant Caverns, 20x25 */
import {
  T, grid, rect, naturalGround, pathV,
  collisionFromObjects, writeMap,
} from './map-gen-lib';

const W = 20, H = 25;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_6);
// Crystal caverns: prismatic stone
naturalGround(gnd, 0, 0, W, H, T.GROUND_6, T.GROUND_3, T.GROUND_6);
// Room 1 Crystal Entry (1,1→20,3)
rect(gnd, 0, 0, W, 3, T.GROUND_8);
// Room 2 Echo Chamber (1,4→4,8)
rect(gnd, 0, 3, 4, 5, T.GROUND_8);
// Room 3 Burdened Alcove (6,4→9,8)
rect(gnd, 5, 3, 4, 5, T.GROUND_6);
// Room 4 Sound Puzzle (11,4→20,8)
rect(gnd, 10, 3, 10, 5, T.GROUND_8);
// Room 5 Crystal Nexus (1,9→20,12)
naturalGround(gnd, 0, 8, W, 4, T.GROUND_8, T.GROUND_6, T.GROUND_8);
// Room 6 Crystal Grotto (1,13→8,17)
rect(gnd, 0, 12, 8, 5, T.GROUND_7); // Water pool
// Room 7 Harmonic Bridge (10,13→20,17)
rect(gnd, 9, 12, 11, 5, T.GROUND_3); // Chasm floor
rect(gnd, 13, 13, 3, 3, T.GROUND_8); // Bridge tiles
// Room 8 Boss Arena (1,18→20,25)
naturalGround(gnd, 0, 17, W, 8, T.GROUND_8, T.GROUND_6, T.GROUND_8);

// ═══ GROUND2 ═══
const g2 = grid(W, H);
pathV(g2, 9, 0, 24);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Outer walls
for (let c = 0; c < W; c++) { obj[0][c] = T.WALL_2; obj[H - 1][c] = T.WALL_2; }
for (let r = 0; r < H; r++) { obj[r][0] = T.WALL_2; obj[r][W - 1] = T.WALL_2; }

// Room dividers
// Row 3 wall
for (let c = 0; c < W; c++) obj[3][c] = T.WALL_2;
obj[3][2] = 0; // To echo chamber
obj[3][7] = 0; // To burdened
obj[3][9] = 0; // Corridor
// Vertical walls between rooms 2/3/4
for (let r = 3; r <= 8; r++) { obj[r][4] = T.WALL_2; obj[r][9] = T.WALL_2; }
obj[5][4] = 0; obj[5][9] = 0;
// Row 8 wall
for (let c = 0; c < W; c++) obj[8][c] = T.WALL_2;
obj[8][2] = 0; obj[8][7] = 0; obj[8][9] = 0;
// Row 12 wall
for (let c = 0; c < W; c++) obj[12][c] = T.WALL_2;
obj[12][4] = 0; obj[12][9] = 0;
// Vertical wall room 6/7
for (let r = 12; r <= 17; r++) obj[r][8] = T.WALL_2;
obj[14][8] = 0;
// Row 17 wall
for (let c = 0; c < W; c++) obj[17][c] = T.WALL_2;
obj[17][9] = 0;

// Room 1: Crystal Entry
obj[0][9] = 0; obj[0][10] = 0;
obj[1][14] = T.DECO_9; // Crystal inscription

// Room 2: Echo Chamber
obj[5][1] = T.DECO_9; // Resonance Stone

// Room 3: Burdened Alcove
obj[5][6] = T.DECO_9; // Burdened RS

// Room 4: Sound Puzzle — 5 crystal pillars
obj[5][11] = T.DECO_9; // Pillar A
obj[4][13] = T.DECO_9; // Pillar C
obj[4][15] = T.DECO_9; // Pillar E
obj[5][17] = T.DECO_9; // Pillar G
obj[6][18] = T.DECO_9; // Pillar B
obj[7][14] = T.HEDGE;  // Harmonic barrier

// Room 5: Crystal Nexus
obj[9][2] = T.DECO_9;  // Memory lift
obj[9][9] = T.DECO_9;  // Resonance Stone
obj[10][16] = T.DECO_7; // Treasure chest
obj[9][5] = T.DECO_2;  // Lantern

// Room 6: Crystal Grotto
obj[14][3] = T.DECO_4;  // Crystal pool
obj[13][1] = T.DECO_7;  // Treasure chest
obj[15][5] = T.DECO_9;  // Resonance Stone

// Room 7: Harmonic Bridge
// Bridge tiles are floor — the rest is chasm
obj[14][12] = T.DECO_2; // Bridge markers

// Room 8: Boss Arena — The Resonant King
obj[19][9] = T.DECO_9;  // King's throne RS
obj[23][9] = T.STEPS;   // Stairway down to L4
obj[19][3] = T.DECO_2;  // Lantern
obj[19][15] = T.DECO_2;

// ═══ OBJECTS UPPER ═══
const up = grid(W, H);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR || obj[r][c] === T.STEPS) col[r][c] = 0;
// Entry
col[0][9] = 0; col[0][10] = 0;
// Corridor/door gaps
col[3][2] = 0; col[3][7] = 0; col[3][9] = 0;
col[5][4] = 0; col[5][9] = 0;
col[8][2] = 0; col[8][7] = 0; col[8][9] = 0;
col[12][4] = 0; col[12][9] = 0;
col[14][8] = 0; col[17][9] = 0;
// Deco walkable
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DECO_9 || obj[r][c] === T.DECO_2 ||
        obj[r][c] === T.DECO_4) col[r][c] = 0;
// Chasm in Room 7 blocked (except bridge)
for (let r = 12; r <= 17; r++)
  for (let c = 9; c < W; c++)
    col[r][c] = 1;
// Bridge passable
for (let r = 13; r <= 15; r++)
  for (let c = 13; c <= 15; c++)
    col[r][c] = 0;
col[12][9] = 0; // Nexus entrance

writeMap({
  name: 'depths-l3',
  mapName: 'Resonant Caverns',
  width: W, height: H,
  tileset: 'tiles_dungeon_vivid.tsx',
  vibrancy: 40,
  category: 'dungeon',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
