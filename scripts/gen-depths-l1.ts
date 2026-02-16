#!/usr/bin/env npx tsx
/** Generate depths-l1.tmx — Memory Cellar, 20x25 */
import {
  T, grid, rect, scatter, naturalGround, pathH, pathV,
  border, collisionFromObjects, writeMap,
} from './map-gen-lib';

const W = 20, H = 25;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_6);
// Stone cellar floor
naturalGround(gnd, 0, 0, W, H, T.GROUND_6, T.GROUND_3, T.GROUND_6);
// Room 1 Entry Hall (1,1→20,6): worn cobblestone
naturalGround(gnd, 0, 0, W, 6, T.GROUND_8, T.GROUND_6, T.GROUND_8);
// Room 2 Memory Alcove (1,7→8,11): smooth flagstone
rect(gnd, 0, 6, 8, 5, T.GROUND_8);
// Room 3 Guardian Chamber (10,7→20,11): cobblestone + platform
naturalGround(gnd, 9, 6, 11, 5, T.GROUND_8, T.GROUND_6, T.GROUND_8);
rect(gnd, 13, 8, 3, 3, T.GROUND_6); // Raised platform
// Room 4 Cache (10,12→20,17): smooth stone
naturalGround(gnd, 9, 11, 11, 6, T.GROUND_8, T.GROUND_6, T.GROUND_8);
// Room 5 Stairway (10,18→20,25): rough stone
naturalGround(gnd, 9, 17, 11, 8, T.GROUND_3, T.GROUND_6, T.GROUND_3);

// ═══ GROUND2 (detail overlays) ═══
const g2 = grid(W, H);
// Corridor path from Room 1 down to Room 5
pathV(g2, 9, 0, 24);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// All outer walls
for (let c = 0; c < W; c++) { obj[0][c] = T.WALL_2; obj[H - 1][c] = T.WALL_2; }
for (let r = 0; r < H; r++) { obj[r][0] = T.WALL_2; obj[r][W - 1] = T.WALL_2; }

// Room dividers
// Wall between Room 1 and Rooms 2/3 (row 6)
for (let c = 0; c < W; c++) obj[6][c] = T.WALL_2;
obj[6][4] = T.DOOR; // Door to Room 2
obj[6][9] = 0;      // Corridor gap

// Wall between Room 2 and Room 3 (col 8)
for (let r = 6; r <= 11; r++) obj[r][8] = T.WALL_2;
obj[8][8] = 0; // Connecting gap

// Wall between Room 3/2 and Room 4/5 (row 11)
for (let c = 0; c < W; c++) obj[11][c] = T.WALL_2;
obj[11][9] = 0; // Corridor gap

// Wall between Room 5 and west side (row 17)
for (let c = 0; c < 9; c++) obj[17][c] = T.WALL_2;
// Row 17 east side
for (let c = 9; c < W; c++) obj[17][c] = T.WALL_2;
obj[17][9] = 0; // Corridor gap

// Room 1: Entry Hall
obj[0][9] = 0; // Entry from surface at (10, 0)
obj[0][10] = 0;
obj[3][3] = T.DECO_7;  // Barrel
obj[3][15] = T.DECO_7; // Barrel
obj[4][11] = T.DECO_7; // Broken crate
obj[2][2] = T.DECO_9;  // Cracked Resonance Stone
obj[1][5] = T.DECO_2;  // Lantern bracket
obj[1][14] = T.DECO_2;

// Room 2: Memory Alcove
obj[8][3] = T.DECO_9;  // Resonance Stone
obj[7][1] = T.DECO_7;  // Treasure chest position

// Room 3: Guardian Chamber
obj[7][10] = T.DECO_2;  // Lantern
obj[7][18] = T.DECO_2;  // Lantern
obj[7][10] = T.DECO_5;  // Shield on wall

// Room 4: Dissolved Memory Cache
obj[13][14] = T.DECO_9; // Resonance Stone
obj[14][11] = T.DECO_7; // Treasure chest position
obj[14][14] = T.DECO_4; // Memory pool centerpiece

// Room 5: Stairway Chamber
obj[19][11] = T.DECO_9; // Memory lift crystal
obj[21][14] = T.STEPS;  // Spiral staircase down
obj[18][12] = T.DECO_2; // Lantern

// ═══ OBJECTS UPPER ═══
const up = grid(W, H);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
// Doors passable
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR || obj[r][c] === T.STEPS) col[r][c] = 0;
// Entry passable
col[0][9] = 0; col[0][10] = 0;
// Corridor gaps passable
col[6][9] = 0; col[8][8] = 0; col[11][9] = 0; col[17][9] = 0;
// Decorations passable
col[2][2] = 0; col[8][3] = 0; col[13][14] = 0; col[19][11] = 0;

writeMap({
  name: 'depths-l1',
  mapName: 'Memory Cellar',
  width: W, height: H,
  tileset: 'tiles_dungeon_vivid.tsx',
  vibrancy: 25,
  category: 'dungeon',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
