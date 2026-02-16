#!/usr/bin/env npx tsx
/** Generate hollow-ridge.tmx — mountain frontier zone, 50x50 */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, canopyFromObjects, writeMap,
} from './map-gen-lib';

const W = 50, H = 50;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_1);
// Rocky mountain base
naturalGround(gnd, 0, 0, W, H, T.GROUND_3, T.GROUND_1, T.GROUND_6);

// Kinesis Spire (23,8) 3x8: stone pillar base
rect(gnd, 23, 8, 3, 8, T.GROUND_6);

// Ridgewalker Camp (13,23) 8x8: packed earth
naturalGround(gnd, 13, 23, 8, 8, T.GROUND_8, T.GROUND_6, T.GROUND_8);

// Shattered Pass (33,28) 8x6: crystallized ground
naturalGround(gnd, 33, 28, 8, 6, T.GROUND_7, T.GROUND_6, T.GROUND_7);

// Echo Caverns entrance (38,3) 3x3: dark stone
rect(gnd, 38, 3, 3, 3, T.GROUND_7);

// Ridge Overlook (5,5) 4x4: stone platform
rect(gnd, 5, 5, 4, 4, T.GROUND_6);

// Mountain Trail approach (south)
naturalGround(gnd, 22, 40, 6, 10, T.GROUND_3, T.GROUND_6, T.GROUND_3);

// ═══ GROUND2 (paths) ═══
const g2 = grid(W, H);

// South gate (25,49) to camp
pathV(g2, 25, 40, 49);
pathV(g2, 25, 23, 40);
// Camp to Kinesis Spire
pathV(g2, 17, 15, 23);
pathH(g2, 15, 17, 24);
// Path to spire top
pathV(g2, 24, 8, 15);
// Path to Shattered Pass
pathH(g2, 30, 20, 33);
// Camp to overlook
pathH(g2, 25, 5, 13);
pathV(g2, 5, 5, 25);
g2[25][5] = T.PATH_T;
// East gate paths
pathH(g2, 25, 25, 49);
// SE path to Shimmer Marsh
pathH(g2, 35, 25, 49);
// Echo Caverns path
pathH(g2, 5, 24, 38);
pathV(g2, 38, 3, 5);
// North gate
pathV(g2, 25, 0, 8);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Scattered rocks/boulders (mountain uses TREE as large rock)
scatter(obj, 0, 0, W, H, T.TREE, 0.10, 600);

// Edge walls
for (let c = 0; c < W; c++) { obj[0][c] = T.TREE; obj[H - 1][c] = T.TREE; }
for (let r = 1; r < H - 1; r++) { obj[r][0] = T.TREE; obj[r][W - 1] = T.TREE; }

// Clear paths
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (g2[r][c] !== 0) obj[r][c] = 0;

// Gate clearings
obj[H - 1][25] = 0; // South → Sunridge
obj[25][W - 1] = 0;  // East → Flickerveil
obj[35][W - 1] = 0;  // SE → Shimmer Marsh
obj[0][25] = 0;       // North → Undrawn Peaks

// Kinesis Spire (23,8) 3x8
rect(obj, 22, 7, 5, 10, 0);
border(obj, 23, 8, 3, 8, T.WALL_2);
obj[15][24] = 0; // South opening
obj[10][24] = T.DECO_9; // Recall pedestal

// Ridgewalker Camp (13,23) 8x8
rect(obj, 12, 22, 10, 10, 0);
// Main building
rect(obj, 14, 24, 3, 3, T.WALL_1);
obj[26][15] = T.DOOR;
// Market stall
rect(obj, 15, 26, 2, 2, T.WALL_1);
obj[26][16] = T.DOOR;
// Guard post
rect(obj, 18, 24, 2, 2, T.WALL_2);
// Campfire
obj[25][16] = T.DECO_4;
// Decorations
obj[22][14] = T.DECO_10; // Signpost
obj[23][17] = T.DECO_2;  // Lantern
obj[29][15] = T.DECO_7;  // Supply crate
obj[24][14] = T.DECO_9;  // Resonance Stone

// Shattered Pass (33,28) 8x6
rect(obj, 32, 27, 10, 8, 0);
// Crystallized formations
obj[28][35] = T.DECO_9; obj[30][35] = T.DECO_9;
obj[33][37] = T.DECO_9;
// Crystal barriers
obj[28][33] = T.HEDGE; obj[33][33] = T.HEDGE;
obj[28][40] = T.HEDGE; obj[33][40] = T.HEDGE;

// Echo Caverns (38,3) 3x3
rect(obj, 37, 2, 5, 5, 0);
border(obj, 38, 3, 3, 3, T.WALL_2);
obj[5][39] = 0; // Entrance south
obj[5][40] = T.DECO_9; // Resonance Stone

// Ridge Overlook (5,5) 4x4
rect(obj, 4, 4, 6, 6, 0);
border(obj, 5, 5, 4, 4, T.FENCE);
obj[8][6] = 0; // South opening
obj[6][6] = T.DECO_9; // Resonance Stone

// ═══ OBJECTS UPPER ═══
const up = canopyFromObjects(obj, W, H);
rect(up, 14, 24, 3, 2, T.ROOF_1);  // Camp building roof
rect(up, 15, 26, 2, 1, T.ROOF_1);  // Market stall roof
rect(up, 18, 24, 2, 1, T.ROOF_2);  // Guard post roof

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR) col[r][c] = 0;

// Gate clearings
col[H - 1][25] = 0; col[25][W - 1] = 0; col[35][W - 1] = 0; col[0][25] = 0;

writeMap({
  name: 'hollow-ridge',
  mapName: 'Hollow Ridge',
  width: W, height: H,
  tileset: 'tiles_mountain_muted.tsx',
  vibrancy: 20,
  category: 'frontier',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
