#!/usr/bin/env npx tsx
/** Generate shimmer-marsh.tmx — wetland frontier zone, 50x50 */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, canopyFromObjects, writeMap,
} from './map-gen-lib';

const W = 50, H = 50;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_1);
// Marshy base: mix of wet and dry
naturalGround(gnd, 0, 0, W, H, T.GROUND_1, T.GROUND_5, T.GROUND_3);

// Scattered marsh pools throughout
const pools = [
  [5, 10, 4, 3], [12, 5, 3, 4], [25, 15, 5, 3], [8, 30, 4, 4],
  [35, 35, 3, 3], [42, 20, 4, 3], [15, 42, 3, 3], [30, 8, 3, 3],
];
for (const [x, y, w, h] of pools) rect(gnd, x, y, w, h, T.GROUND_7);

// Verdance's Hollow (23,33) 6x6: impossibly green
naturalGround(gnd, 23, 33, 6, 6, T.GROUND_5, T.GROUND_4, T.GROUND_5);

// Marsh Hermit's Hut area (10,13) 3x3: stilted platform
rect(gnd, 9, 12, 5, 5, T.GROUND_8);

// Stagnation Bog (38,8) 8x6: crystallized
rect(gnd, 38, 8, 8, 6, T.GROUND_7);
naturalGround(gnd, 39, 9, 6, 4, T.GROUND_6, T.GROUND_7, T.GROUND_6);

// Deepwater Sinkhole (33,43) 4x4: deep water
rect(gnd, 33, 43, 4, 4, T.GROUND_7);

// Blocked Root Cluster (18,28) 3x3: earthy
rect(gnd, 18, 28, 3, 3, T.GROUND_6);

// ═══ GROUND2 (paths) ═══
const g2 = grid(W, H);

// Path from north gate (20,0) to hermit hut
pathV(g2, 20, 0, 13);
pathH(g2, 13, 10, 20);
// Path from hermit to Verdance's Hollow
pathV(g2, 15, 13, 33);
pathH(g2, 33, 15, 23);
g2[33][15] = T.PATH_T;
// Path from hollow to sinkhole
pathH(g2, 38, 23, 33);
pathV(g2, 33, 38, 43);
// Path east-west through center
pathH(g2, 25, 0, 49);
// Path to stagnation bog
pathV(g2, 40, 14, 25);
g2[25][40] = T.PATH_T;
// South gate path
pathV(g2, 25, 40, 49);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Scattered marsh vegetation (moderate density)
scatter(obj, 0, 0, W, H, T.TREE, 0.12, 500);

// Edge vegetation
for (let c = 0; c < W; c++) { obj[0][c] = T.TREE; obj[H - 1][c] = T.TREE; }
for (let r = 1; r < H - 1; r++) { obj[r][0] = T.TREE; obj[r][W - 1] = T.TREE; }

// Clear paths
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (g2[r][c] !== 0) obj[r][c] = 0;

// Gate clearings
obj[0][20] = 0;       // North → Heartfield
obj[25][W - 1] = 0;   // East → Flickerveil
obj[25][0] = 0;        // West → Hollow Ridge
obj[H - 1][25] = 0;   // South → Luminous Wastes

// Marsh Hermit's Hut (10,13) 3x3
rect(obj, 9, 12, 5, 5, 0);
rect(obj, 10, 13, 3, 3, T.WALL_1);
obj[15][11] = T.DOOR;
obj[12][12] = T.DECO_10; // Signpost
obj[16][10] = T.DECO_7;  // Barrel

// Verdance's Hollow (23,33) 6x6
rect(obj, 22, 32, 8, 8, 0);
// Standing stones around hollow
obj[33][23] = T.DECO_9; obj[33][28] = T.DECO_9;
obj[38][25] = T.DECO_9; obj[35][23] = T.DECO_9;
obj[35][28] = T.DECO_9;
// Center recall pedestal
obj[35][25] = T.DECO_4;

// Stagnation Bog (38,8) 8x6
rect(obj, 38, 8, 8, 6, 0);
border(obj, 38, 8, 8, 6, T.HEDGE);
obj[9][36] = T.DECO_9; // Preserver marker
obj[10][40] = T.DECO_9;

// Deepwater Sinkhole (33,43) 4x4
rect(obj, 32, 42, 6, 6, 0);
obj[43][33] = T.DECO_9; // Sinkhole marker

// Root Cluster (18,28) 3x3
rect(obj, 17, 27, 5, 5, 0);
obj[28][18] = T.HEDGE; obj[28][19] = T.HEDGE; obj[28][20] = T.HEDGE;

// Decorations
obj[14][11] = T.DECO_2; // Lantern near hut
obj[25][20] = T.DECO_2; // Path lantern
obj[40][15] = T.DECO_2;

// ═══ OBJECTS UPPER ═══
const up = canopyFromObjects(obj, W, H);
rect(up, 10, 13, 3, 2, T.ROOF_1); // Hut roof

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR) col[r][c] = 0;

// Marsh pools blocked
for (const [x, y, w, h] of pools) rect(col, x, y, w, h, 1);
// Sinkhole blocked (event will handle transition)
rect(col, 33, 43, 4, 4, 1);

// Gate clearings
col[0][20] = 0; col[25][W - 1] = 0; col[25][0] = 0; col[H - 1][25] = 0;

writeMap({
  name: 'shimmer-marsh',
  mapName: 'Shimmer Marsh',
  width: W, height: H,
  tileset: 'tiles_wetland_muted.tsx',
  vibrancy: 30,
  category: 'frontier',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
