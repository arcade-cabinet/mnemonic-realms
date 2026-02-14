#!/usr/bin/env npx tsx
/** Generate fortress-f2.tmx — Archive Floor, 20x25 */
import {
  T, grid, rect, naturalGround, pathV,
  collisionFromObjects, writeMap,
} from './map-gen-lib';

const W = 20, H = 25;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_8);
// Deep blue crystal, silver shelving, pale stasis glow
naturalGround(gnd, 0, 0, W, H, T.GROUND_8, T.GROUND_7, T.GROUND_8);
// Room 1 Curator's Hall (1,1→20,4)
rect(gnd, 0, 0, W, 4, T.GROUND_8);
// Room 2 Witness Chamber (1,5→4,9)
rect(gnd, 0, 4, 4, 5, T.GROUND_7);
// Room 3 Moral Dilemma Gallery (6,5→20,9)
naturalGround(gnd, 5, 4, 15, 5, T.GROUND_8, T.GROUND_6, T.GROUND_8);
// Room 4 Central Archive (1,10→20,14)
naturalGround(gnd, 0, 9, W, 5, T.GROUND_8, T.GROUND_7, T.GROUND_8);
// Room 5 Safe Room (1,15→8,20)
rect(gnd, 0, 14, 8, 6, T.GROUND_6);
// Room 6 Boss Arena (10,15→20,20)
naturalGround(gnd, 9, 14, 11, 6, T.GROUND_8, T.GROUND_7, T.GROUND_8);
// Below boss
rect(gnd, 0, 20, W, 5, T.GROUND_6);

// ═══ GROUND2 ═══
const g2 = grid(W, H);
pathV(g2, 9, 0, 24);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Crystal walls
for (let c = 0; c < W; c++) { obj[0][c] = T.WALL_2; obj[H - 1][c] = T.WALL_2; }
for (let r = 0; r < H; r++) { obj[r][0] = T.WALL_2; obj[r][W - 1] = T.WALL_2; }

// Room dividers
for (let c = 0; c < W; c++) obj[4][c] = T.WALL_2;
obj[4][9] = 0;
for (let r = 4; r <= 9; r++) obj[r][4] = T.WALL_2;
obj[6][4] = 0;
for (let c = 0; c < W; c++) obj[9][c] = T.WALL_2;
obj[9][2] = 0; obj[9][9] = 0;
for (let c = 0; c < W; c++) obj[14][c] = T.WALL_2;
obj[14][4] = 0; obj[14][14] = 0;
for (let r = 14; r <= 20; r++) obj[r][8] = T.WALL_2;
obj[16][8] = 0;
for (let c = 0; c < W; c++) obj[20][c] = T.WALL_2;
obj[20][9] = 0;

// Room 1: Curator's Hall
obj[0][9] = 0; obj[0][10] = 0;
obj[1][3] = T.DECO_9; // Memory display
obj[1][16] = T.DECO_9;
obj[2][9] = T.DECO_2;
// Shelving/pillars
obj[2][5] = T.WALL_2; obj[2][14] = T.WALL_2;

// Room 2: Witness Chamber
obj[6][1] = T.DECO_9; // Witness stone
obj[7][2] = T.DECO_4; // Memory pool

// Room 3: Moral Dilemma Gallery
obj[6][7] = T.DECO_9;  // Dilemma 1
obj[6][12] = T.DECO_9; // Dilemma 2
obj[6][17] = T.DECO_9; // Dilemma 3
obj[7][9] = T.DECO_7;  // Choice chest
obj[5][14] = T.DECO_2;

// Room 4: Central Archive — Curator's Grief
obj[11][5] = T.DECO_9; // Archive RS
obj[11][14] = T.DECO_9;
obj[10][9] = T.DECO_4; // Curator memorial
obj[12][3] = T.DECO_2; obj[12][16] = T.DECO_2;
obj[11][7] = T.DECO_7; // Archive shelves
obj[11][12] = T.DECO_7;

// Room 5: Safe Room
obj[16][3] = T.DECO_9; // Rest RS
obj[17][1] = T.DECO_7; // Defector shop
obj[15][5] = T.DECO_2;

// Room 6: Boss Arena — The Archive Keeper
obj[17][14] = T.DECO_9; // Boss position
obj[15][12] = T.DECO_2; obj[15][18] = T.DECO_2;
obj[19][17] = T.DECO_7; // Boss reward
obj[19][14] = T.STEPS;  // Stairway to F3

// ═══ OBJECTS UPPER ═══
const up = grid(W, H);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.STEPS) col[r][c] = 0;
col[0][9] = 0; col[0][10] = 0;
col[4][9] = 0; col[6][4] = 0;
col[9][2] = 0; col[9][9] = 0;
col[14][4] = 0; col[14][14] = 0;
col[16][8] = 0; col[20][9] = 0;
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DECO_9 || obj[r][c] === T.DECO_2 ||
        obj[r][c] === T.DECO_4) col[r][c] = 0;

writeMap({
  name: 'fortress-f2',
  mapName: 'Preserver Fortress - Archive',
  width: W, height: H,
  tileset: 'tiles_dungeon_normal.tsx',
  vibrancy: 55,
  category: 'dungeon',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
