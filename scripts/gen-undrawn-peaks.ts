#!/usr/bin/env npx tsx
/** Generate undrawn-peaks.tmx — sketch mountain zone, 40x40 */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, canopyFromObjects, writeMap,
} from './map-gen-lib';

const W = 40, H = 40;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_1);
// Sketch mountain: stark, geometric
naturalGround(gnd, 0, 0, W, H, T.GROUND_3, T.GROUND_1, T.GROUND_2);

// The Apex (18,3) 4x4: highest point stone platform
rect(gnd, 18, 3, 4, 4, T.GROUND_6);

// Crystalline Fortress Gate (18,33) 6x4: crystal ground
rect(gnd, 18, 33, 6, 4, T.GROUND_7);

// Sketch Bridge (20,20) 6x2: bridge over chasm
rect(gnd, 20, 20, 6, 2, T.GROUND_8);

// Chasm (void) rows 18-22 (except bridge)
for (let c = 0; c < W; c++) {
  for (let r = 18; r <= 22; r++) {
    if (!(c >= 20 && c <= 25 && r >= 20 && r <= 21)) {
      gnd[r][c] = T.GROUND_7;
    }
  }
}

// Wireframe ridge paths
naturalGround(gnd, 0, 8, W, 8, T.GROUND_3, T.GROUND_6, T.GROUND_3);
naturalGround(gnd, 0, 25, W, 6, T.GROUND_3, T.GROUND_6, T.GROUND_3);

// ═══ GROUND2 (paths) ═══
const g2 = grid(W, H);

// South gate (20,39) to fortress gate
pathV(g2, 20, 36, 39);
// Path from fortress gate to bridge
pathV(g2, 21, 21, 33);
// Bridge crossing
pathH(g2, 20, 20, 25);
pathH(g2, 21, 20, 25);
// Bridge to Apex
pathV(g2, 22, 6, 20);
// Path around for east gate
pathH(g2, 25, 21, 39);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Wireframe rock formations (sparse, geometric)
scatter(obj, 0, 0, W, H, T.TREE, 0.08, 960);

// Edge walls
for (let c = 0; c < W; c++) { obj[0][c] = T.TREE; obj[H - 1][c] = T.TREE; }
for (let r = 1; r < H - 1; r++) { obj[r][0] = T.TREE; obj[r][W - 1] = T.TREE; }

// Clear paths
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (g2[r][c] !== 0) obj[r][c] = 0;

// Gate clearings
obj[H - 1][20] = 0;   // South → Hollow Ridge
obj[25][W - 1] = 0;   // East → Half-Drawn Forest

// The Apex (18,3) 4x4
rect(obj, 17, 2, 6, 6, 0);
border(obj, 18, 3, 4, 4, T.FENCE);
obj[6][19] = 0; // South opening
obj[4][19] = T.DECO_9; // Summit Resonance Stone

// Crystalline Fortress Gate (18,33) 6x4
rect(obj, 17, 32, 8, 6, 0);
// Two crystal pillars
obj[33][17] = T.WALL_2; obj[33][24] = T.WALL_2;
obj[34][17] = T.WALL_2; obj[34][24] = T.WALL_2;
// Gate passable only after solidification (event handles)
obj[34][19] = T.DECO_9; // Broadcast target RS

// Sketch Bridge (20,20) 6x2
rect(obj, 19, 19, 8, 4, 0);
obj[20][20] = T.DECO_9; // Bridge broadcast target

// Chasm edges — block the void
for (let c = 0; c < W; c++) {
  for (let r = 18; r <= 22; r++) {
    if (!(c >= 20 && c <= 25 && r >= 20 && r <= 21)) {
      if (obj[r][c] === 0) obj[r][c] = 0; // Keep void open visually
    }
  }
}

// Mountain ledge stones
obj[15][10] = T.DECO_9; // Fragment stone
obj[25][30] = T.DECO_9; // East ridge stone

// ═══ OBJECTS UPPER ═══
const up = canopyFromObjects(obj, W, H);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);

// Chasm blocked (except bridge)
for (let c = 0; c < W; c++)
  for (let r = 18; r <= 22; r++)
    col[r][c] = 1;
// Bridge passable
for (let c = 20; c <= 25; c++) {
  col[20][c] = 0;
  col[21][c] = 0;
}

col[H - 1][20] = 0; col[25][W - 1] = 0;

writeMap({
  name: 'undrawn-peaks',
  mapName: 'The Undrawn Peaks',
  width: W, height: H,
  tileset: 'tiles_sketch_muted.tsx',
  vibrancy: 10,
  category: 'sketch',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
