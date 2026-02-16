#!/usr/bin/env npx tsx
/** Generate luminous-wastes.tmx — sketch plains zone, 40x40 */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, canopyFromObjects, writeMap,
} from './map-gen-lib';

const W = 40, H = 40;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_1);
// Luminous wasteland: bright/empty base with grid-line patterns
naturalGround(gnd, 0, 0, W, H, T.GROUND_1, T.GROUND_2, T.GROUND_1);

// Half-Built Village (18,18) 8x8: sketch outlines
naturalGround(gnd, 18, 18, 8, 8, T.GROUND_6, T.GROUND_1, T.GROUND_3);

// The Edge (3,18) 3x3: void boundary
rect(gnd, 3, 18, 3, 3, T.GROUND_7);

// Preserver Watchtower area (33,8) 4x4: crystal ground
rect(gnd, 33, 8, 4, 4, T.GROUND_7);

// Grid-line patterns (faint ground details in rows/cols)
for (let r = 0; r < H; r += 5)
  for (let c = 0; c < W; c++)
    if (gnd[r][c] === T.GROUND_1) gnd[r][c] = T.GROUND_2;
for (let c = 0; c < W; c += 5)
  for (let r = 0; r < H; r++)
    if (gnd[r][c] === T.GROUND_1) gnd[r][c] = T.GROUND_2;

// ═══ GROUND2 (paths) ═══
const g2 = grid(W, H);

// North gate (25,0) to center
pathV(g2, 25, 0, 18);
// East gate (39,20) to center
pathH(g2, 20, 25, 39);
// NE gate (20,0) to half-drawn-forest
pathV(g2, 20, 0, 10);
pathH(g2, 10, 20, 25);
g2[10][25] = T.PATH_T;
// Center crossroads
g2[20][25] = T.PATH_X;
// Path to village
pathH(g2, 20, 18, 25);
// Path to Edge
pathH(g2, 20, 3, 18);
// Path to Watchtower
pathV(g2, 35, 8, 20);
pathH(g2, 20, 25, 35);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Very sparse — this is a wasteland
scatter(obj, 0, 0, W, H, T.TREE, 0.03, 950);

// Edge walls (sparse, sketch-like)
for (let c = 0; c < W; c++) { obj[0][c] = T.TREE; obj[H - 1][c] = T.TREE; }
for (let r = 1; r < H - 1; r++) { obj[r][0] = T.TREE; obj[r][W - 1] = T.TREE; }

// Clear paths
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (g2[r][c] !== 0) obj[r][c] = 0;

// Gate clearings
obj[0][25] = 0;       // North → Shimmer Marsh
obj[20][W - 1] = 0;   // East → Resonance Fields
obj[0][20] = 0;        // NE → Half-Drawn Forest

// Half-Built Village (18,18) 8x8
rect(obj, 17, 17, 10, 10, 0);
// Sketch outlines of buildings (walls with gaps)
rect(obj, 19, 19, 3, 3, T.WALL_1);
obj[21][20] = T.DOOR;
rect(obj, 23, 19, 2, 3, T.WALL_2);
obj[21][23] = T.DOOR;
rect(obj, 19, 23, 3, 2, T.WALL_1);
// Village center Resonance Stone
obj[20][20] = T.DECO_9;
obj[22][22] = T.DECO_4; // Well/fountain
obj[17][20] = T.DECO_10; // Signpost

// The Edge (3,18) 3x3
rect(obj, 2, 17, 5, 5, 0);
obj[18][4] = T.DECO_9; // World's boundary stone
border(obj, 3, 18, 3, 3, T.FENCE);
obj[20][4] = 0; // South opening

// Preserver Watchtower (33,8) 4x4
rect(obj, 32, 7, 6, 6, 0);
border(obj, 33, 8, 4, 4, T.WALL_2);
obj[11][34] = 0; // South entrance
obj[9][34] = T.DECO_9; // Crystal marker

// Scattered standing stones
obj[35][30] = T.DECO_9;
obj[10][15] = T.DECO_9;
obj[30][10] = T.DECO_9;

// ═══ OBJECTS UPPER ═══
const up = canopyFromObjects(obj, W, H);
rect(up, 19, 19, 3, 2, T.ROOF_1);
rect(up, 23, 19, 2, 2, T.ROOF_2);
rect(up, 19, 23, 3, 1, T.ROOF_1);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR) col[r][c] = 0;

col[0][25] = 0; col[20][W - 1] = 0; col[0][20] = 0;

writeMap({
  name: 'luminous-wastes',
  mapName: 'Luminous Wastes',
  width: W, height: H,
  tileset: 'tiles_sketch_vivid.tsx',
  vibrancy: 5,
  category: 'sketch',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
