#!/usr/bin/env npx tsx
/** Generate fortress-f3.tmx — Final Chamber, 20x25 */
import {
  T, grid, rect, naturalGround, pathV,
  collisionFromObjects, writeMap,
} from './map-gen-lib';

const W = 20, H = 25;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_8);
// Pure white crystal, golden lattice, prismatic First Memory
naturalGround(gnd, 0, 0, W, H, T.GROUND_8, T.GROUND_4, T.GROUND_8);

// Room 1 The Approach (1,1→20,7)
rect(gnd, 0, 0, W, 7, T.GROUND_8);
// Long approach corridor with golden lattice floor
for (let r = 0; r < 7; r++)
  for (let c = 0; c < W; c++)
    if ((r + c) % 3 === 0) gnd[r][c] = T.GROUND_4;

// Room 2 The First Memory Chamber (1,8→20,25)
naturalGround(gnd, 0, 7, W, 18, T.GROUND_8, T.GROUND_5, T.GROUND_8);
// Central dais
rect(gnd, 7, 13, 6, 6, T.GROUND_4);

// ═══ GROUND2 ═══
const g2 = grid(W, H);
pathV(g2, 9, 0, 24);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Crystal walls
for (let c = 0; c < W; c++) { obj[0][c] = T.WALL_2; obj[H - 1][c] = T.WALL_2; }
for (let r = 0; r < H; r++) { obj[r][0] = T.WALL_2; obj[r][W - 1] = T.WALL_2; }

// Approach-to-chamber wall
for (let c = 0; c < W; c++) obj[7][c] = T.WALL_2;
obj[7][9] = T.DOOR; obj[7][10] = T.DOOR;

// Room 1: The Approach
obj[0][9] = 0; obj[0][10] = 0; // Entry
// Crystal pillars along approach
obj[1][3] = T.WALL_2; obj[1][16] = T.WALL_2;
obj[3][3] = T.WALL_2; obj[3][16] = T.WALL_2;
obj[5][3] = T.WALL_2; obj[5][16] = T.WALL_2;
// Lanterns between pillars
obj[2][3] = T.DECO_2; obj[2][16] = T.DECO_2;
obj[4][3] = T.DECO_2; obj[4][16] = T.DECO_2;
// Emotion displays
obj[2][7] = T.DECO_9; // Joy
obj[4][7] = T.DECO_9; // Sorrow
obj[2][12] = T.DECO_9; // Fury
obj[4][12] = T.DECO_9; // Awe

// Room 2: The First Memory Chamber
// Central dais with the Curator
rect(obj, 7, 13, 6, 6, 0); // Clear dais
obj[15][9] = T.DECO_9;  // The Curator (boss position)
obj[16][9] = T.DECO_4;  // First Memory crystal

// 4 emotion recall pedestals (cardinal directions)
obj[12][9] = T.DECO_9; // North pedestal
obj[18][9] = T.DECO_9; // South pedestal
obj[15][5] = T.DECO_9; // West pedestal
obj[15][14] = T.DECO_9; // East pedestal

// Memory displays around perimeter
obj[8][2] = T.DECO_9; obj[8][17] = T.DECO_9;
obj[12][2] = T.DECO_9; obj[12][17] = T.DECO_9;
obj[18][2] = T.DECO_9; obj[18][17] = T.DECO_9;

// Lanterns
obj[10][5] = T.DECO_2; obj[10][14] = T.DECO_2;
obj[20][5] = T.DECO_2; obj[20][14] = T.DECO_2;

// Final treasure
obj[22][9] = T.DECO_7; // Victory chest

// ═══ OBJECTS UPPER ═══
const up = grid(W, H);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR) col[r][c] = 0;
col[0][9] = 0; col[0][10] = 0;
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DECO_9 || obj[r][c] === T.DECO_2 ||
        obj[r][c] === T.DECO_4) col[r][c] = 0;

writeMap({
  name: 'fortress-f3',
  mapName: 'Preserver Fortress - First Memory',
  width: W, height: H,
  tileset: 'tiles_dungeon_normal.tsx',
  vibrancy: 60,
  category: 'dungeon',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
