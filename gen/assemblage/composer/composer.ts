/**
 * Map Composer — The Brain
 *
 * Takes a scene declaration (intent) + biome + connections and produces
 * a complete MapComposition. This is the "sky level" — you declare
 * features and the composer generates everything else.
 *
 * Input:
 *   { mapId: "heartfield", biome: "farmland", size: [80, 80],
 *     features: [
 *       { type: "hamlet", position: "center", config: { houses: 5 } },
 *       { type: "windmill-hill", position: "northeast" },
 *       { type: "wheat-fields", position: "fill", config: { coverage: 0.3 } }
 *     ],
 *     connections: { north: "everwick", east: "ambergrove" }
 *   }
 *
 * Output:
 *   Complete MapComposition with all tile layers, objects, paths, fill, edges.
 *
 * Composer algorithm:
 *   1. RESOLVE POSITIONS — Convert hints ('center', 'northeast') to bounds
 *   2. LAYOUT ORGANISMS — Each feature self-arranges within its bounds
 *   3. STAMP ARCHETYPES — Place actual TMX tile data from reference maps
 *   4. ROUTE PATHS — A* between feature anchors, dress with biome roads
 *   5. FILL — Empty tiles → biome fill tile. That's it.
 *   6. EDGES — Apply biome edge treatment (forest border, etc.)
 *   7. VALIDATE — Flood fill: can player reach all features?
 *
 * Architecture level: SCENE COMPOSITION (the protein chain)
 */

import type { ArchetypeRegistry } from './archetypes';
import type { BiomeDefinition } from './biomes';
import { getBiome } from './biomes';
import { type FillResult, runFillEngine, SeededRNG } from './fill-engine';
import { type HamletConfig, type HamletLayout, layoutHamlet } from './organisms/hamlet';
import {
  type CollisionGrid,
  createCollisionGrid,
  markArea,
  markClearance,
  type PathRequest,
  type Point,
  type RoutedPath,
  routeAll,
} from './path-router';
import type { ParsedTmx } from './tmx-parser';

// --- Scene Declaration types (the "sky level" input) ---

export type PositionHint =
  | 'center'
  | 'north'
  | 'northeast'
  | 'east'
  | 'southeast'
  | 'south'
  | 'southwest'
  | 'west'
  | 'northwest'
  | 'fill'
  | [number, number];

export interface FeatureDeclaration {
  /** Organism/feature type */
  type: string;
  /** Where to place it */
  position: PositionHint;
  /** Feature-specific configuration */
  config?: Record<string, unknown>;
}

export interface ConnectionSpec {
  /** Target map ID */
  to: string;
  /** Whether this connection has a gate/arch */
  gate?: boolean;
  /** Quest condition for access */
  condition?: string;
}

export interface SceneDeclaration {
  /** Map ID */
  mapId: string;
  /** Human-readable name */
  name: string;
  /** Map size in tiles [width, height] */
  size: [number, number];
  /** Biome ID */
  biome: string;
  /** Feature declarations */
  features: FeatureDeclaration[];
  /** Map connections to other maps */
  connections?: Partial<Record<'north' | 'south' | 'east' | 'west', ConnectionSpec>>;
  /** Player spawn position */
  spawn?: [number, number];
  /** Seed for deterministic generation */
  seed?: number;
}

// --- Composed output ---

export interface ComposedMap {
  /** Source declaration */
  declaration: SceneDeclaration;
  /** Biome used */
  biome: BiomeDefinition;
  /** Map dimensions */
  width: number;
  height: number;
  /** Placed features with their resolved positions and archetype data */
  placedFeatures: PlacedFeature[];
  /** Routed paths connecting features */
  routedPaths: RoutedPath[];
  /** Fill result (ground terrain, scatter, edges) */
  fill: FillResult;
  /** Collision grid (final state) */
  collisionGrid: CollisionGrid;
  /** Connection transition zones */
  transitions: TransitionZone[];
  /** Validation result */
  validation: ValidationResult;
}

export interface PlacedFeature {
  /** Original declaration */
  declaration: FeatureDeclaration;
  /** Resolved bounding box */
  bounds: { x: number; y: number; width: number; height: number };
  /** Parsed archetype TMX data (for tile stamping) */
  archetypes: Array<{
    tmx: ParsedTmx;
    position: Point;
  }>;
  /** Anchors for path routing */
  anchors: Point[];
  /** Organism layout data (if applicable) */
  layout?: HamletLayout;
}

export interface TransitionZone {
  direction: 'north' | 'south' | 'east' | 'west';
  connection: ConnectionSpec;
  /** Position of the transition tile */
  position: Point;
  /** Anchor for path routing */
  anchor: Point;
}

export interface ValidationResult {
  /** Can the player reach all features from spawn? */
  allReachable: boolean;
  /** Features that are unreachable */
  unreachableFeatures: string[];
  /** Any overlapping collision */
  hasOverlaps: boolean;
}

// --- Composer ---

/**
 * Compose a complete map from a scene declaration.
 *
 * This is the main entry point. Give it intent, get a map.
 */
export async function composeMap(
  declaration: SceneDeclaration,
  registry: ArchetypeRegistry,
): Promise<ComposedMap> {
  const biome = getBiome(declaration.biome);
  const [width, height] = declaration.size;
  const seed = declaration.seed ?? hashString(declaration.mapId);
  const rng = new SeededRNG(seed);

  // Create collision grid
  const grid = createCollisionGrid(width, height);

  // --- 1. Resolve connection transition zones ---
  const transitions = resolveTransitions(declaration, width, height);

  // --- 2. Resolve feature positions ---
  const placedFeatures: PlacedFeature[] = [];
  const fillFeatures: FeatureDeclaration[] = [];

  for (const feature of declaration.features) {
    if (feature.position === 'fill') {
      fillFeatures.push(feature);
      continue;
    }

    const bounds = resolvePosition(feature.position, width, height, feature.type);
    const placed = await layoutFeature(feature, bounds, biome, registry, rng);
    placedFeatures.push(placed);

    // Mark feature footprint on collision grid
    markArea(grid, placed.bounds.x, placed.bounds.y, placed.bounds.width, placed.bounds.height, 1);
    markClearance(
      grid,
      placed.bounds.x,
      placed.bounds.y,
      placed.bounds.width,
      placed.bounds.height,
      2,
    );
  }

  // --- 3. Route paths ---
  const pathRequests = buildPathRequests(placedFeatures, transitions, biome);
  const routedPaths = routeAll(grid, pathRequests);

  // --- 4. Fill ---
  const connectionTiles = transitions.map((t) => t.position);
  const fill = runFillEngine({
    mapWidth: width,
    mapHeight: height,
    biome,
    collisionGrid: grid,
    seed: seed + 1000,
    connectionTiles,
  });

  // --- 5. Validate ---
  const spawn = declaration.spawn
    ? { x: declaration.spawn[0], y: declaration.spawn[1] }
    : (placedFeatures[0]?.anchors[0] ?? { x: Math.floor(width / 2), y: Math.floor(height / 2) });
  const validation = validateMap(grid, spawn, placedFeatures, width, height);

  return {
    declaration,
    biome,
    width,
    height,
    placedFeatures,
    routedPaths,
    fill,
    collisionGrid: grid,
    transitions,
    validation,
  };
}

// --- Position Resolution ---

function resolvePosition(
  hint: PositionHint,
  mapWidth: number,
  mapHeight: number,
  featureType: string,
): { x: number; y: number; width: number; height: number } {
  // Estimate feature size based on type
  const featureSize = estimateFeatureSize(featureType);
  const pad = 4; // Padding from map edge

  if (Array.isArray(hint)) {
    return { x: hint[0], y: hint[1], width: featureSize.width, height: featureSize.height };
  }

  // Divide map into a 3x3 grid for position hints
  const thirdW = Math.floor(mapWidth / 3);
  const thirdH = Math.floor(mapHeight / 3);

  const regions: Record<string, { x: number; y: number; width: number; height: number }> = {
    center: { x: thirdW, y: thirdH, width: thirdW, height: thirdH },
    north: { x: thirdW, y: pad, width: thirdW, height: thirdH },
    northeast: { x: thirdW * 2, y: pad, width: thirdW - pad, height: thirdH },
    east: { x: thirdW * 2, y: thirdH, width: thirdW - pad, height: thirdH },
    southeast: { x: thirdW * 2, y: thirdH * 2, width: thirdW - pad, height: thirdH - pad },
    south: { x: thirdW, y: thirdH * 2, width: thirdW, height: thirdH - pad },
    southwest: { x: pad, y: thirdH * 2, width: thirdW, height: thirdH - pad },
    west: { x: pad, y: thirdH, width: thirdW, height: thirdH },
    northwest: { x: pad, y: pad, width: thirdW, height: thirdH },
  };

  return regions[hint] || regions.center;
}

function estimateFeatureSize(featureType: string): { width: number; height: number } {
  const sizes: Record<string, { width: number; height: number }> = {
    hamlet: { width: 30, height: 30 },
    'windmill-hill': { width: 15, height: 15 },
    'stagnation-clearing': { width: 12, height: 12 },
    'market-square': { width: 20, height: 20 },
    'farm-fields': { width: 20, height: 20 },
  };
  return sizes[featureType] || { width: 20, height: 20 };
}

// --- Feature Layout ---

async function layoutFeature(
  feature: FeatureDeclaration,
  bounds: { x: number; y: number; width: number; height: number },
  _biome: BiomeDefinition,
  registry: ArchetypeRegistry,
  rng: SeededRNG,
): Promise<PlacedFeature> {
  switch (feature.type) {
    case 'hamlet':
      return layoutHamletFeature(feature, bounds, registry, rng);

    case 'windmill-hill':
      return layoutSingleBuilding(feature, bounds, 'mage-tower', registry, rng);

    case 'stagnation-clearing':
      return layoutSimpleFeature(feature, bounds, rng);

    default:
      return layoutSimpleFeature(feature, bounds, rng);
  }
}

async function layoutHamletFeature(
  feature: FeatureDeclaration,
  bounds: { x: number; y: number; width: number; height: number },
  registry: ArchetypeRegistry,
  rng: SeededRNG,
): Promise<PlacedFeature> {
  const config: HamletConfig = {
    houses: (feature.config?.houses as number) ?? 5,
    well: (feature.config?.well as boolean) ?? true,
    fences: (feature.config?.fences as boolean) ?? false,
    houseStyle: (feature.config?.houseStyle as 'small' | 'medium' | 'mixed') ?? 'mixed',
  };

  const layout = layoutHamlet(bounds, config, Math.floor(rng.next() * 100000));

  // Load archetype TMX data for each house
  const archetypes: PlacedFeature['archetypes'] = [];
  for (const house of layout.housePlacements) {
    try {
      const tmx = await registry.load(house.archetype);
      archetypes.push({ tmx, position: house.position });
    } catch {
      // Archetype not found — will be rendered as placeholder
    }
  }

  return {
    declaration: feature,
    bounds,
    archetypes,
    anchors: layout.externalAnchors,
    layout,
  };
}

async function layoutSingleBuilding(
  feature: FeatureDeclaration,
  bounds: { x: number; y: number; width: number; height: number },
  archetypeId: string,
  registry: ArchetypeRegistry,
  _rng: SeededRNG,
): Promise<PlacedFeature> {
  const archetypes: PlacedFeature['archetypes'] = [];

  try {
    const tmx = await registry.load(archetypeId);
    const cx = bounds.x + Math.floor((bounds.width - tmx.width) / 2);
    const cy = bounds.y + Math.floor((bounds.height - tmx.height) / 2);
    archetypes.push({ tmx, position: { x: cx, y: cy } });
  } catch {
    // Will render as placeholder
  }

  // Anchor at bottom-center of bounds
  const anchor: Point = {
    x: bounds.x + Math.floor(bounds.width / 2),
    y: bounds.y + bounds.height - 1,
  };

  return {
    declaration: feature,
    bounds,
    archetypes,
    anchors: [anchor],
  };
}

function layoutSimpleFeature(
  feature: FeatureDeclaration,
  bounds: { x: number; y: number; width: number; height: number },
  _rng: SeededRNG,
): PlacedFeature {
  // Simple feature with center anchor
  const anchor: Point = {
    x: bounds.x + Math.floor(bounds.width / 2),
    y: bounds.y + Math.floor(bounds.height / 2),
  };

  return {
    declaration: feature,
    bounds,
    archetypes: [],
    anchors: [anchor],
  };
}

// --- Transitions ---

function resolveTransitions(
  declaration: SceneDeclaration,
  width: number,
  height: number,
): TransitionZone[] {
  const transitions: TransitionZone[] = [];

  if (!declaration.connections) return transitions;

  for (const [dir, conn] of Object.entries(declaration.connections)) {
    if (!conn) continue;
    const direction = dir as TransitionZone['direction'];

    let position: Point;
    let anchor: Point;

    switch (direction) {
      case 'north':
        position = { x: Math.floor(width / 2), y: 0 };
        anchor = { x: Math.floor(width / 2), y: 3 };
        break;
      case 'south':
        position = { x: Math.floor(width / 2), y: height - 1 };
        anchor = { x: Math.floor(width / 2), y: height - 4 };
        break;
      case 'east':
        position = { x: width - 1, y: Math.floor(height / 2) };
        anchor = { x: width - 4, y: Math.floor(height / 2) };
        break;
      case 'west':
        position = { x: 0, y: Math.floor(height / 2) };
        anchor = { x: 3, y: Math.floor(height / 2) };
        break;
    }

    transitions.push({ direction, connection: conn, position: position!, anchor: anchor! });
  }

  return transitions;
}

// --- Path Requests ---

function buildPathRequests(
  features: PlacedFeature[],
  transitions: TransitionZone[],
  biome: BiomeDefinition,
): PathRequest[] {
  const requests: PathRequest[] = [];

  // Connect transitions to nearest feature
  for (const transition of transitions) {
    const nearest = findNearestAnchor(transition.anchor, features);
    if (nearest) {
      requests.push({
        from: transition.anchor,
        to: nearest,
        width: biome.roadWidth,
        terrain: biome.roadTerrain,
        priority: 'main',
      });
    }
  }

  // Connect features to each other (pairwise nearest)
  if (features.length > 1) {
    // Simple: connect each feature to its nearest neighbor
    for (let i = 0; i < features.length; i++) {
      const myAnchor = features[i].anchors[0];
      if (!myAnchor) continue;

      let bestDist = Infinity;
      let bestAnchor: Point | null = null;

      for (let j = 0; j < features.length; j++) {
        if (i === j) continue;
        const otherAnchor = features[j].anchors[0];
        if (!otherAnchor) continue;

        const dist = Math.abs(myAnchor.x - otherAnchor.x) + Math.abs(myAnchor.y - otherAnchor.y);
        if (dist < bestDist) {
          bestDist = dist;
          bestAnchor = otherAnchor;
        }
      }

      if (bestAnchor) {
        requests.push({
          from: myAnchor,
          to: bestAnchor,
          width: Math.max(1, biome.roadWidth - 1),
          terrain: biome.roadTerrain,
          priority: 'branch',
        });
      }
    }
  }

  return requests;
}

function findNearestAnchor(point: Point, features: PlacedFeature[]): Point | null {
  let best: Point | null = null;
  let bestDist = Infinity;

  for (const feature of features) {
    for (const anchor of feature.anchors) {
      const dist = Math.abs(point.x - anchor.x) + Math.abs(point.y - anchor.y);
      if (dist < bestDist) {
        bestDist = dist;
        best = anchor;
      }
    }
  }

  return best;
}

// --- Validation ---

function validateMap(
  grid: CollisionGrid,
  spawn: Point,
  features: PlacedFeature[],
  width: number,
  height: number,
): ValidationResult {
  // Flood fill from spawn to find reachable tiles
  const visited = new Uint8Array(width * height);
  const queue: Point[] = [spawn];
  visited[spawn.y * width + spawn.x] = 1;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ];

    for (const dir of dirs) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

      const idx = ny * width + nx;
      if (visited[idx]) continue;
      if (grid.data[idx] === 1) continue; // Blocked

      visited[idx] = 1;
      queue.push({ x: nx, y: ny });
    }
  }

  // Check if all feature anchors are reachable
  const unreachable: string[] = [];
  for (const feature of features) {
    for (const anchor of feature.anchors) {
      const idx = anchor.y * width + anchor.x;
      if (idx >= 0 && idx < visited.length && !visited[idx]) {
        unreachable.push(feature.declaration.type);
        break;
      }
    }
  }

  return {
    allReachable: unreachable.length === 0,
    unreachableFeatures: unreachable,
    hasOverlaps: false, // TODO: detect actual overlaps
  };
}

// --- Helpers ---

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
