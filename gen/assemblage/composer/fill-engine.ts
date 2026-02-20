/**
 * Fill Engine — Simple Fill for Empty Space
 *
 * After the composer places features and routes paths, the fill engine
 * populates ALL remaining empty space with biome-appropriate content:
 * 1. Base terrain — fill ALL empty tiles with the biome's designated fill tile
 * 2. Scatter objects (trees, bushes, rocks, flowers) respecting clearance zones
 * 3. Edge treatment (forest border, cliffs, water edges)
 *
 * No noise. No ground variants. Just the fill tile. Simple.
 *
 * Architecture level: FILL (post-composition)
 */
import type { BiomeDefinition, ScatterRule } from './biomes';
import type { CollisionGrid, Point } from './path-router';

// --- Seeded RNG (LCG) ---

export class SeededRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  /** Returns a float in [0, 1) */
  next(): number {
    this.state = (this.state * 1664525 + 1013904223) & 0xffffffff;
    return (this.state >>> 0) / 0x100000000;
  }

  /** Returns an integer in [min, max] inclusive */
  nextInt(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Returns true with the given probability [0, 1] */
  chance(probability: number): boolean {
    return this.next() < probability;
  }
}

// --- Fill output types ---

export interface FillResult {
  /** Ground terrain per tile (semantic names) */
  groundTerrain: (string | null)[];
  /** Scatter objects placed in empty space */
  scatterObjects: ScatterPlacement[];
  /** Edge tiles (forest border, cliffs, etc.) */
  edgeTiles: EdgePlacement[];
}

export interface ScatterPlacement {
  /** Object reference from biome scatter rules */
  objectRef: string;
  /** Position in tiles */
  x: number;
  y: number;
}

export interface EdgePlacement {
  /** What type of edge */
  type: string;
  /** Position in tiles */
  x: number;
  y: number;
}

// --- Fill Engine ---

export interface FillEngineConfig {
  mapWidth: number;
  mapHeight: number;
  biome: BiomeDefinition;
  collisionGrid: CollisionGrid;
  seed: number;
  /** Tiles that have connections (don't place edge here) */
  connectionTiles?: Point[];
}

/**
 * Run the fill engine across the entire map.
 *
 * 1. Fill ALL empty tiles with the biome's designated fill tile. That's it.
 * 2. Scatter objects in empty space with exclusion radius
 * 3. Apply edge treatment to map borders
 */
export function runFillEngine(config: FillEngineConfig): FillResult {
  const { mapWidth, mapHeight, biome, collisionGrid, seed } = config;
  const rng = new SeededRNG(seed);
  const totalTiles = mapWidth * mapHeight;

  // --- 1. Ground terrain: just the fill tile ---
  const groundTerrain: (string | null)[] = new Array(totalTiles).fill(null);

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const idx = y * mapWidth + x;
      const cell = collisionGrid.data[idx];
      // Fill empty tiles and clearance zones with the biome's fill tile
      if (cell === 0 || cell === 3) {
        groundTerrain[idx] = biome.baseGround;
      }
    }
  }

  // --- 2. Scatter objects ---
  const scatterObjects = generateScatter(mapWidth, mapHeight, biome.scatter, rng, collisionGrid);

  // --- 3. Edge treatment ---
  const edgeTiles = generateEdges(mapWidth, mapHeight, biome, config.connectionTiles || []);

  return { groundTerrain, scatterObjects, edgeTiles };
}

/**
 * Generate scatter objects in empty space.
 *
 * Uses Poisson-disk-like sampling: place objects randomly but enforce
 * minimum distance between them (exclusion radius).
 */
function generateScatter(
  width: number,
  height: number,
  rules: ScatterRule[],
  rng: SeededRNG,
  grid: CollisionGrid,
): ScatterPlacement[] {
  const placements: ScatterPlacement[] = [];

  // Track occupied positions for exclusion radius
  const occupied = new Map<number, number>(); // key → exclusionRadius

  for (const rule of rules) {
    // Calculate expected count based on map area
    const area = width * height;
    const expectedCount = Math.round((rule.frequency * area) / 100);

    let placed = 0;
    let attempts = 0;
    const maxAttempts = expectedCount * 10; // Give up after too many attempts

    while (placed < expectedCount && attempts < maxAttempts) {
      attempts++;

      // Random position
      let x = rng.nextInt(1, width - 2);
      let y = rng.nextInt(1, height - 2);

      // Edge bias
      if (rule.preferEdges && rng.chance(0.6)) {
        const side = rng.nextInt(0, 3);
        if (side === 0) y = rng.nextInt(0, Math.floor(height * 0.15));
        else if (side === 1) y = rng.nextInt(Math.floor(height * 0.85), height - 1);
        else if (side === 2) x = rng.nextInt(0, Math.floor(width * 0.15));
        else x = rng.nextInt(Math.floor(width * 0.85), width - 1);
      }

      // Check collision grid: only place on empty ground (0)
      const idx = y * width + x;
      if (grid.data[idx] !== 0) continue;

      // Check exclusion radius against existing placements
      const key = y * width + x;
      let tooClose = false;
      for (const [otherKey, otherRadius] of Array.from(occupied.entries())) {
        const ox = otherKey % width;
        const oy = Math.floor(otherKey / width);
        const dist = Math.abs(x - ox) + Math.abs(y - oy); // Manhattan
        if (dist < Math.max(rule.exclusionRadius, otherRadius)) {
          tooClose = true;
          break;
        }
      }
      if (tooClose) continue;

      placements.push({ objectRef: rule.objectRef, x, y });
      occupied.set(key, rule.exclusionRadius);
      placed++;
    }
  }

  return placements;
}

/**
 * Generate edge treatment tiles for map borders.
 */
function generateEdges(
  width: number,
  height: number,
  biome: BiomeDefinition,
  connectionTiles: Point[],
): EdgePlacement[] {
  const edge = biome.defaultEdge;
  if (edge.type === 'none') return [];

  const placements: EdgePlacement[] = [];
  const connectionSet = new Set(connectionTiles.map((p) => `${p.x},${p.y}`));

  for (let depth = 0; depth < edge.depth; depth++) {
    // Top edge
    for (let x = 0; x < width; x++) {
      if (edge.gapForConnections && connectionSet.has(`${x},${depth}`)) continue;
      placements.push({ type: edge.type, x, y: depth });
    }
    // Bottom edge
    for (let x = 0; x < width; x++) {
      const y = height - 1 - depth;
      if (edge.gapForConnections && connectionSet.has(`${x},${y}`)) continue;
      placements.push({ type: edge.type, x, y });
    }
    // Left edge
    for (let y = edge.depth; y < height - edge.depth; y++) {
      if (edge.gapForConnections && connectionSet.has(`${depth},${y}`)) continue;
      placements.push({ type: edge.type, x: depth, y });
    }
    // Right edge
    for (let y = edge.depth; y < height - edge.depth; y++) {
      const x = width - 1 - depth;
      if (edge.gapForConnections && connectionSet.has(`${x},${y}`)) continue;
      placements.push({ type: edge.type, x, y });
    }
  }

  return placements;
}
