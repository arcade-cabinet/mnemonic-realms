#!/usr/bin/env npx tsx
/** Generate fortress-f1.tmx — Entry Gallery, 20x25 */
import {
  T, grid, rect, naturalGround, pathV,
  collisionFromObjects, writeMap,
} from './map-gen-lib';

const W = 20, H = 25;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_8);
// White crystal, frozen blue, warm amber
naturalGround(gnd, 0, 0, W, H, T.GROUND_8, T.GROUND_6, T.GROUND_8);
// Room 1 Entry Gallery (1,1→20,4)
rect(gnd, 0, 0, W, 4, T.GROUND_8);
// Room 2 Stasis Wing (1,5→4,9)
rect(gnd, 0, 4, 4, 5, T.GROUND_7);
// Room 3 Weapon Cache (6,5→9,9)
rect(gnd, 5, 4, 4, 5, T.GROUND_6);
// Room 4 Crystal Receptacle Puzzle (11,5→20,9)
rect(gnd, 10, 4, 10, 5, T.GROUND_8);
// Room 5 Memory Lift + Phoenix Feather (1,10→20,13)
naturalGround(gnd, 0, 9, W, 4, T.GROUND_8, T.GROUND_6, T.GROUND_8);
// Room 6 Boss Arena (1,14→20,20)
naturalGround(gnd, 0, 13, W, 7, T.GROUND_8, T.GROUND_7, T.GROUND_8);
// Below boss
rect(gnd, 0, 20, W, 5, T.GROUND_6);

// ═══ GROUND2 ═══
const g2 = grid(W, H);
pathV(g2, 9, 0, 24);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Outer walls — crystal
for (let c = 0; c < W; c++) { obj[0][c] = T.WALL_2; obj[H - 1][c] = T.WALL_2; }
for (let r = 0; r < H; r++) { obj[r][0] = T.WALL_2; obj[r][W - 1] = T.WALL_2; }

// Room dividers
for (let c = 0; c < W; c++) obj[4][c] = T.WALL_2;
obj[4][9] = 0;
for (let r = 4; r <= 9; r++) { obj[r][4] = T.WALL_2; obj[r][9] = T.WALL_2; }
obj[6][4] = 0; obj[6][9] = 0;
for (let c = 0; c < W; c++) obj[9][c] = T.WALL_2;
obj[9][3] = 0; obj[9][7] = 0; obj[9][9] = 0;
for (let c = 0; c < W; c++) obj[13][c] = T.WALL_2;
obj[13][9] = 0;
for (let c = 0; c < W; c++) obj[20][c] = T.WALL_2;
obj[20][9] = 0;

// Room 1: Entry Gallery
obj[0][9] = 0; obj[0][10] = 0;
// Frozen scene displays
obj[1][3] = T.DECO_9; obj[1][7] = T.DECO_9;
obj[1][12] = T.DECO_9; obj[1][16] = T.DECO_9;
obj[2][5] = T.DECO_2; obj[2][14] = T.DECO_2;

// Room 2: Stasis Wing
obj[6][1] = T.DECO_9; // Stasis display
obj[7][2] = T.DECO_9;

// Room 3: Weapon Cache
obj[6][6] = T.DECO_7; // Weapon chest
obj[7][7] = T.DECO_7; // Armor chest

// Room 4: Crystal Receptacle Puzzle
obj[6][12] = T.DECO_9; // Joy receptacle
obj[6][15] = T.DECO_9; // Sorrow receptacle
obj[6][18] = T.DECO_9; // Fury receptacle
obj[8][15] = T.HEDGE;  // Sealed door

// Room 5: Memory Lift + Phoenix Feather
obj[10][3] = T.DECO_9;  // Memory lift
obj[11][9] = T.DECO_9;  // Phoenix Feather RS
obj[10][15] = T.DECO_7; // Treasure
obj[10][6] = T.DECO_2;  // Lantern
obj[10][12] = T.DECO_2;

// Room 6: Boss Arena — Curator's Right Hand
obj[16][9] = T.DECO_9;  // Boss position
obj[14][3] = T.DECO_2;  obj[14][15] = T.DECO_2;
obj[18][14] = T.DECO_7; // Boss reward
obj[19][9] = T.STEPS;   // Stairway to F2

// Lower area (below boss)
obj[22][9] = T.DECO_9;

// ═══ OBJECTS UPPER ═══
const up = grid(W, H);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.STEPS) col[r][c] = 0;
col[0][9] = 0; col[0][10] = 0;
col[4][9] = 0; col[6][4] = 0; col[6][9] = 0;
col[9][3] = 0; col[9][7] = 0; col[9][9] = 0;
col[13][9] = 0; col[20][9] = 0;
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DECO_9 || obj[r][c] === T.DECO_2 ||
        obj[r][c] === T.DECO_4) col[r][c] = 0;

writeMap({
  name: 'fortress-f1',
  mapName: 'Preserver Fortress - Gallery',
  width: W, height: H,
  tileset: 'tiles_dungeon_normal.tsx',
  vibrancy: 50,
  category: 'dungeon',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
