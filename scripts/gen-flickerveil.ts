#!/usr/bin/env npx tsx
/** Generate flickerveil.tmx — flickering forest frontier, 50x50 */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, canopyFromObjects, writeMap,
} from './map-gen-lib';

const W = 50, H = 50;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_1);
// Forest floor with muted tones
naturalGround(gnd, 0, 0, W, H, T.GROUND_1, T.GROUND_2, T.GROUND_3);

// Luminos Grove (18,18) 6x6: light column clearing
naturalGround(gnd, 18, 18, 6, 6, T.GROUND_5, T.GROUND_4, T.GROUND_5);

// Flickering Village (33,28) 10x8: cobblestone
naturalGround(gnd, 33, 28, 10, 8, T.GROUND_6, T.GROUND_8, T.GROUND_6);

// Resonance Archive (8,8) 6x6: ancient stone floor
rect(gnd, 8, 8, 6, 6, T.GROUND_6);

// Veil's Edge (46,23) 4x6: transitional ground
naturalGround(gnd, 46, 23, 4, 6, T.GROUND_7, T.GROUND_3, T.GROUND_7);

// ═══ GROUND2 (paths) ═══
const g2 = grid(W, H);

// West gate (0,25) to village
pathH(g2, 25, 0, 33);
// NW gate (0,15) connects
pathV(g2, 5, 15, 25);
pathH(g2, 15, 0, 5);
g2[25][5] = T.PATH_T;
// SW gate (0,38) to Ambergrove
pathV(g2, 5, 25, 38);
pathH(g2, 38, 0, 5);
g2[25][5] = T.PATH_X;
// Path to Luminos Grove
pathV(g2, 20, 18, 25);
g2[25][20] = T.PATH_T;
// Path to Archive
pathH(g2, 10, 8, 20);
pathV(g2, 20, 10, 18);
// Path to Veil's Edge
pathH(g2, 25, 33, 46);
// East gate
pathH(g2, 25, 46, 49);
// Village internal paths
pathV(g2, 36, 28, 35);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Dense flickering forest
scatter(obj, 0, 0, W, H, T.TREE, 0.25, 700);

// Edge trees
for (let c = 0; c < W; c++) { obj[0][c] = T.TREE; obj[H - 1][c] = T.TREE; }
for (let r = 1; r < H - 1; r++) { obj[r][0] = T.TREE; obj[r][W - 1] = T.TREE; }

// Clear paths
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (g2[r][c] !== 0) obj[r][c] = 0;

// Gate clearings
obj[25][0] = 0;       // West → Shimmer Marsh
obj[15][0] = 0;       // NW → Hollow Ridge
obj[38][0] = 0;       // SW → Ambergrove
obj[25][W - 1] = 0;   // East → Half-Drawn Forest

// Luminos Grove (18,18) 6x6
rect(obj, 17, 17, 8, 8, 0);
// Light column markers
obj[18][20] = T.DECO_9; obj[23][20] = T.DECO_9;
obj[20][18] = T.DECO_9; obj[20][23] = T.DECO_9;
// Center prism (recall pedestal)
obj[20][20] = T.DECO_4;

// Flickering Village (33,28) 10x8
rect(obj, 32, 27, 12, 10, 0);
// Inn (34,32) 3x3
rect(obj, 34, 32, 3, 3, T.WALL_1);
obj[34][35] = T.DOOR;
// Shop (36,29) 3x2
rect(obj, 36, 29, 3, 2, T.WALL_1);
obj[30][37] = T.DOOR;
// Village elder house (35,30) 2x2
rect(obj, 35, 30, 2, 2, T.WALL_2);
obj[31][35] = T.DOOR;
// Guard post
rect(obj, 31, 28, 2, 2, T.WALL_2);
// Decorations
obj[30][35] = T.DECO_9;  // Village Resonance Stone
obj[28][34] = T.DECO_10; // Signpost
obj[29][38] = T.DECO_2;  // Lantern
obj[35][38] = T.DECO_2;
obj[33][34] = T.DECO_7;  // Barrel

// Resonance Archive (8,8) 6x6
rect(obj, 7, 7, 8, 8, 0);
// Spiral of standing stones
obj[8][8] = T.DECO_9; obj[8][13] = T.DECO_9;
obj[10][9] = T.DECO_9; obj[9][10] = T.DECO_9;
obj[7][9] = T.DECO_9; obj[9][7] = T.DECO_9;
// Archive border
border(obj, 8, 8, 6, 6, T.FENCE);
obj[13][10] = 0; // South opening

// Veil's Edge (46,23) 4x6
rect(obj, 45, 22, 5, 8, 0);
obj[24][45] = T.DECO_9; // Boundary Resonance Stone
obj[22][47] = T.FENCE;
obj[29][47] = T.FENCE;

// ═══ OBJECTS UPPER ═══
const up = canopyFromObjects(obj, W, H);
rect(up, 34, 32, 3, 2, T.ROOF_1); // Inn roof
rect(up, 36, 29, 3, 1, T.ROOF_1); // Shop roof
rect(up, 35, 30, 2, 1, T.ROOF_2); // Elder house roof
rect(up, 31, 28, 2, 1, T.ROOF_2); // Guard post roof

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR) col[r][c] = 0;

col[25][0] = 0; col[15][0] = 0; col[38][0] = 0; col[25][W - 1] = 0;

writeMap({
  name: 'flickerveil',
  mapName: 'Flickerveil',
  width: W, height: H,
  tileset: 'tiles_forest_muted.tsx',
  vibrancy: 25,
  category: 'frontier',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
