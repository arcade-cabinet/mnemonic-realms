#!/usr/bin/env npx tsx
/** Generate depths-l5.tmx — The Deepest Memory, 20x25 */
import {
  T, grid, rect, naturalGround, pathV,
  collisionFromObjects, writeMap,
} from './map-gen-lib';

const W = 20, H = 25;

// ═══ GROUND ═══
const gnd = grid(W, H, T.GROUND_7);
// Shifting hues, cosmic void
naturalGround(gnd, 0, 0, W, H, T.GROUND_7, T.GROUND_6, T.GROUND_3);
// Room 1 Threshold (1,1→20,3)
rect(gnd, 0, 0, W, 3, T.GROUND_8);
// Room 2 Inverted Chamber (1,4→4,8)
rect(gnd, 0, 3, 4, 5, T.GROUND_6);
// Room 3 Timeline Fracture (6,4→9,8)
naturalGround(gnd, 5, 3, 4, 5, T.GROUND_7, T.GROUND_8, T.GROUND_7);
// Room 4 Paradox Corridor (11,4→20,8)
rect(gnd, 10, 3, 10, 5, T.GROUND_3);
// Room 5 Memory Nexus (1,9→20,12)
naturalGround(gnd, 0, 8, W, 4, T.GROUND_8, T.GROUND_7, T.GROUND_8);
// Room 6 Echo Gallery (1,13→4,17)
rect(gnd, 0, 12, 4, 5, T.GROUND_6);
// Room 7 Civilization's End (6,13→9,17)
rect(gnd, 5, 12, 4, 5, T.GROUND_7);
// Room 8 Fragment Vault (11,13→14,17)
rect(gnd, 10, 12, 4, 5, T.GROUND_8);
// Room 9 Lore Archive (16,13→20,17)
rect(gnd, 15, 12, 5, 5, T.GROUND_6);
// Room 10 Boss Arena (1,18→20,25)
naturalGround(gnd, 0, 17, W, 8, T.GROUND_8, T.GROUND_7, T.GROUND_8);

// ═══ GROUND2 ═══
const g2 = grid(W, H);
pathV(g2, 9, 0, 24);

// ═══ OBJECTS ═══
const obj = grid(W, H);

// Outer walls
for (let c = 0; c < W; c++) { obj[0][c] = T.WALL_2; obj[H - 1][c] = T.WALL_2; }
for (let r = 0; r < H; r++) { obj[r][0] = T.WALL_2; obj[r][W - 1] = T.WALL_2; }

// Room dividers
for (let c = 0; c < W; c++) obj[3][c] = T.WALL_2;
obj[3][9] = 0;
// Vertical dividers between rooms 2/3/4
for (let r = 3; r <= 8; r++) { obj[r][4] = T.WALL_2; obj[r][9] = T.WALL_2; }
obj[5][4] = 0; obj[5][9] = 0;
for (let c = 0; c < W; c++) obj[8][c] = T.WALL_2;
obj[8][2] = 0; obj[8][7] = 0; obj[8][9] = 0;
// Row 12
for (let c = 0; c < W; c++) obj[12][c] = T.WALL_2;
obj[12][2] = 0; obj[12][7] = 0; obj[12][12] = 0; obj[12][17] = 0;
// Vertical dividers between rooms 6/7/8/9
for (let r = 12; r <= 17; r++) {
  obj[r][4] = T.WALL_2;
  obj[r][9] = T.WALL_2;
  obj[r][14] = T.WALL_2;
}
obj[14][4] = 0; obj[14][9] = 0; obj[14][14] = 0;
// Row 17
for (let c = 0; c < W; c++) obj[17][c] = T.WALL_2;
obj[17][9] = 0;

// Room 1: Threshold
obj[0][9] = 0; obj[0][10] = 0;
obj[1][5] = T.DECO_2; obj[1][14] = T.DECO_2;

// Room 2: Inverted Chamber
obj[5][1] = T.DECO_9; // Inverted RS
obj[6][2] = T.DECO_7;

// Room 3: Timeline Fracture
obj[5][6] = T.DECO_9; // Fractured RS
obj[6][7] = T.DECO_4; // Time pool

// Room 4: Paradox Corridor
obj[5][14] = T.DECO_9; // Paradox stone
obj[6][17] = T.DECO_2;

// Room 5: Memory Nexus
obj[9][3] = T.DECO_9;  // Memory lift
obj[10][9] = T.DECO_9; // Central RS
obj[10][15] = T.DECO_7; // Treasure
obj[9][6] = T.DECO_2;
obj[9][12] = T.DECO_2;

// Room 6: Echo Gallery
obj[14][1] = T.DECO_9; // Echo RS
obj[15][2] = T.DECO_7;

// Room 7: Civilization's End
obj[14][6] = T.DECO_9; // Civilization RS
obj[15][7] = T.DECO_4; // Memory deposit

// Room 8: Fragment Vault
obj[14][11] = T.DECO_9; // Vault RS
obj[15][12] = T.DECO_7; // Fragment chest

// Room 9: Lore Archive (fortress shortcut)
obj[14][17] = T.DECO_9; // Archive RS
obj[15][16] = T.DECO_7; // Lore item
obj[16][18] = T.STEPS;  // Shortcut to fortress (GQ-03-F2)

// Room 10: Boss Arena — The First Dreamer
obj[20][9] = T.DECO_9;  // First Dreamer position
obj[19][3] = T.DECO_2;  obj[19][15] = T.DECO_2;
obj[22][14] = T.DECO_7; // Boss reward

// ═══ OBJECTS UPPER ═══
const up = grid(W, H);

// ═══ COLLISION ═══
const col = collisionFromObjects(obj, W, H);
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.STEPS) col[r][c] = 0;
col[0][9] = 0; col[0][10] = 0;
col[3][9] = 0; col[5][4] = 0; col[5][9] = 0;
col[8][2] = 0; col[8][7] = 0; col[8][9] = 0;
col[12][2] = 0; col[12][7] = 0; col[12][12] = 0; col[12][17] = 0;
col[14][4] = 0; col[14][9] = 0; col[14][14] = 0;
col[17][9] = 0;
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === T.DECO_9 || obj[r][c] === T.DECO_2 ||
        obj[r][c] === T.DECO_4) col[r][c] = 0;

writeMap({
  name: 'depths-l5',
  mapName: 'The Deepest Memory',
  width: W, height: H,
  tileset: 'tiles_dungeon_vivid.tsx',
  vibrancy: 30,
  category: 'dungeon',
  layers: { ground: gnd, ground2: g2, objects: obj, objects_upper: up, collision: col },
});
