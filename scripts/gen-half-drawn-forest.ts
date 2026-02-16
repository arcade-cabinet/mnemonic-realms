#!/usr/bin/env npx tsx
/** Generate half-drawn-forest.tmx — sketch forest zone, 40x40 */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, canopyFromObjects, writeMap,
} from './map-gen-lib';

const W = 40, H = 40;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_1);
// Sketch-like ground: mostly bare with sparse detail
naturalGround(gnd, 0, 0, W, H, T.GROUND_1, T.GROUND_3, T.GROUND_2);

// The Living Sketch (18,23) 6x6: actively drawing
naturalGround(gnd, 18, 23, 6, 6, T.GROUND_5, T.GROUND_4, T.GROUND_1);

// Archive of Intentions (28,8) 5x5: ancient stone
rect(gnd, 28, 8, 5, 5, T.GROUND_6);

// Sketch Passage entrance (13,36) 3x3: dark
rect(gnd, 13, 36, 3, 3, T.GROUND_7);

// ═══ GROUND2 (paths) ═══
const g2 = grid(W, H);

// West gate (0,20) to center
pathH(g2, 20, 0, 18);
// NW gate (0,10) south then merge
pathH(g2, 10, 0, 10);
pathV(g2, 10, 10, 20);
g2[20][10] = T.PATH_T;
// Path to Living Sketch
pathV(g2, 20, 20, 23);
// Path to Archive
pathH(g2, 10, 20, 28);
pathV(g2, 28, 8, 10);
// South gate (20,39)
pathV(g2, 20, 25, 39);
// MQ-08 trail stones path
pathH(g2, 20, 5, 35);
// Path to Sketch Passage
pathV(g2, 14, 28, 36);
g2[28][14] = T.PATH_T;

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Sketch trees (line-art style, moderate density)
scatter(obj, 0, 0, W, H, T.TREE, 0.18, 900);

// Edge walls
for (let c = 0; c < W; c++) { obj[0][c] = T.TREE; obj[H - 1][c] = T.TREE; }
for (let r = 1; r < H - 1; r++) { obj[r][0] = T.TREE; obj[r][W - 1] = T.TREE; }

// Clear paths
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (g2[r][c] !== 0) obj[r][c] = 0;

// Gate clearings
obj[20][0] = 0;       // West → Flickerveil
obj[10][0] = 0;       // NW → Undrawn Peaks
obj[H - 1][20] = 0;   // South → Luminous Wastes

// The Living Sketch (18,23) 6x6
rect(obj, 17, 22, 8, 8, 0);
obj[25][20] = T.DECO_9; // RS appears after solidification
obj[24][20] = T.DECO_4; // Central marker

// Archive of Intentions (28,8) 5x5
rect(obj, 27, 7, 7, 7, 0);
border(obj, 28, 8, 5, 5, T.FENCE);
obj[12][30] = 0; // South opening
// Resonance Stones inside
obj[9][28] = T.DECO_9; obj[10][29] = T.DECO_9;
obj[9][32] = T.DECO_9;

// Sketch Passage (13,36) 3x3
rect(obj, 12, 35, 5, 5, 0);
border(obj, 13, 36, 3, 3, T.WALL_2);
obj[38][14] = 0; // South opening (entrance)

// MQ-08 trail stones
obj[20][5] = T.DECO_9;
obj[18][12] = T.DECO_9;
obj[15][20] = T.DECO_9;
obj[17][28] = T.DECO_9;
obj[20][35] = T.DECO_9;

// Scattered Resonance Stones
obj[15][10] = T.DECO_9; // West path
obj[30][35] = T.DECO_9; // East clearing

// ═══ OBJECTS UPPER ═══
const up = canopyFromObjects(obj, W, H);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
col[20][0] = 0; col[10][0] = 0; col[H - 1][20] = 0;

writeMap({
  name: 'half-drawn-forest',
  mapName: 'The Half-Drawn Forest',
  width: W, height: H,
  tileset: 'tiles_sketch_normal.tsx',
  vibrancy: 8,
  category: 'sketch',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
