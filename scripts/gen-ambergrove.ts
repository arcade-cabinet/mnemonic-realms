#!/usr/bin/env npx tsx
/** Generate ambergrove.tmx — dense forest, 40x40 */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, canopyFromObjects, writeMap,
} from './map-gen-lib';

const W = 40, H = 40;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_1);
// Dense forest floor
naturalGround(gnd, 0, 0, W, H, T.GROUND_1, T.GROUND_2, T.GROUND_3);

// Hearthstone Circle clearing (18,8) 6x6
naturalGround(gnd, 18, 8, 6, 6, T.GROUND_6, T.GROUND_1, T.GROUND_6);

// Amber Lake (28,23) 8x8: water/dark tiles
rect(gnd, 28, 23, 8, 8, T.GROUND_7);

// Woodcutter's Camp (8,28) 6x5: packed earth
naturalGround(gnd, 8, 28, 6, 5, T.GROUND_6, T.GROUND_8, T.GROUND_6);

// Mossy Clearing (20,20) 4x4: bright green
naturalGround(gnd, 20, 20, 4, 4, T.GROUND_5, T.GROUND_4, T.GROUND_5);

// Eastern Canopy Path (36,18) 4x10: wooden planks
rect(gnd, 36, 18, 4, 10, T.GROUND_8);

// ═══ GROUND2 (paths) ═══
const g2 = grid(W, H);

// Path from west gate (0,20) to camp
pathH(g2, 20, 0, 8);
// Path from camp to Hearthstone Circle
pathV(g2, 10, 15, 28);
pathH(g2, 10, 10, 18);
g2[10][10] = T.PATH_T;
// Path from circle to clearing
pathV(g2, 21, 13, 20);
// Path to Canopy
pathH(g2, 20, 23, 36);
// Path from south gate
pathV(g2, 10, 32, 39);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Dense forest trees everywhere, then clear paths and areas
scatter(obj, 0, 0, W, H, T.TREE, 0.35, 200);

// Clear all paths (where ground2 has path tiles)
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (g2[r][c] !== 0) obj[r][c] = 0;

// Edge trees solid
for (let c = 0; c < W; c++) { obj[0][c] = T.TREE; obj[H - 1][c] = T.TREE; }
for (let r = 0; r < H; r++) { obj[r][0] = T.TREE; obj[r][W - 1] = T.TREE; }

// Gate clearings
obj[20][0] = 0; // West gate → Village Hub
obj[20][W - 1] = 0; // East (Canopy)
obj[H - 1][10] = 0; // South gate

// Clear Hearthstone Circle (18,8) 6x6
rect(obj, 18, 8, 6, 6, 0);
// Standing stones around circle
obj[8][18] = T.DECO_9; obj[8][23] = T.DECO_9;  // NW, NE
obj[13][20] = T.DECO_9;                          // S
obj[10][18] = T.DECO_9; obj[10][23] = T.DECO_9; // Mid

// Clear Amber Lake area
rect(obj, 28, 23, 8, 8, 0);

// Clear Woodcutter's Camp (8,28) 6x5
rect(obj, 7, 27, 8, 7, 0);
// Camp structures
rect(obj, 8, 28, 3, 2, T.WALL_1); // Tent 1
obj[29][9] = T.DOOR;
rect(obj, 12, 29, 2, 2, T.WALL_1); // Tent 2
// Camp decorations
obj[28][11] = T.DECO_7; // Log pile
obj[31][9] = T.DECO_7;  // Woodworking bench

// Clear Mossy Clearing (20,20) 4x4
rect(obj, 19, 19, 6, 6, 0);
obj[21][22] = T.DECO_3; // Fallen log/bench

// Clear Eastern Canopy Path (36,18) 4x10
rect(obj, 36, 18, 4, 10, 0);
obj[18][37] = T.FENCE; obj[27][37] = T.FENCE; // Path railings

// ═══ OBJECTS UPPER ═══
const up = canopyFromObjects(obj, W, H);
rect(up, 8, 28, 3, 1, T.ROOF_1);  // Tent roofs
rect(up, 12, 29, 2, 1, T.ROOF_1);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR) col[r][c] = 0;
col[20][0] = 0; col[20][W - 1] = 0; col[H - 1][10] = 0;
// Lake blocked
rect(col, 29, 24, 6, 6, 1);

writeMap({
  name: 'ambergrove',
  mapName: 'Ambergrove',
  width: W, height: H,
  tileset: 'tiles_forest_normal.tsx',
  vibrancy: 45,
  category: 'overworld',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
