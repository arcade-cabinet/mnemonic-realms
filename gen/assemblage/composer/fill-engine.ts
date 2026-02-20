/**
 * Fill Engine — Biome-Aware Fill for Empty Space
 *
 * After the composer places features and routes paths, the fill engine
 * populates ALL remaining empty space with biome-appropriate content:
 * 1. Base terrain — fill ALL empty tiles with the biome's designated fill tile
 * 2. Ground variant clusters — paint patches of variant terrain over base ground
 * 3. Scatter objects (trees, bushes, rocks, flowers) on walkable tiles
 * 4. Path dressing — objects alongside, at junctions, and at endpoints of roads
 * 5. Edge treatment (forest border, cliffs, water edges)
 *
 * Architecture level: FILL (post-composition)
 */
import type { BiomeDefinition, GroundVariant, PathDressRule, ScatterRule } from './biomes';
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
  /** Objects placed alongside, at junctions, and at endpoints of roads */
  pathDressObjects: ScatterPlacement[];
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
 * 1. Fill ALL empty tiles with the biome's designated base ground tile
 * 2. Paint ground variant clusters over the base ground
 * 3. Scatter objects on walkable tiles (empty + clearance zones)
 * 4. Place path dressing objects along roads
 * 5. Apply edge treatment to map borders
 */
export function runFillEngine(config: FillEngineConfig): FillResult {
  const { mapWidth, mapHeight, biome, collisionGrid, seed } = config;
  const rng = new SeededRNG(seed);
  const totalTiles = mapWidth * mapHeight;

  // --- 1. Ground terrain: base fill ---
  const groundTerrain: (string | null)[] = new Array(totalTiles).fill(null);

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const idx = y * mapWidth + x;
      const cell = collisionGrid.data[idx];
      if (cell === 0 || cell === 3) {
        groundTerrain[idx] = biome.baseGround;
      }
    }
  }

  // --- 2. Ground variant clusters ---
  paintGroundVariants(mapWidth, mapHeight, biome.baseGround, biome.groundVariants, groundTerrain, rng);

  // --- 3. Scatter objects ---
  const scatterObjects = generateScatter(mapWidth, mapHeight, biome.scatter, rng, collisionGrid);

  // --- 4. Path dressing ---
  const pathDressObjects = generatePathDressing(mapWidth, mapHeight, biome.pathDress, collisionGrid, rng);

  // --- 5. Edge treatment ---
  const edgeTiles = generateEdges(mapWidth, mapHeight, biome, config.connectionTiles || []);

  return { groundTerrain, scatterObjects, pathDressObjects, edgeTiles };
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

      // Check collision grid: place on empty ground (0) and clearance zones (3)
      const idx = y * width + x;
      const cell = grid.data[idx];
      if (cell !== 0 && cell !== 3) continue;

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
 * Paint ground variant clusters over the base ground.
 *
 * For each variant, determines how many clusters to place based on
 * frequency * eligible area / average cluster size. Each cluster starts
 * at a random base-ground tile and flood-fills outward up to clusterSize
 * tiles, only painting over tiles that still hold the base ground.
 */
function paintGroundVariants(
  width: number,
  height: number,
  baseGround: string,
  variants: GroundVariant[],
  groundTerrain: (string | null)[],
  rng: SeededRNG,
): void {
  // Count how many tiles are base ground (eligible for variant painting)
  let eligibleCount = 0;
  for (let i = 0; i < width * height; i++) {
    if (groundTerrain[i] === baseGround) eligibleCount++;
  }

  for (const variant of variants) {
    const avgCluster = (variant.clusterSize[0] + variant.clusterSize[1]) / 2;
    const clusterCount = Math.round((variant.frequency * eligibleCount) / avgCluster);

    for (let c = 0; c < clusterCount; c++) {
      // Pick a random center that is currently base ground
      let cx = -1;
      let cy = -1;
      let attempts = 0;
      while (attempts < 50) {
        const tx = rng.nextInt(0, width - 1);
        const ty = rng.nextInt(0, height - 1);
        if (groundTerrain[ty * width + tx] === baseGround) {
          cx = tx;
          cy = ty;
          break;
        }
        attempts++;
      }
      if (cx === -1) continue;

      // Determine cluster size
      const targetSize = rng.nextInt(variant.clusterSize[0], variant.clusterSize[1]);

      // Flood-fill outward from center
      const painted = new Set<number>();
      const frontier: Array<{ x: number; y: number }> = [{ x: cx, y: cy }];

      while (painted.size < targetSize && frontier.length > 0) {
        // Pick a random frontier tile (organic shape, not BFS-uniform)
        const fi = rng.nextInt(0, frontier.length - 1);
        const tile = frontier[fi];
        frontier[fi] = frontier[frontier.length - 1];
        frontier.pop();

        const idx = tile.y * width + tile.x;
        if (painted.has(idx)) continue;
        if (groundTerrain[idx] !== baseGround) continue;

        // Paint it
        groundTerrain[idx] = variant.terrain;
        painted.add(idx);

        // Add neighbors to frontier
        const dirs = [
          { x: tile.x - 1, y: tile.y },
          { x: tile.x + 1, y: tile.y },
          { x: tile.x, y: tile.y - 1 },
          { x: tile.x, y: tile.y + 1 },
        ];
        for (const d of dirs) {
          if (d.x < 0 || d.x >= width || d.y < 0 || d.y >= height) continue;
          const ni = d.y * width + d.x;
          if (painted.has(ni)) continue;
          if (groundTerrain[ni] !== baseGround) continue;
          frontier.push(d);
        }
      }
    }
  }
}

/**
 * Place dressing objects along routed paths (roads).
 *
 * Reads road tiles (cell === 2) from the collision grid and the biome's
 * pathDress rules:
 *   - 'alongside': Every `spacing` road tiles, place the object 1-2 tiles
 *     perpendicular to the road direction.
 *   - 'at-junctions': Where 3+ road neighbors meet, place the object.
 *   - 'at-ends': At road endpoints (exactly 1 road neighbor), place the object.
 */
function generatePathDressing(
  width: number,
  height: number,
  rules: PathDressRule[],
  grid: CollisionGrid,
  rng: SeededRNG,
): ScatterPlacement[] {
  if (rules.length === 0) return [];

  const placements: ScatterPlacement[] = [];
  const occupied = new Set<number>();

  // Precompute road tile positions and their neighbor counts
  const roadTiles: Array<{ x: number; y: number; idx: number }> = [];
  const neighborCount = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (grid.data[idx] !== 2) continue;
      roadTiles.push({ x, y, idx });

      // Count orthogonal road neighbors
      let count = 0;
      if (x > 0 && grid.data[idx - 1] === 2) count++;
      if (x < width - 1 && grid.data[idx + 1] === 2) count++;
      if (y > 0 && grid.data[idx - width] === 2) count++;
      if (y < height - 1 && grid.data[idx + width] === 2) count++;
      neighborCount[idx] = count;
    }
  }

  for (const rule of rules) {
    if (rule.placement === 'alongside') {
      // Walk road tiles in order. Every `spacing` tiles, try to place
      // the object 1-2 tiles perpendicular to the local road direction.
      let counter = 0;
      for (const road of roadTiles) {
        counter++;
        if (counter % Math.max(rule.spacing, 1) !== 0) continue;

        // Determine road direction by checking which axis has road neighbors
        const hasHorizontal =
          (road.x > 0 && grid.data[road.idx - 1] === 2) ||
          (road.x < width - 1 && grid.data[road.idx + 1] === 2);
        const hasVertical =
          (road.y > 0 && grid.data[road.idx - width] === 2) ||
          (road.y < height - 1 && grid.data[road.idx + width] === 2);

        // Perpendicular offsets: for horizontal roads, try above/below; for vertical, try left/right
        const offsets: Array<{ dx: number; dy: number }> = [];
        if (hasHorizontal && !hasVertical) {
          // Horizontal road — place above or below
          offsets.push({ dx: 0, dy: -1 }, { dx: 0, dy: -2 }, { dx: 0, dy: 1 }, { dx: 0, dy: 2 });
        } else if (hasVertical && !hasHorizontal) {
          // Vertical road — place left or right
          offsets.push({ dx: -1, dy: 0 }, { dx: -2, dy: 0 }, { dx: 1, dy: 0 }, { dx: 2, dy: 0 });
        } else {
          // Junction or ambiguous — try all 4 perpendicular at offset 1
          offsets.push({ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 });
        }

        // Pick a random side from the perpendicular options
        const shuffled = offsets.sort(() => rng.next() - 0.5);
        for (const off of shuffled) {
          const px = road.x + off.dx;
          const py = road.y + off.dy;
          if (px < 0 || px >= width || py < 0 || py >= height) continue;
          const pidx = py * width + px;
          // Must be walkable (0 or 3), not road, not occupied
          const cell = grid.data[pidx];
          if (cell !== 0 && cell !== 3) continue;
          if (occupied.has(pidx)) continue;

          placements.push({ objectRef: rule.objectRef, x: px, y: py });
          occupied.add(pidx);
          break;
        }
      }
    } else if (rule.placement === 'at-junctions') {
      // Place at tiles with 3+ road neighbors (T-junctions, crossroads)
      for (const road of roadTiles) {
        if (neighborCount[road.idx] < 3) continue;

        // Place adjacent to the junction, not on the road itself
        const offsets = [
          { dx: -1, dy: -1 },
          { dx: 1, dy: -1 },
          { dx: -1, dy: 1 },
          { dx: 1, dy: 1 },
        ];
        const shuffled = offsets.sort(() => rng.next() - 0.5);
        for (const off of shuffled) {
          const px = road.x + off.dx;
          const py = road.y + off.dy;
          if (px < 0 || px >= width || py < 0 || py >= height) continue;
          const pidx = py * width + px;
          const cell = grid.data[pidx];
          if (cell !== 0 && cell !== 3) continue;
          if (occupied.has(pidx)) continue;

          placements.push({ objectRef: rule.objectRef, x: px, y: py });
          occupied.add(pidx);
          break;
        }
      }
    } else if (rule.placement === 'at-ends') {
      // Place at road endpoints (exactly 1 road neighbor)
      for (const road of roadTiles) {
        if (neighborCount[road.idx] !== 1) continue;

        // Place on the non-road side (opposite the single neighbor)
        const offsets = [
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 },
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 },
        ];
        const shuffled = offsets.sort(() => rng.next() - 0.5);
        for (const off of shuffled) {
          const px = road.x + off.dx;
          const py = road.y + off.dy;
          if (px < 0 || px >= width || py < 0 || py >= height) continue;
          const pidx = py * width + px;
          const cell = grid.data[pidx];
          if (cell !== 0 && cell !== 3) continue;
          if (occupied.has(pidx)) continue;

          placements.push({ objectRef: rule.objectRef, x: px, y: py });
          occupied.add(pidx);
          break;
        }
      }
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
