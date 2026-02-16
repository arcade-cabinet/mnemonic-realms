#!/usr/bin/env npx tsx
/** Generate resonance-fields.tmx — open plains frontier, 50x50 */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, canopyFromObjects, writeMap,
} from './map-gen-lib';

const W = 50, H = 50;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_1);
// Vast open plains
naturalGround(gnd, 0, 0, W, H, T.GROUND_1, T.GROUND_2, T.GROUND_5);

// Resonance's Amphitheater (23,23) 8x8: stone bowl
rect(gnd, 23, 23, 8, 8, T.GROUND_6);
naturalGround(gnd, 24, 24, 6, 6, T.GROUND_8, T.GROUND_6, T.GROUND_8);

// Listener's Camp (8,33) 6x5: packed earth
naturalGround(gnd, 8, 33, 6, 5, T.GROUND_8, T.GROUND_6, T.GROUND_8);

// Preserver Cathedral (38,13) 8x6: crystal floor
rect(gnd, 38, 13, 8, 6, T.GROUND_7);

// Singing Stones area (28,43) 6x3: stone platform
rect(gnd, 28, 43, 6, 3, T.GROUND_6);

// ═══ GROUND2 (paths) ═══
const g2 = grid(W, H);

// East gate (49,25) to amphitheater
pathH(g2, 25, 30, 49);
// Amphitheater to camp
pathH(g2, 35, 8, 23);
pathV(g2, 8, 33, 35);
g2[35][8] = T.PATH_T;
// Amphitheater to cathedral
pathV(g2, 25, 13, 23);
pathH(g2, 13, 25, 38);
// North gate
pathV(g2, 25, 0, 13);
g2[13][25] = T.PATH_T;
// West gate
pathH(g2, 25, 0, 8);
// Path to singing stones
pathV(g2, 30, 30, 43);
g2[30][30] = T.PATH_T;
// Center crossroads
g2[25][25] = T.PATH_X;

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Scattered standing stones across plains (sparse)
scatter(obj, 0, 0, W, H, T.DECO_9, 0.02, 800);
// Sparse trees
scatter(obj, 0, 0, W, H, T.TREE, 0.04, 801);

// Edge barriers
for (let c = 0; c < W; c++) { obj[0][c] = T.TREE; obj[H - 1][c] = T.TREE; }
for (let r = 1; r < H - 1; r++) { obj[r][0] = T.TREE; obj[r][W - 1] = T.TREE; }

// Clear paths
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (g2[r][c] !== 0) obj[r][c] = 0;

// Gate clearings
obj[25][W - 1] = 0; // East → Shimmer Marsh
obj[0][25] = 0;      // North → Hollow Ridge
obj[25][0] = 0;       // West → Luminous Wastes

// Amphitheater (23,23) 8x8: stone ring
rect(obj, 22, 22, 10, 10, 0);
border(obj, 23, 23, 8, 8, T.WALL_2);
obj[30][27] = 0; // South entrance
obj[23][27] = 0; // North entrance
// Recall pedestal
obj[25][25] = T.DECO_4;
// Inner standing stones
obj[24][25] = T.DECO_9; obj[26][25] = T.DECO_9;
obj[25][24] = T.DECO_9; obj[25][26] = T.DECO_9;

// Listener's Camp (8,33) 6x5
rect(obj, 7, 32, 8, 7, 0);
// Tents
rect(obj, 9, 34, 2, 2, T.WALL_1);
obj[35][10] = T.DOOR;
rect(obj, 11, 34, 2, 2, T.WALL_1);
obj[35][12] = T.DOOR;
// Decorations
obj[33][8] = T.DECO_10; // Signpost
obj[36][10] = T.DECO_7; // Supply crate
obj[34][8] = T.DECO_9;  // Camp Resonance Stone
obj[33][12] = T.DECO_2; // Lantern

// Preserver Cathedral (38,13) 8x6
rect(obj, 37, 12, 10, 8, 0);
border(obj, 38, 13, 8, 6, T.WALL_2);
obj[18][42] = 0; // South entrance
// Inner pillars
obj[14][40] = T.WALL_2; obj[14][44] = T.WALL_2;
obj[16][40] = T.WALL_2; obj[16][44] = T.WALL_2;
// Preserver markers
obj[12][39] = T.DECO_9; obj[12][41] = T.DECO_9;

// Singing Stones (28,43) 6x3: row of 5 stones
rect(obj, 27, 42, 8, 5, 0);
obj[43][28] = T.DECO_9; obj[43][29] = T.DECO_9;
obj[43][30] = T.DECO_9; obj[43][31] = T.DECO_9;
obj[43][33] = T.DECO_9;

// Scattered approach stones (SQ-09)
obj[28][18] = T.DECO_9; obj[20][22] = T.DECO_9; obj[22][28] = T.DECO_9;

// NW standing stone
obj[10][10] = T.DECO_9;
// Near cathedral (contested)
obj[8][35] = T.DECO_9;

// ═══ OBJECTS UPPER ═══
const up = canopyFromObjects(obj, W, H);
rect(up, 9, 34, 2, 1, T.ROOF_1);
rect(up, 11, 34, 2, 1, T.ROOF_1);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR) col[r][c] = 0;

col[25][W - 1] = 0; col[0][25] = 0; col[25][0] = 0;

writeMap({
  name: 'resonance-fields',
  mapName: 'Resonance Fields',
  width: W, height: H,
  tileset: 'tiles_plains_muted.tsx',
  vibrancy: 15,
  category: 'frontier',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
