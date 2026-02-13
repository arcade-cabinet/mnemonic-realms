import { SeededRandom } from '../../generation/seededRandom';

// ── Overworld Tile GIDs (12-col tileset, firstgid=1) ──────────────────
// Row 0 (GID 1-12): grass variants, dirt, trees/bushes, flowers
// Row 1 (GID 13-24): water, more grass, fences, structures
// Row 2 (GID 25-36): path/sand, stone
// Row 3 (GID 37-48): building walls, doors, fences
// Row 4 (GID 49-60): building interiors, roofs
// Row 5+ : more building/decoration tiles

export const OW_TILES = {
  // Ground
  GRASS_1: 1,
  GRASS_2: 2,
  GRASS_3: 3,
  TREE_1: 4,
  TREE_2: 5,
  TREE_3: 6,
  FLOWER_1: 9,
  TREE_SMALL: 11,

  // Water
  WATER: 16,

  // Path / dirt
  PATH: 26,

  // Fence / wall
  FENCE: 40,

  // Building tiles
  ROOF_1: 45,
  WALL_1: 49,
  WALL_2: 50,
  WALL_3: 51,
  DOOR: 52,
  WINDOW_1: 73,
  WINDOW_2: 75,
  WINDOW_3: 76,
  BUILDING_FLOOR: 79,
  BUILDING_EDGE: 80,

  // Special
  SIGN: 93,
  WELL: 95,
  STAIRS_DOWN: 96,
  STALL_1: 107,
  CHEST: 109,
  ANVIL: 111,
  BARREL: 115,
  CAULDRON: 117,
  LAMP: 121,
  CRATE: 123,
} as const;

// ── Dungeon Tile GIDs ──────────────────────────────────────────────────
export const DG_TILES = {
  WALL: 9,
  FLOOR_1: 49,
  FLOOR_2: 50,
  FLOOR_3: 51,
  CORRIDOR: 52,
  CORNER: 29,
  DOOR: 66,
  DOOR_2: 67,
  SPECIAL_1: 55,
  SPECIAL_2: 65,
  TRAP: 73,
  BOSS_FLOOR: 80,
  BARREL: 115,
  CAULDRON: 117,
  CHEST: 42,
} as const;

// ── Biome types for overworld ──────────────────────────────────────────
export type BiomeType = 'grass' | 'forest' | 'water' | 'mountain' | 'desert' | 'village';

interface BiomeTileSet {
  ground: number[];
  obstacle: number[];
  obstacleDensity: number;
  passable: boolean;
}

const BIOME_TILE_MAP: Record<BiomeType, BiomeTileSet> = {
  grass: {
    ground: [
      OW_TILES.GRASS_1,
      OW_TILES.GRASS_1,
      OW_TILES.GRASS_1,
      OW_TILES.GRASS_2,
      OW_TILES.GRASS_3,
    ],
    obstacle: [OW_TILES.FLOWER_1],
    obstacleDensity: 0.05,
    passable: true,
  },
  forest: {
    ground: [OW_TILES.GRASS_1, OW_TILES.GRASS_2],
    obstacle: [OW_TILES.TREE_1, OW_TILES.TREE_2, OW_TILES.TREE_3, OW_TILES.TREE_SMALL],
    obstacleDensity: 0.45,
    passable: false,
  },
  water: {
    ground: [OW_TILES.WATER],
    obstacle: [],
    obstacleDensity: 0,
    passable: false,
  },
  mountain: {
    ground: [OW_TILES.GRASS_3, OW_TILES.GRASS_2],
    obstacle: [OW_TILES.TREE_1, OW_TILES.TREE_2, OW_TILES.TREE_3],
    obstacleDensity: 0.6,
    passable: false,
  },
  desert: {
    ground: [OW_TILES.PATH, OW_TILES.PATH, OW_TILES.GRASS_2],
    obstacle: [OW_TILES.FLOWER_1],
    obstacleDensity: 0.03,
    passable: true,
  },
  village: {
    ground: [OW_TILES.GRASS_1, OW_TILES.GRASS_1, OW_TILES.GRASS_2],
    obstacle: [],
    obstacleDensity: 0,
    passable: true,
  },
};

// ── Overworld Generator ────────────────────────────────────────────────

const OW_WIDTH = 40;
const OW_HEIGHT = 40;
const REGION_SIZE = 5; // Each region = 5x5 tiles, so 8x8 regions in 40x40

/**
 * Generates an 8x8 biome grid from the seed, then maps each region
 * to tile GIDs for the 40x40 overworld. Returns ground + collision arrays.
 */
export function generateOverworldTiles(seed: string): {
  ground: number[];
  collision: number[];
  villageCenter: { x: number; y: number };
  dungeonEntrance: { x: number; y: number };
  pathTiles: Array<{ x: number; y: number }>;
} {
  const rng = new SeededRandom(`${seed}-overworld-terrain`);
  const regionCols = Math.floor(OW_WIDTH / REGION_SIZE);
  const regionRows = Math.floor(OW_HEIGHT / REGION_SIZE);

  // Step 1: Generate biome grid (8x8 regions)
  const biomeGrid: BiomeType[][] = [];
  for (let ry = 0; ry < regionRows; ry++) {
    const row: BiomeType[] = [];
    for (let rx = 0; rx < regionCols; rx++) {
      row.push(pickBiome(rng, rx, ry, regionCols, regionRows));
    }
    biomeGrid.push(row);
  }

  // Step 2: Place village region — always in first quadrant but not edge
  const villageRX = rng.randomInt(1, Math.floor(regionCols / 2) - 1);
  const villageRY = rng.randomInt(1, Math.floor(regionRows / 2) - 1);
  biomeGrid[villageRY][villageRX] = 'village';
  // Clear forest/water around village for accessibility
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const ny = villageRY + dy;
      const nx = villageRX + dx;
      if (ny >= 0 && ny < regionRows && nx >= 0 && nx < regionCols) {
        if (biomeGrid[ny][nx] === 'water' || biomeGrid[ny][nx] === 'mountain') {
          biomeGrid[ny][nx] = 'grass';
        }
      }
    }
  }

  // Step 3: Place dungeon entrance region — opposite quadrant from village
  const dungeonRX = rng.randomInt(Math.floor(regionCols / 2) + 1, regionCols - 2);
  const dungeonRY = rng.randomInt(Math.floor(regionRows / 2) + 1, regionRows - 2);
  // Ensure dungeon region and neighbors are passable
  biomeGrid[dungeonRY][dungeonRX] = 'grass';

  // Step 4: Apply spatial coherence — smooth biomes so they cluster
  smoothBiomes(biomeGrid, rng, regionCols, regionRows);
  // Re-assert village and dungeon after smoothing
  biomeGrid[villageRY][villageRX] = 'village';
  biomeGrid[dungeonRY][dungeonRX] = 'grass';

  // Step 5: Compute tile positions
  const villageCenterX = villageRX * REGION_SIZE + Math.floor(REGION_SIZE / 2);
  const villageCenterY = villageRY * REGION_SIZE + Math.floor(REGION_SIZE / 2);
  const dungeonX = dungeonRX * REGION_SIZE + Math.floor(REGION_SIZE / 2);
  const dungeonY = dungeonRY * REGION_SIZE + Math.floor(REGION_SIZE / 2);

  // Step 6: Generate path from village to dungeon entrance
  const pathTiles = generatePath(villageCenterX, villageCenterY, dungeonX, dungeonY, rng);

  // Step 7: Convert biome grid to tile arrays
  const ground = new Array(OW_WIDTH * OW_HEIGHT).fill(OW_TILES.GRASS_1);
  const collision = new Array(OW_WIDTH * OW_HEIGHT).fill(0);

  // Border walls
  for (let x = 0; x < OW_WIDTH; x++) {
    setTileAt(ground, collision, x, 0, OW_TILES.WATER, true);
    setTileAt(ground, collision, x, OW_HEIGHT - 1, OW_TILES.WATER, true);
  }
  for (let y = 0; y < OW_HEIGHT; y++) {
    setTileAt(ground, collision, 0, y, OW_TILES.WATER, true);
    setTileAt(ground, collision, OW_WIDTH - 1, y, OW_TILES.WATER, true);
  }

  // Fill biome tiles
  const tileRng = new SeededRandom(`${seed}-overworld-tiles`);
  for (let ry = 0; ry < regionRows; ry++) {
    for (let rx = 0; rx < regionCols; rx++) {
      const biome = biomeGrid[ry][rx];
      const tileSet = BIOME_TILE_MAP[biome];

      for (let ly = 0; ly < REGION_SIZE; ly++) {
        for (let lx = 0; lx < REGION_SIZE; lx++) {
          const gx = rx * REGION_SIZE + lx;
          const gy = ry * REGION_SIZE + ly;
          if (gx === 0 || gy === 0 || gx >= OW_WIDTH - 1 || gy >= OW_HEIGHT - 1) continue;

          const groundTile = tileRng.pick(tileSet.ground);

          if (biome === 'water') {
            setTileAt(ground, collision, gx, gy, OW_TILES.WATER, true);
          } else if (tileRng.random() < tileSet.obstacleDensity && tileSet.obstacle.length > 0) {
            // Place obstacle
            const obs = tileRng.pick(tileSet.obstacle);
            setTileAt(ground, collision, gx, gy, obs, !tileSet.passable);
          } else {
            setTileAt(ground, collision, gx, gy, groundTile, false);
          }
        }
      }
    }
  }

  // Lay path tiles (overwrite ground, clear collision)
  for (const pt of pathTiles) {
    if (pt.x > 0 && pt.x < OW_WIDTH - 1 && pt.y > 0 && pt.y < OW_HEIGHT - 1) {
      setTileAt(ground, collision, pt.x, pt.y, OW_TILES.PATH, false);
      // Widen path by 1 tile on each side for walkability
      if (pt.x > 1) clearCollision(ground, collision, pt.x - 1, pt.y);
      if (pt.x < OW_WIDTH - 2) clearCollision(ground, collision, pt.x + 1, pt.y);
      if (pt.y > 1) clearCollision(ground, collision, pt.x, pt.y - 1);
      if (pt.y < OW_HEIGHT - 2) clearCollision(ground, collision, pt.x, pt.y + 1);
    }
  }

  // Build village structures using setTile pattern
  buildVillage(ground, collision, villageCenterX, villageCenterY, tileRng);

  // Place dungeon entrance marker
  setTileAt(ground, collision, dungeonX, dungeonY, OW_TILES.STAIRS_DOWN, false);

  return {
    ground,
    collision,
    villageCenter: { x: villageCenterX, y: villageCenterY },
    dungeonEntrance: { x: dungeonX, y: dungeonY },
    pathTiles,
  };
}

function pickBiome(
  rng: SeededRandom,
  rx: number,
  ry: number,
  cols: number,
  rows: number,
): BiomeType {
  // Edge regions lean toward water/mountain
  const isEdge = rx === 0 || ry === 0 || rx === cols - 1 || ry === rows - 1;
  if (isEdge) {
    return rng.pick(['water', 'water', 'mountain', 'forest', 'grass']);
  }
  return rng.pick(['grass', 'grass', 'grass', 'forest', 'forest', 'desert', 'water', 'mountain']);
}

function smoothBiomes(grid: BiomeType[][], rng: SeededRandom, cols: number, rows: number): void {
  // One pass of cellular automata smoothing
  const copy = grid.map((row) => [...row]);
  for (let ry = 1; ry < rows - 1; ry++) {
    for (let rx = 1; rx < cols - 1; rx++) {
      if (copy[ry][rx] === 'village') continue;
      // Count neighbor biomes
      const counts: Record<string, number> = {};
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const b = copy[ry + dy][rx + dx];
          counts[b] = (counts[b] || 0) + 1;
        }
      }
      // If majority neighbor is different, consider adopting it
      let maxBiome = copy[ry][rx];
      let maxCount = 0;
      for (const [b, c] of Object.entries(counts)) {
        if (c > maxCount) {
          maxCount = c;
          maxBiome = b as BiomeType;
        }
      }
      if (maxCount >= 5 && rng.random() < 0.6) {
        grid[ry][rx] = maxBiome;
      }
    }
  }
}

function generatePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rng: SeededRandom,
): Array<{ x: number; y: number }> {
  const path: Array<{ x: number; y: number }> = [];
  let cx = x1;
  let cy = y1;

  while (cx !== x2 || cy !== y2) {
    path.push({ x: cx, y: cy });
    // Weighted random walk toward target with some meandering
    const dx = x2 - cx;
    const dy = y2 - cy;

    if (rng.random() < 0.7) {
      // Move toward target
      if (Math.abs(dx) > Math.abs(dy) || (Math.abs(dx) === Math.abs(dy) && rng.boolean())) {
        cx += dx > 0 ? 1 : -1;
      } else {
        cy += dy > 0 ? 1 : -1;
      }
    } else {
      // Random perpendicular meander
      if (Math.abs(dx) > Math.abs(dy)) {
        cy += rng.boolean() ? 1 : -1;
      } else {
        cx += rng.boolean() ? 1 : -1;
      }
    }

    // Clamp to bounds
    cx = Math.max(1, Math.min(OW_WIDTH - 2, cx));
    cy = Math.max(1, Math.min(OW_HEIGHT - 2, cy));
  }
  path.push({ x: x2, y: y2 });
  return path;
}

function setTileAt(
  ground: number[],
  collision: number[],
  x: number,
  y: number,
  gid: number,
  collides: boolean,
): void {
  const idx = y * OW_WIDTH + x;
  if (idx >= 0 && idx < ground.length) {
    ground[idx] = gid;
    collision[idx] = collides ? 1 : 0;
  }
}

function clearCollision(ground: number[], collision: number[], x: number, y: number): void {
  const idx = y * OW_WIDTH + x;
  if (idx >= 0 && idx < collision.length) {
    collision[idx] = 0;
    // If ground is a blocking tile like water, replace with grass
    if (ground[idx] === OW_TILES.WATER) {
      ground[idx] = OW_TILES.GRASS_1;
    }
  }
}

function buildVillage(
  ground: number[],
  collision: number[],
  cx: number,
  cy: number,
  rng: SeededRandom,
): void {
  // Clear a 7x7 area around village center
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const gx = cx + dx;
      const gy = cy + dy;
      if (gx > 0 && gx < OW_WIDTH - 1 && gy > 0 && gy < OW_HEIGHT - 1) {
        setTileAt(ground, collision, gx, gy, OW_TILES.GRASS_1, false);
      }
    }
  }

  // Place a small building (3x2) near village center
  const bx = cx - 1;
  const by = cy - 2;
  if (bx > 1 && by > 1 && bx + 2 < OW_WIDTH - 1 && by + 1 < OW_HEIGHT - 1) {
    // Roof row
    setTileAt(ground, collision, bx, by, OW_TILES.ROOF_1, true);
    setTileAt(ground, collision, bx + 1, by, OW_TILES.ROOF_1, true);
    setTileAt(ground, collision, bx + 2, by, OW_TILES.ROOF_1, true);
    // Wall row with door in center
    setTileAt(ground, collision, bx, by + 1, OW_TILES.WALL_1, true);
    setTileAt(ground, collision, bx + 1, by + 1, OW_TILES.DOOR, false);
    setTileAt(ground, collision, bx + 2, by + 1, OW_TILES.WALL_3, true);
  }

  // Place a well or sign
  const wellX = cx + rng.randomInt(1, 2);
  const wellY = cy + rng.randomInt(0, 1);
  if (wellX > 0 && wellX < OW_WIDTH - 1 && wellY > 0 && wellY < OW_HEIGHT - 1) {
    setTileAt(ground, collision, wellX, wellY, OW_TILES.WELL, true);
  }

  // Path within village
  for (let dx = -3; dx <= 3; dx++) {
    const px = cx + dx;
    if (px > 0 && px < OW_WIDTH - 1) {
      setTileAt(ground, collision, px, cy, OW_TILES.PATH, false);
    }
  }
}

// ── Dungeon Generator ──────────────────────────────────────────────────

const DG_WIDTH = 30;
const DG_HEIGHT = 30;

export interface DungeonRoom {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'entrance' | 'combat' | 'treasure' | 'boss' | 'corridor';
}

/**
 * Generates a procedural dungeon layout using BSP-like room placement.
 * Returns tile arrays and room positions for event spawning.
 */
export function generateDungeonTiles(seed: string): {
  ground: number[];
  collision: number[];
  rooms: DungeonRoom[];
  entranceRoom: DungeonRoom;
  bossRoom: DungeonRoom;
} {
  const rng = new SeededRandom(`${seed}-dungeon-layout`);

  // Start with all walls
  const ground = new Array(DG_WIDTH * DG_HEIGHT).fill(DG_TILES.WALL);
  const collision = new Array(DG_WIDTH * DG_HEIGHT).fill(1);

  // Generate rooms
  const rooms: DungeonRoom[] = [];
  const roomCount = rng.randomInt(5, 8);

  // Place rooms using random placement with overlap avoidance
  for (let i = 0; i < roomCount * 3 && rooms.length < roomCount; i++) {
    const w = rng.randomInt(4, 7);
    const h = rng.randomInt(4, 7);
    const x = rng.randomInt(2, DG_WIDTH - w - 2);
    const y = rng.randomInt(2, DG_HEIGHT - h - 2);

    const newRoom: DungeonRoom = { x, y, w, h, type: 'combat' };

    // Check overlap with existing rooms (with 1-tile buffer)
    let overlaps = false;
    for (const existing of rooms) {
      if (
        newRoom.x - 1 < existing.x + existing.w &&
        newRoom.x + newRoom.w + 1 > existing.x &&
        newRoom.y - 1 < existing.y + existing.h &&
        newRoom.y + newRoom.h + 1 > existing.y
      ) {
        overlaps = true;
        break;
      }
    }

    if (!overlaps) {
      rooms.push(newRoom);
    }
  }

  // Ensure at least 3 rooms
  if (rooms.length < 3) {
    // Force-place minimal rooms
    rooms.length = 0;
    rooms.push({ x: 2, y: 2, w: 6, h: 5, type: 'entrance' });
    rooms.push({ x: 14, y: 12, w: 7, h: 6, type: 'combat' });
    rooms.push({ x: 22, y: 22, w: 6, h: 6, type: 'boss' });
  }

  // Assign room types
  // Sort rooms by distance from top-left (entrance near start)
  rooms.sort((a, b) => a.x + a.y - (b.x + b.y));
  rooms[0].type = 'entrance';
  rooms[rooms.length - 1].type = 'boss';

  // Assign remaining rooms
  for (let i = 1; i < rooms.length - 1; i++) {
    rooms[i].type = rng.pick(['combat', 'treasure', 'combat', 'combat']);
  }

  // Carve rooms into tile arrays
  for (const room of rooms) {
    carveRoom(ground, collision, room, rng);
  }

  // Connect rooms with corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    carveCorridor(ground, collision, rooms[i], rooms[i + 1], rng);
  }
  // Extra connection for loop (last to a middle room)
  if (rooms.length > 3) {
    const midIdx = rng.randomInt(1, rooms.length - 2);
    carveCorridor(ground, collision, rooms[rooms.length - 1], rooms[midIdx], rng);
  }

  return {
    ground,
    collision,
    rooms,
    entranceRoom: rooms[0],
    bossRoom: rooms[rooms.length - 1],
  };
}

function setDungeonTile(
  ground: number[],
  collision: number[],
  x: number,
  y: number,
  gid: number,
  collides: boolean,
): void {
  if (x < 0 || x >= DG_WIDTH || y < 0 || y >= DG_HEIGHT) return;
  const idx = y * DG_WIDTH + x;
  ground[idx] = gid;
  collision[idx] = collides ? 1 : 0;
}

function carveRoom(
  ground: number[],
  collision: number[],
  room: DungeonRoom,
  rng: SeededRandom,
): void {
  for (let dy = 0; dy < room.h; dy++) {
    for (let dx = 0; dx < room.w; dx++) {
      const gx = room.x + dx;
      const gy = room.y + dy;
      const isEdge = dx === 0 || dy === 0 || dx === room.w - 1 || dy === room.h - 1;

      if (isEdge) {
        // Room border — use corner tiles at corners, wall otherwise
        const isCorner = (dx === 0 || dx === room.w - 1) && (dy === 0 || dy === room.h - 1);
        setDungeonTile(ground, collision, gx, gy, isCorner ? DG_TILES.CORNER : DG_TILES.WALL, true);
      } else {
        // Floor — varied tiles
        const floorTile = rng.pick([
          DG_TILES.FLOOR_1,
          DG_TILES.FLOOR_1,
          DG_TILES.FLOOR_2,
          DG_TILES.FLOOR_3,
        ]);
        setDungeonTile(ground, collision, gx, gy, floorTile, false);
      }
    }
  }

  // Add decoration to boss room
  if (room.type === 'boss') {
    const midX = room.x + Math.floor(room.w / 2);
    const midY = room.y + Math.floor(room.h / 2);
    // Boss floor tiles in center
    for (let dy = -1; dy <= 0; dy++) {
      for (let dx = -1; dx <= 0; dx++) {
        setDungeonTile(ground, collision, midX + dx, midY + dy, DG_TILES.BOSS_FLOOR, false);
      }
    }
  }

  // Add decoration to treasure rooms
  if (room.type === 'treasure') {
    const ix = room.x + Math.floor(room.w / 2);
    const iy = room.y + 1;
    setDungeonTile(ground, collision, ix, iy, DG_TILES.SPECIAL_1, false);
  }
}

function carveCorridor(
  ground: number[],
  collision: number[],
  roomA: DungeonRoom,
  roomB: DungeonRoom,
  rng: SeededRandom,
): void {
  // L-shaped corridor from center of A to center of B
  let cx = roomA.x + Math.floor(roomA.w / 2);
  let cy = roomA.y + Math.floor(roomA.h / 2);
  const tx = roomB.x + Math.floor(roomB.w / 2);
  const ty = roomB.y + Math.floor(roomB.h / 2);

  // Randomly choose horizontal-first or vertical-first
  const horizFirst = rng.boolean();

  if (horizFirst) {
    // Horizontal then vertical
    while (cx !== tx) {
      setDungeonTile(ground, collision, cx, cy, DG_TILES.CORRIDOR, false);
      // Widen corridor to 2 tiles
      if (cy + 1 < DG_HEIGHT) {
        setDungeonTile(ground, collision, cx, cy + 1, DG_TILES.CORRIDOR, false);
      }
      cx += cx < tx ? 1 : -1;
    }
    while (cy !== ty) {
      setDungeonTile(ground, collision, cx, cy, DG_TILES.CORRIDOR, false);
      if (cx + 1 < DG_WIDTH) {
        setDungeonTile(ground, collision, cx + 1, cy, DG_TILES.CORRIDOR, false);
      }
      cy += cy < ty ? 1 : -1;
    }
  } else {
    // Vertical then horizontal
    while (cy !== ty) {
      setDungeonTile(ground, collision, cx, cy, DG_TILES.CORRIDOR, false);
      if (cx + 1 < DG_WIDTH) {
        setDungeonTile(ground, collision, cx + 1, cy, DG_TILES.CORRIDOR, false);
      }
      cy += cy < ty ? 1 : -1;
    }
    while (cx !== tx) {
      setDungeonTile(ground, collision, cx, cy, DG_TILES.CORRIDOR, false);
      if (cy + 1 < DG_HEIGHT) {
        setDungeonTile(ground, collision, cx, cy + 1, DG_TILES.CORRIDOR, false);
      }
      cx += cx < tx ? 1 : -1;
    }
  }

  // Place door tiles at corridor entry/exit points
  setDungeonTile(
    ground,
    collision,
    roomA.x + Math.floor(roomA.w / 2),
    roomA.y + Math.floor(roomA.h / 2),
    DG_TILES.DOOR,
    false,
  );
}

// ── TMX builder helper ─────────────────────────────────────────────────
/**
 * Converts flat tile arrays into TMX XML string.
 * Used with map.update() to replace the entire map.
 */
export function buildTmxString(
  width: number,
  height: number,
  tilesetSource: string,
  groundTiles: number[],
  collisionTiles: number[],
  startX: number,
  startY: number,
): string {
  const groundCsv = tilesToCsv(groundTiles, width);
  const collisionCsv = tilesToCsv(collisionTiles, width);

  return `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.10" tiledversion="1.10.2" orientation="orthogonal" renderorder="right-down"
     width="${width}" height="${height}" tilewidth="32" tileheight="32" infinite="0">
  <tileset firstgid="1" source="${tilesetSource}"/>
    <layer id="1" name="ground" width="${width}" height="${height}">
    <data encoding="csv">
${groundCsv}
    </data>
  </layer>
  <layer id="2" name="collision" width="${width}" height="${height}">
    <data encoding="csv">
${collisionCsv}
    </data>
  </layer>
  <objectgroup id="3" name="objects">
    <object id="1" name="start" type="start" x="${startX * 32}" y="${startY * 32}" width="32" height="32"/>
  </objectgroup>
</map>`;
}

function tilesToCsv(tiles: number[], width: number): string {
  const rows: string[] = [];
  for (let y = 0; y < tiles.length / width; y++) {
    const row = tiles.slice(y * width, (y + 1) * width);
    rows.push(row.join(','));
  }
  return rows.join(',\n');
}
