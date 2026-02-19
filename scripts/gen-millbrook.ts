#!/usr/bin/env npx tsx
/** Generate millbrook.tmx — riverside town, 40x40 */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, canopyFromObjects, writeMap,
} from './map-gen-lib';

const W = 40, H = 40;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_1);
naturalGround(gnd, 0, 0, W, H, T.GROUND_1, T.GROUND_5, T.GROUND_2);

// Brightwater River: N-S, cols 17-19 (3 wide)
for (let r = 0; r < H; r++)
  for (let c = 17; c <= 19; c++)
    gnd[r][c] = T.GROUND_7; // Water/dark

// River widens near falls (rows 0-8, cols 16-20)
for (let r = 0; r <= 8; r++)
  for (let c = 16; c <= 20; c++)
    gnd[r][c] = T.GROUND_7;

// Millbrook Town (12,12) 12x12: cobblestone
naturalGround(gnd, 12, 12, 6, 12, T.GROUND_6, T.GROUND_1, T.GROUND_3); // west bank
naturalGround(gnd, 20, 12, 6, 12, T.GROUND_6, T.GROUND_1, T.GROUND_3); // east bank

// Upstream Falls area (6,3) 5x5
rect(gnd, 6, 3, 5, 5, T.GROUND_7);

// Fisher's Rest (28,28) 5x5: wooden dock
naturalGround(gnd, 28, 28, 5, 5, T.GROUND_8, T.GROUND_6, T.GROUND_8);

// Bridge (18,18) 6x3: stone/wood
for (let c = 16; c <= 21; c++)
  for (let r = 17; r <= 19; r++)
    gnd[r][c] = T.GROUND_8;

// ═══ GROUND2 (paths) ═══
const g2 = grid(W, H);

// N-S path west bank
pathV(g2, 14, 8, 30);
// N-S path east bank
pathV(g2, 22, 8, 30);
// Bridge crossing
pathH(g2, 18, 14, 22);
// Path to Fisher's Rest
pathH(g2, 24, 22, 28);
g2[24][22] = T.PATH_T;
// Path to east gate (Everwick)
pathH(g2, 20, 22, 39);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Trees scattered along riverbanks
scatter(obj, 0, 0, 16, H, T.TREE, 0.15, 300);
scatter(obj, 21, 0, 19, H, T.TREE, 0.15, 301);

// Edge trees
for (let c = 0; c < W; c++) { obj[0][c] = T.TREE; obj[H - 1][c] = T.TREE; }
for (let r = 1; r < H - 1; r++) { obj[r][0] = T.TREE; obj[r][W - 1] = T.TREE; }

// Gate clearings
obj[20][W - 1] = 0; // East → Everwick
obj[H - 1][20] = 0; // South → Heartfield
obj[20][0] = 0;      // West → Hollow Ridge

// Clear town area
rect(obj, 12, 12, 6, 12, 0);  // west bank
rect(obj, 20, 12, 6, 12, 0);  // east bank
rect(obj, 16, 17, 6, 3, 0);   // bridge

// Town buildings (west bank)
// Specialty Shop (14,14) 4x3
rect(obj, 14, 14, 4, 3, T.WALL_1);
obj[16][15] = T.DOOR;
// Inn (12,18) 3x3
rect(obj, 12, 18, 3, 3, T.WALL_1);
obj[20][13] = T.DOOR;
// House (12,22) 3x3
rect(obj, 12, 22, 3, 3, T.WALL_2);
obj[24][13] = T.DOOR;

// Town buildings (east bank)
// General Store (22,14) 4x3
rect(obj, 22, 14, 4, 3, T.WALL_2);
obj[16][23] = T.DOOR;
// Guard House (22,18) 3x3
rect(obj, 22, 18, 3, 3, T.WALL_2);
obj[20][23] = T.DOOR;

// Bridge decorations
obj[17][16] = T.DECO_2; obj[17][21] = T.DECO_2; // Bridge lanterns
obj[19][16] = T.DECO_2; obj[19][21] = T.DECO_2;

// Bridge resonance stone
obj[19][18] = T.DECO_9;

// Town decorations
obj[13][14] = T.DECO_10; // Town signpost
obj[17][14] = T.DECO_2;  // Lantern
obj[21][22] = T.DECO_2;

// Upstream Falls
rect(obj, 6, 3, 5, 5, 0);
obj[3][8] = T.DECO_9; // Falls cave marker

// Fisher's Rest
rect(obj, 28, 28, 5, 5, 0);
rect(obj, 28, 28, 3, 2, T.WALL_1); // Fisher hut
obj[29][29] = T.DOOR;
obj[30][30] = T.DECO_7; // Barrel
obj[31][29] = T.FENCE;  // Dock railing
obj[32][29] = T.FENCE;

// ═══ OBJECTS UPPER ═══
const up = canopyFromObjects(obj, W, H);
rect(up, 14, 14, 4, 2, T.ROOF_1);
rect(up, 12, 18, 3, 2, T.ROOF_1);
rect(up, 12, 22, 3, 2, T.ROOF_2);
rect(up, 22, 14, 4, 2, T.ROOF_2);
rect(up, 22, 18, 3, 2, T.ROOF_2);
rect(up, 28, 28, 3, 1, T.ROOF_1);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR) col[r][c] = 0;

// River blocked (except bridge)
for (let r = 0; r < H; r++)
  for (let c = 17; c <= 19; c++)
    col[r][c] = 1;
// Bridge passable
for (let c = 16; c <= 21; c++)
  for (let r = 17; r <= 19; r++)
    col[r][c] = 0;

// Gate clearings
col[20][0] = 0; col[20][W - 1] = 0; col[H - 1][20] = 0;

writeMap({
  name: 'millbrook',
  mapName: 'Millbrook',
  width: W, height: H,
  tileset: 'tiles_riverside_normal.tsx',
  vibrancy: 50,
  category: 'overworld',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
