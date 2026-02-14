/**
 * Shared map generation library.
 * All biome tilesets share the same tile ID layout:
 *   Rows 0-1 (1-32): Ground variants
 *   Row 2 (33-48): Paths
 *   Rows 3-8 (49-144): Empty (autotile reserved)
 *   Row 9 (145-160): Decorations
 *   Row 10 (161-176): More decorations
 *   Row 11 (177-192): Obstacles
 *   Rows 12-13 (193-224): Animated
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// ── Functional Tile IDs (same across all biomes) ──
// Ground (rows 0-1)
export const T = {
  GROUND_1: 1,   // Primary ground
  GROUND_2: 2,   // Ground variant
  GROUND_3: 3,   // Ground variant
  GROUND_4: 4,   // Secondary ground (flowers/alt)
  GROUND_5: 5,   // Tertiary ground (grass/alt)
  GROUND_6: 6,   // Dirt/sandy
  GROUND_7: 7,   // Tilled/dark soil
  GROUND_8: 8,   // Floor (wood/stone)
  // Paths (row 2)
  PATH_H: 33,    // Horizontal path
  PATH_V: 34,    // Vertical path
  PATH_CORNER: 35,
  PATH_T: 36,    // T-junction
  PATH_X: 37,    // Crossroads
  STEPS: 38,     // Steps/stairs
  // Decorations (row 9)
  DECO_1: 145,   // Flowerpot/mushroom/crystal
  DECO_2: 146,   // Lantern/post/torch
  DECO_3: 147,   // Bench/log/seat
  DECO_4: 148,   // Well/fountain/pool
  DECO_5: 149,   // Banner/flag/sign
  DECO_6: 150,   // Window/hanging
  DECO_7: 151,   // Barrel/crate/rock
  DECO_8: 152,   // Cart/large prop
  DECO_9: 153,   // Memorial/standing stone
  DECO_10: 154,  // Signpost/marker
  // Obstacles (row 11)
  WALL_1: 177,   // Wall type A (cream/wood)
  WALL_2: 178,   // Wall type B (stone/dark)
  ROOF_1: 179,   // Roof type A (light)
  ROOF_2: 180,   // Roof type B (dark)
  FENCE: 181,    // Fence/railing
  HEDGE: 182,    // Hedge/bush/barrier
  TREE: 183,     // Large tree/rock/pillar
  DOOR: 184,     // Door/entrance
  // Animated (row 12+)
  ANIM_1: 193,   // Water/fountain frame 1
  ANIM_2: 197,   // Butterfly/particle frame 1
  ANIM_3: 201,   // Smoke/mist frame 1
} as const;

// ── Grid Types & Helpers ──
export type Grid = number[][];

export function grid(w: number, h: number, fill = 0): Grid {
  return Array.from({ length: h }, () => Array(w).fill(fill));
}

export function rect(g: Grid, x: number, y: number, w: number, h: number, tile: number) {
  const H = g.length, W = g[0].length;
  for (let r = y; r < y + h && r < H; r++)
    for (let c = x; c < x + w && c < W; c++)
      g[r][c] = tile;
}

export function border(g: Grid, x: number, y: number, w: number, h: number, tile: number) {
  const H = g.length, W = g[0].length;
  for (let c = x; c < x + w && c < W; c++) {
    if (y < H) g[y][c] = tile;
    if (y + h - 1 < H) g[y + h - 1][c] = tile;
  }
  for (let r = y; r < y + h && r < H; r++) {
    if (x < W) g[r][x] = tile;
    if (x + w - 1 < W) g[r][x + w - 1] = tile;
  }
}

/** Scatter a tile randomly in a region, with given density (0-1). */
export function scatter(
  g: Grid, x: number, y: number, w: number, h: number,
  tile: number, density: number, seed = 42
) {
  const H = g.length, W = g[0].length;
  let s = seed;
  const rng = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  for (let r = y; r < y + h && r < H; r++)
    for (let c = x; c < x + w && c < W; c++)
      if (g[r][c] === 0 && rng() < density) g[r][c] = tile;
}

/** Fill ground with primary + variant tiles for natural look. */
export function naturalGround(
  g: Grid, x: number, y: number, w: number, h: number,
  primary: number, variant1: number, variant2: number, density = 0.15
) {
  const H = g.length, W = g[0].length;
  for (let r = y; r < y + h && r < H; r++)
    for (let c = x; c < x + w && c < W; c++) {
      const hash = (r * 3 + c * 7);
      g[r][c] = hash % 7 === 0 ? variant1 : hash % 11 === 0 ? variant2 : primary;
    }
}

/** Place a horizontal path. */
export function pathH(g: Grid, y: number, x1: number, x2: number, tile = T.PATH_H) {
  for (let c = x1; c <= x2 && c < g[0].length; c++) g[y][c] = tile;
}

/** Place a vertical path. */
export function pathV(g: Grid, x: number, y1: number, y2: number, tile = T.PATH_V) {
  for (let r = y1; r <= y2 && r < g.length; r++) g[r][x] = tile;
}

// ── TMX Output ──
export interface MapConfig {
  name: string;
  mapName: string;
  width: number;
  height: number;
  tileset: string;
  vibrancy: number;
  category?: string;
  biome?: string;
  layers: {
    ground: Grid;
    ground2: Grid;
    objects: Grid;
    objects_upper: Grid;
    collision: Grid;
  };
}

function csv(g: Grid): string {
  return g.map((row, i) => row.join(',') + (i < g.length - 1 ? ',' : '')).join('\n');
}

function layer(id: number, name: string, w: number, h: number, data: Grid): string {
  return ` <layer id="${id}" name="${name}" width="${w}" height="${h}">
  <data encoding="csv">
${csv(data)}
  </data>
 </layer>`;
}

export function generateTmx(config: MapConfig): string {
  const { name, mapName, width: W, height: H, tileset, vibrancy, category, biome, layers } = config;

  // Try to preserve events from existing TMX
  const tmxDir = resolve('main/server/maps/tmx');
  const tmxPath = resolve(tmxDir, `${name}.tmx`);
  let eventsXml = '';
  try {
    const existing = readFileSync(tmxPath, 'utf8');
    const match = existing.match(/<objectgroup[\s\S]*?<\/objectgroup>/);
    eventsXml = match?.[0] ?? '';
  } catch { /* new map */ }

  const props = [
    category ? `  <property name="category" value="${category}"/>` : '',
    biome ? `  <property name="biome" value="${biome}"/>` : '',
    `  <property name="mapName" value="${mapName}"/>`,
    `  <property name="vibrancy" type="int" value="${vibrancy}"/>`,
  ].filter(Boolean).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.9" tiledversion="1.9.2" orientation="orthogonal" renderorder="right-down" width="${W}" height="${H}" tilewidth="32" tileheight="32" infinite="0" nextlayerid="7" nextobjectid="100">
 <properties>
${props}
 </properties>
 <tileset firstgid="1" source="${tileset}"/>
${layer(1, 'ground', W, H, layers.ground)}
${layer(2, 'ground2', W, H, layers.ground2)}
${layer(3, 'objects', W, H, layers.objects)}
${layer(4, 'objects_upper', W, H, layers.objects_upper)}
${layer(5, 'collision', W, H, layers.collision)}
 ${eventsXml}
</map>`;
}

export function writeMap(config: MapConfig) {
  const tmx = generateTmx(config);
  const outPath = resolve('main/server/maps/tmx', `${config.name}.tmx`);
  writeFileSync(outPath, tmx);
  console.log(`Wrote ${config.name}.tmx (${tmx.length} bytes)`);

  // Stats
  const { layers } = config;
  for (const [name, data] of Object.entries(layers)) {
    const nonZero = (data as Grid).flat().filter(t => t !== 0).length;
    console.log(`  ${name}: ${nonZero} non-zero tiles`);
  }
}

/** Copy collision from objects: trees, walls, hedges = blocked. */
export function collisionFromObjects(obj: Grid, W: number, H: number): Grid {
  const col = grid(W, H);
  for (let r = 0; r < H; r++)
    for (let c = 0; c < W; c++) {
      const t = obj[r][c];
      if (t === T.TREE || t === T.WALL_1 || t === T.WALL_2 ||
          t === T.HEDGE || t === T.FENCE) col[r][c] = 1;
    }
  // Map edges
  for (let c = 0; c < W; c++) { col[0][c] = 1; col[H - 1][c] = 1; }
  for (let r = 0; r < H; r++) { col[r][0] = 1; col[r][W - 1] = 1; }
  return col;
}

/** Copy tree canopy from objects to upper layer. */
export function canopyFromObjects(obj: Grid, W: number, H: number): Grid {
  const up = grid(W, H);
  for (let r = 0; r < H; r++)
    for (let c = 0; c < W; c++)
      if (obj[r][c] === T.TREE) up[r][c] = T.TREE;
  return up;
}
