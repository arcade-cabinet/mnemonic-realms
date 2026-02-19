#!/usr/bin/env npx tsx
/** Generate heartfield.tmx — rolling farmland, 40x40 grassland */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, canopyFromObjects, writeMap,
} from './map-gen-lib';

const W = 40, H = 40;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_1);
// Base: green grass everywhere
naturalGround(gnd, 0, 0, W, H, T.GROUND_1, T.GROUND_2, T.GROUND_5);

// Wheat fields west (2,5) 12x15: golden wheat (GROUND_4)
naturalGround(gnd, 2, 5, 12, 15, T.GROUND_4, T.GROUND_5, T.GROUND_4);

// Wheat fields east (22,5) 10x12
naturalGround(gnd, 22, 5, 10, 12, T.GROUND_4, T.GROUND_1, T.GROUND_4);

// Hamlet center (13,13) 10x10: packed dirt/cobble
naturalGround(gnd, 13, 13, 10, 10, T.GROUND_6, T.GROUND_1, T.GROUND_6);

// Windmill hilltop (30,8) 4x5: stone
naturalGround(gnd, 30, 8, 4, 5, T.GROUND_6, T.GROUND_3, T.GROUND_6);

// Stagnation clearing (33,28) 5x5: dark/corrupted ground
naturalGround(gnd, 33, 28, 5, 5, T.GROUND_7, T.GROUND_6, T.GROUND_7);

// Stream (west side, col 5-6, rows 20-35): water/dark
for (let r = 20; r <= 35; r++) {
  gnd[r][5] = T.GROUND_7;
  gnd[r][6] = T.GROUND_7;
}

// ═══ GROUND2 (paths) ═══
const g2 = grid(W, H);

// Main N-S road from north gate (15,0) to hamlet
pathV(g2, 15, 0, 13);
// E-W road through hamlet
pathH(g2, 17, 13, 23);
// Crossroads at hamlet entrance
g2[13][15] = T.PATH_X;
// N-S road from hamlet to southern crossroads (20,38)
pathV(g2, 18, 22, 38);
// Path to windmill
pathH(g2, 10, 22, 30);
g2[10][22] = T.PATH_T;
// Path to stagnation clearing (from east)
pathH(g2, 30, 30, 33);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Tree border along edges (scattered)
for (let c = 0; c < W; c++) { obj[0][c] = T.TREE; obj[H - 1][c] = T.TREE; }
for (let r = 1; r < H - 1; r++) { obj[r][0] = T.TREE; obj[r][W - 1] = T.TREE; }

// Scattered trees in non-field areas
scatter(obj, 0, 0, 2, H, T.TREE, 0.4, 101);       // west edge
scatter(obj, W - 3, 0, 3, H, T.TREE, 0.3, 102);   // east edge
scatter(obj, 0, 35, W, 4, T.TREE, 0.3, 103);       // south trees
scatter(obj, 14, 1, 12, 4, T.TREE, 0.15, 104);     // north of hamlet

// Gate clearings
obj[0][15] = 0; // North gate → Everwick
obj[H - 1][20] = 0; // South gate → Shimmer Marsh
obj[20][W - 1] = 0; // East gate → Ambergrove

// Hamlet farmsteads (5 buildings)
// Farmstead 1 (14,14) 3x3
rect(obj, 14, 14, 3, 3, T.WALL_1);
obj[16][15] = T.DOOR;
// Farmstead 2 (18,14) 3x3
rect(obj, 18, 14, 3, 3, T.WALL_1);
obj[16][19] = T.DOOR;
// Farmstead 3 (14,18) 3x3
rect(obj, 14, 18, 3, 3, T.WALL_1);
obj[20][15] = T.DOOR;
// Farmstead 4 (18,18) 3x3
rect(obj, 18, 18, 3, 3, T.WALL_2);
obj[20][19] = T.DOOR;
// Farmstead 5 (16,21) 2x2 (small)
rect(obj, 16, 21, 2, 2, T.WALL_1);

// Hamlet well (17,17)
obj[17][17] = T.DECO_4;

// Hamlet decorations
obj[13][14] = T.DECO_10; // Signpost at hamlet entrance
obj[15][17] = T.DECO_2;  // Lantern
obj[19][17] = T.DECO_2;  // Lantern
obj[14][13] = T.DECO_7;  // Barrel
obj[14][21] = T.DECO_7;  // Barrel

// Windmill (30,8) 4x5
rect(obj, 30, 8, 4, 5, T.WALL_2);
obj[12][31] = T.DOOR; // Windmill entrance (south face)

// Stagnation clearing edge markers
obj[28][33] = T.DECO_9; // Standing stone
obj[32][33] = T.DECO_9;
obj[28][37] = T.DECO_9;

// Stream bridge crossing (cols 5-6, near row 25)
obj[25][5] = 0; obj[25][6] = 0; // Clear stream for bridge
g2[25][5] = T.PATH_H; g2[25][6] = T.PATH_H; // Bridge path

// Fence around hamlet
border(obj, 12, 12, 12, 12, T.FENCE);
// Clear fence for gates (N, S, E)
obj[12][15] = 0; obj[12][18] = 0; // North fence gate
obj[23][15] = 0; obj[23][18] = 0; // South fence gate
obj[17][23] = 0; // East fence gate

// ═══ OBJECTS UPPER (roofs + canopy) ═══
const up = canopyFromObjects(obj, W, H);
// Farmstead roofs
rect(up, 14, 14, 3, 2, T.ROOF_1);
rect(up, 18, 14, 3, 2, T.ROOF_1);
rect(up, 14, 18, 3, 2, T.ROOF_1);
rect(up, 18, 18, 3, 2, T.ROOF_2);
rect(up, 16, 21, 2, 1, T.ROOF_1);
// Windmill roof
rect(up, 30, 8, 4, 4, T.ROOF_2);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);

// Doors passable
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR) col[r][c] = 0;

// Gate clearings passable
col[0][15] = 0;        // North
col[H - 1][20] = 0;    // South
col[20][W - 1] = 0;    // East

// Stream blocked (except bridge)
for (let r = 20; r <= 35; r++) {
  col[r][5] = 1; col[r][6] = 1;
}
col[25][5] = 0; col[25][6] = 0; // Bridge

writeMap({
  name: 'heartfield',
  mapName: 'Heartfield',
  width: W,
  height: H,
  tileset: 'tiles_grassland_normal.tsx',
  vibrancy: 55,
  category: 'overworld',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
