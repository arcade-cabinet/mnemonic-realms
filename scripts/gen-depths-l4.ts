#!/usr/bin/env npx tsx
/** Generate depths-l4.tmx — The Songline, 20x25 */
import {
  T, grid, rect, naturalGround, pathV, pathH,
  collisionFromObjects, writeMap,
} from './map-gen-lib';

const W = 20, H = 25;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_8);
// Gold light corridors
naturalGround(gnd, 0, 0, W, H, T.GROUND_8, T.GROUND_6, T.GROUND_8);
// Room 1 "Prelude" (1,1→20,4)
rect(gnd, 0, 0, W, 4, T.GROUND_8);
// Room 2 "Rising" (10,5→20,9)
naturalGround(gnd, 9, 4, 11, 5, T.GROUND_8, T.GROUND_4, T.GROUND_8);
// Room 3 Lift/Interlude (1,5→8,9)
rect(gnd, 0, 4, 8, 5, T.GROUND_6);
// Room 4 "Crescendo" (1,10→20,14)
naturalGround(gnd, 0, 9, W, 5, T.GROUND_8, T.GROUND_5, T.GROUND_8);
// Room 5 "Dissolution" (10,15→20,19)
naturalGround(gnd, 9, 14, 11, 5, T.GROUND_7, T.GROUND_6, T.GROUND_7);
// Room 6 Treasure Alcove (1,15→8,19)
rect(gnd, 0, 14, 8, 5, T.GROUND_6);
// Room 7 Boss Arena (1,20→20,25)
naturalGround(gnd, 0, 19, W, 6, T.GROUND_8, T.GROUND_4, T.GROUND_8);

// ═══ GROUND2 ═══
const g2 = grid(W, H);
pathV(g2, 9, 0, 24);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Outer walls
for (let c = 0; c < W; c++) { obj[0][c] = T.WALL_1; obj[H - 1][c] = T.WALL_1; }
for (let r = 0; r < H; r++) { obj[r][0] = T.WALL_1; obj[r][W - 1] = T.WALL_1; }

// Room dividers
for (let c = 0; c < W; c++) obj[4][c] = T.WALL_1;
obj[4][9] = 0;
for (let r = 4; r <= 9; r++) obj[r][8] = T.WALL_1;
obj[6][8] = 0;
for (let c = 0; c < W; c++) obj[9][c] = T.WALL_1;
obj[9][9] = 0; obj[9][4] = 0;
for (let c = 0; c < W; c++) obj[14][c] = T.WALL_1;
obj[14][9] = 0;
for (let r = 14; r <= 19; r++) obj[r][8] = T.WALL_1;
obj[16][8] = 0;
for (let c = 0; c < W; c++) obj[19][c] = T.WALL_1;
obj[19][9] = 0;

// Room 1: Prelude
obj[0][9] = 0; obj[0][10] = 0; // Entry
obj[1][5] = T.DECO_2;  // Singing lantern
obj[2][14] = T.DECO_2;
obj[2][9] = T.DECO_9;  // First verse stone

// Room 2: Rising — burdened RS
obj[6][14] = T.DECO_9; // Burdened RS (GQ-02-S1)
obj[5][17] = T.DECO_7; // Treasure
obj[7][12] = T.DECO_2;

// Room 3: Memory Lift
obj[6][3] = T.DECO_9; // Memory lift
obj[7][1] = T.DECO_9; // Rest RS

// Room 4: Crescendo
obj[11][5] = T.DECO_9;  // Musical stone
obj[11][14] = T.DECO_9; // Musical stone
obj[10][9] = T.DECO_4;  // Resonance pool
obj[12][3] = T.DECO_2;  // Lantern
obj[12][16] = T.DECO_2;

// Room 5: Dissolution
obj[16][14] = T.DECO_9; // Dark RS
obj[17][17] = T.DECO_7; // Treasure

// Room 6: Treasure Alcove
obj[16][3] = T.DECO_7; // Treasure chest
obj[17][1] = T.DECO_9; // Fragment stone

// Room 7: Boss Arena — The Conductor
obj[21][9] = T.DECO_9;  // Conductor's podium
obj[24][9] = T.STEPS;   // Stairway to L5
obj[20][3] = T.DECO_2;  // Lanterns
obj[20][15] = T.DECO_2;
obj[22][14] = T.DECO_7; // Boss treasure

// ═══ OBJECTS UPPER ═══
const up = grid(W, H);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.STEPS) col[r][c] = 0;
col[0][9] = 0; col[0][10] = 0;
col[4][9] = 0; col[6][8] = 0; col[9][9] = 0; col[9][4] = 0;
col[14][9] = 0; col[16][8] = 0; col[19][9] = 0;
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DECO_9 || obj[r][c] === T.DECO_2 ||
        obj[r][c] === T.DECO_4) col[r][c] = 0;

writeMap({
  name: 'depths-l4',
  mapName: 'The Songline',
  width: W, height: H,
  tileset: 'tiles_dungeon_normal.tsx',
  vibrancy: 45,
  category: 'dungeon',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
