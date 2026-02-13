/**
 * TMX Map Generator for Mnemonic Realms
 *
 * Generates Tiled-format TMX maps using the upscaled Kenney tilesets.
 * Run after process-assets.ts has created the tileset PNGs.
 *
 * Usage: pnpm run maps
 */

import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const TMX_DIR = resolve(import.meta.dirname, '..', 'main/server/maps/tmx');

// ─── Tiny Town Tile IDs (1-based, 12-col grid) ──────────────────────────────

const TT = {
  // Terrain
  grass: 1,
  grassDetail: 2,
  grassEdge: 3,
  // Dirt terrain (auto-tile edges)
  dirtTL: 13, dirtT: 14, dirtTR: 15,
  dirtL: 25, dirt: 26, dirtR: 27,
  dirtBL: 37, dirtB: 38, dirtBR: 39,
  dirtFull: 40, dirtAlt: 41, dirtCorner: 42,
  // Trees
  treePine: 4, treeOak: 5, treeBush: 6,
  treeTopL: 7, treeTopR: 8, treeBotL: 19, treeBotR: 20,
  treePineSmall: 9, treePineGroup: 10, treeAutumn: 11, treeAutumnGroup: 12,
  treeStump: 28, mushroom: 30,
  // Water (using dark grass/edge tiles)
  waterTL: 16, waterT: 17, waterTR: 18,
  // Buildings
  roofStoneTL: 49, roofStoneT: 50, roofStoneTR: 51,
  roofStoneML: 61, roofStoneM: 62, roofStoneMR: 63,
  roofRedTL: 53, roofRedT: 54, roofRedTR: 55,
  roofRedML: 65, roofRedM: 66, roofRedMR: 67,
  roofPeak: 64, roofRedPeak: 68,
  wallWoodL: 73, wallWoodM: 74, wallWoodR: 75,
  wallStoneL: 85, wallStoneM: 86, wallStoneR: 87,
  door: 76, window: 88,
  // Stone/Castle
  stoneTL: 109, stoneT: 110, stoneTR: 111,
  stoneBL: 121, stoneB: 122, stoneBR: 123,
  // Fences and paths
  fenceH: 45, fenceV: 48, fencePost: 46,
  signpost: 93, pathStone: 79, pathStone2: 80,
  // Items
  pot: 95, barrel: 107, chest: 94,
  lamp: 96, lantern: 108,
};

// ─── Tiny Dungeon Tile IDs ───────────────────────────────────────────────────

const TD = {
  // Dark cave walls
  darkTL: 1, darkT: 2, darkTR: 3, darkEdge: 4,
  darkML: 13, darkM: 14, darkMR: 15,
  darkBL: 25, darkB: 26, darkBR: 27,
  // Stone walls
  wallTL: 5, wallT: 6, wallTR: 7,
  wallML: 8, wallSolid: 9, wallMR: 10, wallFace: 11, wallFace2: 12,
  wallBL: 17, wallB: 18, wallBR: 19,
  // Brick walls
  brickTL: 57, brickT: 58, brickTR: 59, brickSolid: 60,
  // Stone floor variants
  floor: 49, floorAlt: 50, floorDetail: 51,
  floorDark: 52, floorCircle: 53, floorTrap: 54,
  // Tan/dirt floor
  dirtFloor: 31, dirtFloorAlt: 32,
  // Features
  torch: 29, torchWall: 30,
  doorClosed: 66, doorOpen: 67,
  chest: 55, chestOpen: 56,
  barrel: 65, crate: 73, crateSmall: 74,
  // Furniture
  tableLong: 68, tableShort: 69,
  fenceDungeon: 70, fenceGate: 71, fencePost: 72,
  // Decorative
  bossFloor: 80, // ornate circular floor
  stairs: 42, ladder: 43,
  // Potions
  potionBlue: 115, potionGreen: 116, potionRed: 117,
};

// ─── Map Generation Helpers ──────────────────────────────────────────────────

type TileGrid = number[][];

function createGrid(w: number, h: number, fill: number): TileGrid {
  return Array.from({ length: h }, () => Array(w).fill(fill));
}

function fillRect(grid: TileGrid, x: number, y: number, w: number, h: number, tile: number) {
  for (let row = y; row < Math.min(y + h, grid.length); row++) {
    for (let col = x; col < Math.min(x + w, grid[0].length); col++) {
      grid[row][col] = tile;
    }
  }
}

function drawRect(grid: TileGrid, x: number, y: number, w: number, h: number, tile: number) {
  for (let col = x; col < x + w; col++) {
    grid[y][col] = tile;
    grid[y + h - 1][col] = tile;
  }
  for (let row = y; row < y + h; row++) {
    grid[row][x] = tile;
    grid[row][x + w - 1] = tile;
  }
}

function setTile(grid: TileGrid, x: number, y: number, tile: number) {
  if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
    grid[y][x] = tile;
  }
}

function gridToCSV(grid: TileGrid): string {
  return grid.map((row) => row.join(',')).join(',\n');
}

function generateTMX(
  width: number,
  height: number,
  tilesetName: string,
  tilesetImage: string,
  tileCount: number,
  layers: { name: string; data: TileGrid }[],
  startX: number,
  startY: number,
): string {
  const layerXml = layers
    .map(
      (layer) => `  <layer id="${layers.indexOf(layer) + 1}" name="${layer.name}" width="${width}" height="${height}">
    <data encoding="csv">
${gridToCSV(layer.data)}
    </data>
  </layer>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.10" tiledversion="1.10.2" orientation="orthogonal" renderorder="right-down"
     width="${width}" height="${height}" tilewidth="32" tileheight="32" infinite="0">
  <tileset firstgid="1" name="${tilesetName}" tilewidth="32" tileheight="32" tilecount="${tileCount}" columns="12">
    <image source="${tilesetImage}" width="384" height="352"/>
  </tileset>
  ${layerXml}
  <objectgroup id="${layers.length + 1}" name="objects">
    <object id="1" name="start" type="start" x="${startX * 32}" y="${startY * 32}" width="32" height="32"/>
  </objectgroup>
</map>`;
}

// ─── Overworld Map ───────────────────────────────────────────────────────────

function generateOverworld(): string {
  const W = 40;
  const H = 40;

  // Ground layer — base grass everywhere
  const ground = createGrid(W, H, TT.grass);

  // Scatter grass detail
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (Math.random() < 0.15) ground[y][x] = TT.grassDetail;
    }
  }

  // ── Dirt paths ──
  // Main horizontal road (y=18-19)
  fillRect(ground, 0, 18, W, 2, TT.dirt);
  // Vertical road from village to south (x=15-16)
  fillRect(ground, 15, 8, 2, H - 8, TT.dirt);
  // Path to dungeon entrance (diagonal-ish to bottom-right)
  for (let i = 0; i < 12; i++) {
    fillRect(ground, 17 + i * 2, 20 + i, 2, 2, TT.dirt);
    if (i < 11) fillRect(ground, 18 + i * 2, 21 + i, 2, 1, TT.dirt);
  }

  // ── Village area (x:8-22, y:10-17) ──
  // Village square
  fillRect(ground, 10, 12, 8, 4, TT.dirtFull);
  fillRect(ground, 11, 13, 6, 2, TT.pathStone);

  // Buildings — 3 houses
  // House 1 (inn)
  for (const [bx, by] of [[9, 10], [14, 10], [19, 10]] as [number, number][]) {
    setTile(ground, bx, by, TT.roofStoneTL);
    setTile(ground, bx + 1, by, TT.roofStoneT);
    setTile(ground, bx + 2, by, TT.roofStoneTR);
    setTile(ground, bx, by + 1, TT.wallWoodL);
    setTile(ground, bx + 1, by + 1, TT.door);
    setTile(ground, bx + 2, by + 1, TT.wallWoodR);
  }

  // Fences around village
  for (let x = 8; x <= 22; x++) {
    setTile(ground, x, 9, TT.fenceH);
    setTile(ground, x, 17, TT.fenceH);
  }

  // Items in village
  setTile(ground, 12, 15, TT.pot);
  setTile(ground, 13, 15, TT.barrel);
  setTile(ground, 17, 15, TT.signpost);
  setTile(ground, 18, 12, TT.lamp);

  // ── Water (river, y:5-7 across top) ──
  fillRect(ground, 0, 4, W, 3, TT.waterTL); // Using dark tile for water
  // Bridge over river
  fillRect(ground, 14, 4, 4, 3, TT.pathStone);
  fillRect(ground, 15, 4, 2, 3, TT.pathStone2);

  // ── Forests ──
  // Western forest
  for (let y = 8; y < 30; y += 2) {
    for (let x = 0; x < 7; x += 2) {
      if (Math.random() < 0.7) {
        const tree = Math.random() < 0.5 ? TT.treePine : TT.treeOak;
        setTile(ground, x, y, tree);
        if (Math.random() < 0.4) setTile(ground, x + 1, y, TT.treeBush);
      }
    }
  }

  // Eastern forest
  for (let y = 8; y < 20; y += 2) {
    for (let x = 30; x < W; x += 2) {
      if (Math.random() < 0.6) {
        const tree = Math.random() < 0.6 ? TT.treeAutumn : TT.treePine;
        setTile(ground, x, y, tree);
      }
    }
  }

  // Southern forest (near dungeon)
  for (let y = 28; y < 38; y += 2) {
    for (let x = 25; x < 38; x += 2) {
      if (Math.random() < 0.5 && !(x >= 34 && x <= 37 && y >= 32 && y <= 35)) {
        setTile(ground, x, y, TT.treePine);
      }
    }
  }

  // Scattered trees
  for (let i = 0; i < 20; i++) {
    const x = Math.floor(Math.random() * (W - 4)) + 2;
    const y = Math.floor(Math.random() * (H - 10)) + 8;
    if (ground[y][x] === TT.grass || ground[y][x] === TT.grassDetail) {
      setTile(ground, x, y, TT.treePineSmall);
    }
  }

  // Dungeon entrance area (stone platform)
  fillRect(ground, 34, 33, 4, 4, TT.pathStone);
  setTile(ground, 35, 34, TT.stoneTL);
  setTile(ground, 36, 34, TT.stoneTR);
  setTile(ground, 35, 35, TT.stoneBL);
  setTile(ground, 36, 35, TT.stoneBR);

  // ── Collision layer ──
  const collision = createGrid(W, H, 0);

  // Water is impassable
  fillRect(collision, 0, 4, W, 3, 1);
  // Bridge is passable
  fillRect(collision, 14, 4, 4, 3, 0);

  // Trees block movement
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = ground[y][x];
      if (
        t === TT.treePine || t === TT.treeOak || t === TT.treeBush ||
        t === TT.treeAutumn || t === TT.treeAutumnGroup || t === TT.treePineGroup
      ) {
        collision[y][x] = 1;
      }
      // Buildings block
      if (
        t === TT.roofStoneTL || t === TT.roofStoneT || t === TT.roofStoneTR ||
        t === TT.wallWoodL || t === TT.wallWoodR ||
        t === TT.roofRedTL || t === TT.roofRedT || t === TT.roofRedTR
      ) {
        collision[y][x] = 1;
      }
      // Fences block
      if (t === TT.fenceH || t === TT.fenceV) {
        collision[y][x] = 1;
      }
    }
  }

  // Map borders
  for (let x = 0; x < W; x++) { collision[0][x] = 1; collision[H - 1][x] = 1; }
  for (let y = 0; y < H; y++) { collision[y][0] = 1; collision[y][W - 1] = 1; }

  // Use a dummy tileset ID for collision (tile 1 = blocked)
  // RPG-JS uses the collision layer name to detect blocked tiles

  return generateTMX(W, H, 'overworld', 'overworld-tiles.png', 132,
    [
      { name: 'ground', data: ground },
      { name: 'collision', data: collision },
    ],
    15, 15,
  );
}

// ─── Dungeon Map ─────────────────────────────────────────────────────────────

function generateDungeon(): string {
  const W = 30;
  const H = 30;

  // Fill with solid walls
  const ground = createGrid(W, H, TD.wallSolid);

  // Define rooms as [x, y, w, h]
  const rooms: [number, number, number, number][] = [
    [2, 2, 6, 5],    // Entrance room (top-left)
    [12, 2, 6, 5],   // Side room (treasure)
    [2, 12, 6, 5],   // Mid-left room
    [14, 10, 8, 6],  // Central hall (large)
    [24, 2, 4, 5],   // Top-right room
    [2, 22, 6, 6],   // Bottom-left room
    [12, 20, 6, 5],  // Pre-boss room
    [22, 22, 6, 6],  // Boss room
  ];

  // Carve rooms with stone floor
  for (const [rx, ry, rw, rh] of rooms) {
    fillRect(ground, rx, ry, rw, rh, TD.floor);
    // Add some floor detail
    for (let y = ry; y < ry + rh; y++) {
      for (let x = rx; x < rx + rw; x++) {
        if (Math.random() < 0.1) ground[y][x] = TD.floorAlt;
        if (Math.random() < 0.05) ground[y][x] = TD.floorDetail;
      }
    }
  }

  // Boss room gets special floor
  fillRect(ground, 24, 24, 2, 2, TD.bossFloor);

  // Corridors (2 tiles wide for movement)
  function corridor(x1: number, y1: number, x2: number, y2: number) {
    if (x1 === x2) {
      // Vertical
      const [minY, maxY] = y1 < y2 ? [y1, y2] : [y2, y1];
      fillRect(ground, x1, minY, 2, maxY - minY + 1, TD.floorDark);
    } else {
      // Horizontal
      const [minX, maxX] = x1 < x2 ? [x1, x2] : [x2, x1];
      fillRect(ground, minX, y1, maxX - minX + 1, 2, TD.floorDark);
    }
  }

  // Connect rooms
  corridor(7, 4, 12, 4);     // Entrance → Side room
  corridor(4, 7, 4, 12);     // Entrance → Mid-left
  corridor(7, 14, 14, 14);   // Mid-left → Central hall
  corridor(17, 7, 17, 10);   // Side → Central hall area
  corridor(21, 4, 24, 4);    // Side → Top-right
  corridor(4, 17, 4, 22);    // Mid-left → Bottom-left
  corridor(7, 24, 12, 24);   // Bottom-left → Pre-boss
  corridor(17, 22, 22, 22);  // Pre-boss → Boss room
  corridor(14, 16, 14, 20);  // Central → Pre-boss

  // Add torches along corridors and in rooms
  for (const [rx, ry, rw, rh] of rooms) {
    setTile(ground, rx, ry, TD.torch);
    setTile(ground, rx + rw - 1, ry, TD.torch);
  }

  // Doors between rooms and corridors
  setTile(ground, 8, 4, TD.doorOpen);
  setTile(ground, 4, 7, TD.doorClosed);
  setTile(ground, 14, 14, TD.doorOpen);
  setTile(ground, 14, 20, TD.doorClosed);
  setTile(ground, 22, 22, TD.doorClosed);

  // Chests in treasure room
  setTile(ground, 13, 3, TD.chest);
  setTile(ground, 16, 3, TD.chest);
  // Barrel and crates in mid-left
  setTile(ground, 3, 13, TD.barrel);
  setTile(ground, 6, 15, TD.crate);
  // Potions scattered
  setTile(ground, 3, 23, TD.potionRed);
  setTile(ground, 5, 26, TD.potionBlue);

  // Stairs/exit in entrance room
  setTile(ground, 3, 3, TD.stairs);

  // Collision layer
  const collision = createGrid(W, H, 0);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = ground[y][x];
      // Walls block movement
      if (
        t === TD.wallSolid || t === TD.wallTL || t === TD.wallT || t === TD.wallTR ||
        t === TD.wallML || t === TD.wallMR || t === TD.wallBL || t === TD.wallB || t === TD.wallBR ||
        t === TD.wallFace || t === TD.wallFace2 ||
        t === TD.darkTL || t === TD.darkT || t === TD.darkTR || t === TD.darkM ||
        t === TD.darkML || t === TD.darkMR || t === TD.darkBL || t === TD.darkB || t === TD.darkBR ||
        t === TD.brickSolid || t === TD.brickTL || t === TD.brickT || t === TD.brickTR
      ) {
        collision[y][x] = 1;
      }
      // Closed doors block (they get opened by events)
      if (t === TD.doorClosed) {
        collision[y][x] = 1;
      }
    }
  }

  return generateTMX(W, H, 'dungeon', 'dungeon-tiles.png', 132,
    [
      { name: 'ground', data: ground },
      { name: 'collision', data: collision },
    ],
    4, 4,
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

// Use a fixed seed for deterministic output
Math.random = (() => {
  let s = 42;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
})();

const overworldTmx = generateOverworld();
writeFileSync(join(TMX_DIR, 'overworld.tmx'), overworldTmx);
console.log('✓ overworld.tmx (40×40)');

const dungeonTmx = generateDungeon();
writeFileSync(join(TMX_DIR, 'dungeon.tmx'), dungeonTmx);
console.log('✓ dungeon.tmx (30×30)');

console.log('\nDone! Maps reference upscaled 32×32 tilesets.');
