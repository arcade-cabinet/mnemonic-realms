#!/usr/bin/env npx tsx
/** Generate sunridge.tmx — highland mountain, 40x40 */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, canopyFromObjects, writeMap,
} from './map-gen-lib';

const W = 40, H = 40;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_1);
// Highland grass base
naturalGround(gnd, 0, 0, W, H, T.GROUND_1, T.GROUND_5, T.GROUND_2);

// Rocky outcrops (east side)
naturalGround(gnd, 25, 5, 14, 20, T.GROUND_3, T.GROUND_6, T.GROUND_3);

// Wind Shrine hilltop (8,6) 4x4: stone
rect(gnd, 8, 6, 4, 4, T.GROUND_6);

// Waystation (18,18) 5x5: packed earth
naturalGround(gnd, 18, 18, 5, 5, T.GROUND_6, T.GROUND_8, T.GROUND_6);

// Preserver Outpost (30,13) 5x4: crystallized
rect(gnd, 30, 13, 5, 4, T.GROUND_7);

// Threshold (north edge) (18,0) 6x2
rect(gnd, 18, 0, 6, 2, T.GROUND_3);

// ═══ GROUND2 (paths) ═══
const g2 = grid(W, H);

// S-N main path from south gate to waystation
pathV(g2, 20, 22, 39);
pathV(g2, 20, 18, 22);
// Waystation to Threshold
pathV(g2, 20, 0, 18);
// Path to Wind Shrine
pathH(g2, 12, 10, 20);
g2[12][20] = T.PATH_T;
// Path to Preserver Outpost
pathH(g2, 15, 20, 30);
g2[15][20] = T.PATH_T;
// East gate path
pathH(g2, 20, 20, 39);
g2[20][20] = T.PATH_X;

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Scattered rocks and boulders (mountain biome uses TREE as large rock)
scatter(obj, 0, 0, W, H, T.TREE, 0.08, 400);
// Denser rocks on east side
scatter(obj, 25, 5, 14, 20, T.TREE, 0.15, 401);

// Edge walls
for (let c = 0; c < W; c++) { obj[0][c] = T.TREE; obj[H - 1][c] = T.TREE; }
for (let r = 1; r < H - 1; r++) { obj[r][0] = T.TREE; obj[r][W - 1] = T.TREE; }

// Clear paths
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (g2[r][c] !== 0) obj[r][c] = 0;

// Gate clearings
obj[H - 1][20] = 0; // South → Village Hub
obj[0][18] = 0; obj[0][19] = 0; obj[0][20] = 0; // North → Hollow Ridge (Threshold)
obj[20][W - 1] = 0; // East → Ambergrove

// Wind Shrine (8,6) 4x4
rect(obj, 8, 6, 4, 4, 0);
border(obj, 8, 6, 4, 4, T.WALL_2);
obj[9][8] = 0; obj[9][11] = 0; // Side openings
obj[9][9] = T.DECO_9; obj[9][10] = T.DECO_9; // Shrine stones

// Waystation (18,18) 5x5
rect(obj, 18, 18, 5, 5, 0);
rect(obj, 18, 18, 3, 3, T.WALL_1); // Main building
obj[20][19] = T.DOOR;
rect(obj, 21, 20, 2, 2, T.WALL_1); // Small annex
obj[21][21] = T.DOOR;
obj[22][18] = T.DECO_7; // Supply crate
obj[22][22] = T.DECO_2; // Lantern
obj[18][20] = T.DECO_10; // Signpost

// Preserver Outpost (30,13) 5x4: crystallized ruins
rect(obj, 30, 13, 5, 4, 0);
border(obj, 30, 13, 5, 4, T.WALL_2);
obj[16][32] = T.DOOR; // Entrance south
obj[14][32] = T.DECO_9; // Crystal formation

// ═══ OBJECTS UPPER ═══
const up = canopyFromObjects(obj, W, H);
rect(up, 18, 18, 3, 2, T.ROOF_1); // Waystation roof
rect(up, 21, 20, 2, 1, T.ROOF_1);
rect(up, 30, 13, 5, 3, T.ROOF_2); // Outpost roof (ruins)

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR) col[r][c] = 0;
col[H - 1][20] = 0; // South gate
col[0][18] = 0; col[0][19] = 0; col[0][20] = 0; // North gate
col[20][W - 1] = 0; // East gate

writeMap({
  name: 'sunridge',
  mapName: 'Sunridge',
  width: W, height: H,
  tileset: 'tiles_mountain_normal.tsx',
  vibrancy: 40,
  category: 'overworld',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
