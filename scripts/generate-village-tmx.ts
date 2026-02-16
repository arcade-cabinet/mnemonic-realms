#!/usr/bin/env npx tsx
/**
 * Generate village-hub.tmx from spec + tile catalog.
 * Reads existing TMX to preserve events objectgroup, rewrites all tile layers.
 * Run: npx tsx scripts/generate-village-tmx.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const W = 30, H = 30;
type Grid = number[][];

const grid = (fill: number): Grid =>
  Array.from({ length: H }, () => Array(W).fill(fill));

const rect = (g: Grid, x: number, y: number, w: number, h: number, t: number) => {
  for (let r = y; r < y + h && r < H; r++)
    for (let c = x; c < x + w && c < W; c++)
      g[r][c] = t;
};

// ── Village Normal Tile IDs (from tileset-catalog.md) ──
const COBBLE = 1, COBBLE2 = 2, COBBLE3 = 3;
const FLOWER_GRASS = 4, GRASS = 5, DIRT = 6;
const PATH_H = 33, PATH_V = 34, PATH_T = 36, PATH_X = 37, STEPS = 38;
const LANTERN = 146, BENCH = 147;
const FLOWERPOT = 145, BARREL = 151, MEMORIAL = 153, SIGNPOST = 154;
const WALL_CREAM = 177, WALL_GRAY = 178;
const ROOF_TAN = 179, ROOF_BROWN = 180;
const HEDGE = 182, TREE = 183, DOOR = 184;
const FOUNTAIN = 193;

// ═══════════════════════════════════════════
// GROUND LAYER — base terrain
// ═══════════════════════════════════════════
const gnd = grid(GRASS);

// Lookout Hill area (cols 12-17, rows 2-6): cobblestone
for (let r = 2; r <= 6; r++)
  for (let c = 12; c <= 17; c++)
    gnd[r][c] = (r + c) % 3 === 0 ? COBBLE2 : COBBLE;

// Village proper (cols 8-22, rows 7-23): cobblestone with scattered variants
for (let r = 7; r <= 23; r++)
  for (let c = 8; c <= 22; c++)
    gnd[r][c] = (r * 3 + c * 7) % 7 === 0 ? COBBLE2
              : (r * 5 + c) % 11 === 0 ? COBBLE3
              : COBBLE;

// Inn extends to col 24 (rows 14-17)
for (let r = 14; r <= 17; r++)
  for (let c = 23; c <= 24; c++)
    gnd[r][c] = COBBLE;

// Memorial Garden: flowered grass (cols 8-11, rows 16-18)
rect(gnd, 8, 16, 4, 3, FLOWER_GRASS);

// South gate road (row 24): dirt edges, cobblestone center
for (let c = 0; c < W; c++)
  gnd[24][c] = c >= 8 && c <= 22 ? COBBLE : DIRT;

// ═══════════════════════════════════════════
// GROUND2 LAYER — path overlay (mostly empty)
// ═══════════════════════════════════════════
const g2 = grid(0);

// Steps down from Lookout Hill
g2[6][15] = STEPS;

// Main N-S path: col 15, rows 7-23
for (let r = 7; r <= 23; r++) g2[r][15] = PATH_V;

// E-W crossroad connecting Training Ground ↔ Elder's House (row 11)
for (let c = 13; c <= 17; c++) g2[11][c] = PATH_H;
g2[11][15] = PATH_X; // crossroads

// E-W main street (row 14): Quest Board → Central Square → Inn
for (let c = 10; c <= 20; c++) g2[14][c] = PATH_H;
g2[14][15] = PATH_T; // T-junction (N-S path meets E-W)

// ═══════════════════════════════════════════
// OBJECTS LAYER — trees, buildings, decorations
// ═══════════════════════════════════════════
const obj = grid(0);

// ── Tree borders ──
// Top tree line (rows 0-1, full width except north gate at col 15)
rect(obj, 0, 0, W, 2, TREE);
obj[0][15] = 0; obj[1][15] = 0; // North gate

// Bottom tree line (rows 27-29, except south gate at col 15)
rect(obj, 0, 27, W, 3, TREE);
obj[27][15] = 0; obj[28][15] = 0;

// Side tree corridors (scattered, natural look)
for (let r = 2; r <= 26; r++) {
  // Left trees (cols 0-6): checkerboard pattern
  for (let c = 0; c <= 6; c++)
    if ((r + c) % 2 === 0) obj[r][c] = TREE;
  // Left village tree line (col 7)
  obj[r][7] = TREE;
  // Right trees (cols 24-29): checkerboard
  for (let c = 24; c <= 29; c++)
    if ((r + c) % 2 === 0) obj[r][c] = TREE;
  // Right village tree line (col 23) for village rows
  if (r >= 7 && r <= 23) obj[r][23] = TREE;
}

// ── Gate clearings ──
// West gate (row 14, cols 0-7)
for (let c = 0; c <= 7; c++) obj[14][c] = 0;
// East gate (row 14, cols 23-29)
for (let c = 23; c <= 29; c++) obj[14][c] = 0;
// South gate approach (row 25-26, col 15)
obj[25][15] = 0; obj[26][15] = 0;

// ── Lookout Hill (12,2) 6x5 — stone perimeter, open interior ──
for (let c = 12; c <= 17; c++) { obj[2][c] = WALL_GRAY; obj[6][c] = WALL_GRAY; }
for (let r = 2; r <= 6; r++) { obj[r][12] = WALL_GRAY; obj[r][17] = WALL_GRAY; }
// Clear interior
for (let r = 3; r <= 5; r++)
  for (let c = 13; c <= 16; c++) obj[r][c] = 0;
// Entrance gap (south face)
obj[6][14] = 0; obj[6][15] = 0;

// ── Training Ground (8,10) 6x5 ──
rect(obj, 8, 10, 6, 5, WALL_CREAM);
obj[14][10] = DOOR; obj[14][11] = DOOR;

// ── Elder's House (18,10) 5x5 ──
rect(obj, 18, 10, 5, 5, WALL_GRAY);
obj[14][20] = DOOR;

// ── Quest Board at (8,14) ──
obj[14][8] = SIGNPOST;

// ── Central Square decorations ──
obj[15][14] = FOUNTAIN; obj[15][15] = FOUNTAIN;
obj[14][12] = LANTERN; obj[14][17] = LANTERN;
obj[19][12] = LANTERN; obj[19][17] = LANTERN;
obj[16][12] = BENCH; obj[16][17] = BENCH;

// ── Inn (20,14) 5x4 ──
rect(obj, 20, 14, 5, 4, WALL_CREAM);
obj[17][22] = DOOR;

// ── Memorial Garden (8,16) 4x3 — hedges + memorial stones ──
obj[16][8] = HEDGE;
obj[18][8] = HEDGE; obj[18][9] = HEDGE; obj[18][10] = HEDGE; obj[18][11] = HEDGE;
obj[16][9] = MEMORIAL;  // RS-VH-02 position
obj[17][10] = MEMORIAL; // RS-VH-03 position
obj[16][11] = MEMORIAL; // RS-VH-04 position

// ── General Shop (18,16) 5x4 ──
rect(obj, 18, 16, 5, 4, WALL_GRAY);
obj[19][20] = DOOR;

// ── Lira's Workshop (8,19) 5x3 ──
rect(obj, 8, 19, 5, 3, WALL_CREAM);
obj[19][10] = DOOR;

// ── Blacksmith (18,20) 4x3 ──
rect(obj, 18, 20, 4, 3, WALL_GRAY);
obj[20][20] = DOOR;

// ── Extra decorations ──
obj[9][10] = BARREL; obj[9][11] = BARREL; // near Training Ground
obj[15][13] = FLOWERPOT; obj[15][16] = FLOWERPOT; // near fountain
obj[8][15] = LANTERN; obj[22][15] = LANTERN; // path lanterns

// ═══════════════════════════════════════════
// OBJECTS_UPPER — roofs + tree canopy
// ═══════════════════════════════════════════
const up = grid(0);

// Copy tree canopy from objects layer
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === TREE) up[r][c] = TREE;

// Building roofs (cover all but bottom row of each building)
rect(up, 12, 2, 6, 4, ROOF_BROWN);  // Lookout Hill
rect(up, 8, 10, 6, 4, ROOF_TAN);    // Training Ground
rect(up, 18, 10, 5, 4, ROOF_BROWN); // Elder's House
rect(up, 20, 14, 5, 3, ROOF_TAN);   // Inn
rect(up, 18, 16, 5, 3, ROOF_BROWN); // General Shop
rect(up, 8, 19, 5, 2, ROOF_TAN);    // Workshop
rect(up, 18, 20, 4, 2, ROOF_BROWN); // Blacksmith

// ═══════════════════════════════════════════
// COLLISION LAYER
// ═══════════════════════════════════════════
const col = grid(0);

// Trees = blocked
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === TREE || obj[r][c] === WALL_CREAM || obj[r][c] === WALL_GRAY
      || obj[r][c] === HEDGE)
      col[r][c] = 1;

// Map edges blocked
for (let c = 0; c < W; c++) { col[0][c] = 1; col[H - 1][c] = 1; }
for (let r = 0; r < H; r++) { col[r][0] = 1; col[r][W - 1] = 1; }

// Gate openings
col[0][15] = 0;          // North gate
col[14][0] = 0;          // West gate
col[14][W - 1] = 0;      // East gate
col[H - 1][15] = 0;      // South gate

// Doors passable
for (let r = 0; r < H; r++)
  for (let c = 0; c < W; c++)
    if (obj[r][c] === DOOR) col[r][c] = 0;

// Lookout Hill interior passable
for (let r = 3; r <= 5; r++)
  for (let c = 13; c <= 16; c++)
    col[r][c] = 0;

// ═══════════════════════════════════════════
// OUTPUT TMX
// ═══════════════════════════════════════════

// Extract events from existing TMX
const tmxPath = resolve('main/server/maps/tmx/village-hub.tmx');
const existingTmx = readFileSync(tmxPath, 'utf8');
const eventsMatch = existingTmx.match(/<objectgroup[\s\S]*?<\/objectgroup>/);
const eventsXml = eventsMatch?.[0] ?? '';

// CSV formatter: rows separated by newlines, trailing comma on all but last row
function csv(g: Grid): string {
  return g.map((row, i) => row.join(',') + (i < H - 1 ? ',' : '')).join('\n');
}

function layer(id: number, name: string, data: Grid): string {
  return ` <layer id="${id}" name="${name}" width="${W}" height="${H}">
  <data encoding="csv">
${csv(data)}
  </data>
 </layer>`;
}

const tmx = `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.9" tiledversion="1.9.2" orientation="orthogonal" renderorder="right-down" width="${W}" height="${H}" tilewidth="32" tileheight="32" infinite="0" nextlayerid="7" nextobjectid="100">
 <properties>
  <property name="category" value="overworld"/>
  <property name="mapName" value="Village Hub"/>
  <property name="vibrancy" type="int" value="60"/>
 </properties>
 <tileset firstgid="1" source="tiles_village_normal.tsx"/>
${layer(1, 'ground', gnd)}
${layer(2, 'ground2', g2)}
${layer(3, 'objects', obj)}
${layer(4, 'objects_upper', up)}
${layer(5, 'collision', col)}
 ${eventsXml}
</map>`;

writeFileSync(tmxPath, tmx);
console.log(`Wrote ${tmxPath} (${tmx.length} bytes)`);

// Sanity checks
const layers = [
  { name: 'ground', data: gnd },
  { name: 'ground2', data: g2 },
  { name: 'objects', data: obj },
  { name: 'objects_upper', data: up },
  { name: 'collision', data: col },
];
for (const l of layers) {
  const nonZero = l.data.flat().filter(t => t !== 0).length;
  console.log(`  ${l.name}: ${nonZero} non-zero tiles`);
}
