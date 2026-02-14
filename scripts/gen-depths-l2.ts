#!/usr/bin/env npx tsx
/** Generate depths-l2.tmx — Drowned Archive, 20x25 */
import {
  T, grid, rect, naturalGround, pathV,
  collisionFromObjects, writeMap,
} from './map-gen-lib';

const W = 20, H = 25;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_7);
// Submerged archive: water-themed floor
naturalGround(gnd, 0, 0, W, H, T.GROUND_7, T.GROUND_6, T.GROUND_7);
// Room 1 Entry Pool (1,1→20,4): shallow water
rect(gnd, 0, 0, W, 4, T.GROUND_7);
// Room 2 Reading Hall (1,5→9,9): smooth flagstone under water
naturalGround(gnd, 0, 4, 9, 5, T.GROUND_8, T.GROUND_7, T.GROUND_8);
// Room 3 Burdened Stone (11,5→20,9)
naturalGround(gnd, 10, 4, 10, 5, T.GROUND_6, T.GROUND_7, T.GROUND_6);
// Room 4 Flood Hall (1,10→20,13): deep water
rect(gnd, 0, 9, W, 4, T.GROUND_7);
// Room 5 Puzzle (1,14→9,18)
naturalGround(gnd, 0, 13, 9, 5, T.GROUND_8, T.GROUND_6, T.GROUND_8);
// Room 6 Lift (11,14→20,18)
naturalGround(gnd, 10, 13, 10, 5, T.GROUND_8, T.GROUND_6, T.GROUND_8);
// Room 7 Boss Arena (1,19→20,25)
naturalGround(gnd, 0, 18, W, 7, T.GROUND_8, T.GROUND_7, T.GROUND_8);

// ═══ GROUND2 ═══
const g2 = grid(W, H);
pathV(g2, 9, 0, 24); // Central corridor

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Outer walls
for (let c = 0; c < W; c++) { obj[0][c] = T.WALL_2; obj[H - 1][c] = T.WALL_2; }
for (let r = 0; r < H; r++) { obj[r][0] = T.WALL_2; obj[r][W - 1] = T.WALL_2; }

// Room dividers
for (let c = 0; c < W; c++) obj[4][c] = T.WALL_2;
obj[4][9] = 0; // Corridor
for (let r = 4; r <= 9; r++) obj[r][9] = T.WALL_2;
obj[6][9] = 0; // Room 2-3 connection
for (let c = 0; c < W; c++) obj[9][c] = T.WALL_2;
obj[9][9] = 0;
for (let c = 0; c < W; c++) obj[13][c] = T.WALL_2;
obj[13][9] = 0;
for (let r = 13; r <= 18; r++) obj[r][9] = T.WALL_2;
obj[15][9] = 0;
for (let c = 0; c < W; c++) obj[18][c] = T.WALL_2;
obj[18][9] = 0;

// Room 1: Entry Pool
obj[0][9] = 0; obj[0][10] = 0; // Entry
obj[1][4] = T.DECO_9; // Submerged tablet

// Room 2: Reading Hall
obj[6][3] = T.DECO_9; // Resonance Stone
obj[5][1] = T.DECO_7; // Treasure chest
obj[5][4] = T.DECO_7; // Waterlogged desk
obj[7][2] = T.DECO_7;

// Room 3: Burdened Stone
obj[6][14] = T.DECO_9; // Burdened RS
obj[5][17] = T.DECO_7; // Treasure chest

// Room 4: Flood Hall
obj[11][2] = T.DECO_7; // Hidden alcove treasure
obj[10][16] = T.DECO_9; // Floating RS
obj[10][5] = T.DECO_2; // Submerged lantern

// Room 5: Puzzle
obj[14][2] = T.DECO_9; // Left valve
obj[14][6] = T.DECO_9; // Right valve
obj[14][4] = T.DECO_9; // Center valve
obj[16][4] = T.DECO_5; // Submerged mural

// Room 6: Lift
obj[15][14] = T.DECO_9; // Memory lift
obj[14][12] = T.DECO_9; // Save RS

// Room 7: Boss Arena
obj[20][9] = T.DECO_9;  // The Archivist (boss position)
obj[19][14] = T.DECO_7; // Treasure chest
obj[23][9] = T.STEPS;   // Stairway down
obj[19][3] = T.DECO_2;  // Lantern
obj[19][15] = T.DECO_2;

// ═══ OBJECTS UPPER ═══
const up = grid(W, H);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DOOR || obj[r][c] === T.STEPS) col[r][c] = 0;
// Entry
col[0][9] = 0; col[0][10] = 0;
// Corridor gaps
col[4][9] = 0; col[6][9] = 0; col[9][9] = 0; col[13][9] = 0;
col[15][9] = 0; col[18][9] = 0;
// Decorations walkable
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DECO_9 || obj[r][c] === T.DECO_2 ||
        obj[r][c] === T.DECO_5 || obj[r][c] === T.DECO_4) col[r][c] = 0;

writeMap({
  name: 'depths-l2',
  mapName: 'Drowned Archive',
  width: W, height: H,
  tileset: 'tiles_dungeon_vivid.tsx',
  vibrancy: 35,
  category: 'dungeon',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
