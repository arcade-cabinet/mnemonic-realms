/**
 * Region Composer — Outdoor Maps with Towns Embedded
 *
 * A region is the outdoor continuous space the player walks through.
 * Towns are NOT separate maps — they're building clusters (organisms)
 * embedded in the region's outdoor map. The only transitions happen
 * when the player walks through a building door into a child world.
 *
 * What the Region Composer produces:
 * 1. One or more outdoor maps sized by the region's time budget
 * 2. Town organisms placed at anchor positions
 * 3. Connective tissue (paths, wild areas) between anchors
 * 4. Scatter fill on all empty space
 * 5. Edge treatment at map borders
 * 6. Transition points for building doors → child world instances
 * 7. NPC spawn positions
 * 8. Event trigger zones
 *
 * The region-level map IS the outdoor world. Walk from Everwick to
 * Heartfield without a single transition — same map, same tileset.
 *
 * Architecture level: REGION (the big outdoor onion layer)
 */

import type { ArchetypeRegistry } from './archetypes';
import { type BiomeDefinition, getBiome } from './biomes';
import { type FillResult, runFillEngine, SeededRNG } from './fill-engine';
import { type HamletLayout, layoutHamlet } from './organisms/hamlet';
import { estimateTownSize, layoutTown, type TownLayout } from './organisms/town';
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
import type { AnchorDefinition, RegionDefinition, WildFeature } from './world-ddl';
import { calculateRegionMetrics } from './world-ddl';

// --- Output types ---

export interface RegionMap {
  /** Region this map belongs to */
  regionId: string;
  /** Map dimensions in tiles */
  width: number;
  height: number;
  /** Biome definition */
  biome: BiomeDefinition;
  /** Placed anchors with their layouts */
  placedAnchors: PlacedAnchor[];
  /** Routed paths between anchors */
  routedPaths: RoutedPath[];
  /** Fill result (ground, scatter, edges) */
  fill: FillResult;
  /** Final collision grid */
  collisionGrid: CollisionGrid;
  /** All door transitions (world instance ID → position) */
  doorTransitions: Map<string, Point>;
  /** All NPC positions (NPC ID → position) */
  npcPositions: Map<string, Point>;
  /** Region connections to other regions */
  regionExits: RegionExit[];
  /** Placed wild features (hidden chests, shrines, etc.) */
  wildFeatureObjects: PlacedWildFeature[];
  /** Placed safe zones (roadside camps for rest) */
  safeZones: PlacedSafeZone[];
}

export interface PlacedWildFeature {
  /** Feature type */
  type: WildFeature['type'];
  /** Position in map tiles */
  position: Point;
  /** Placement strategy used */
  placement: WildFeature['placement'];
}

export interface PlacedSafeZone {
  /** Camp center position in map tiles */
  position: Point;
  /** Walking distance from start of path in tiles */
  distanceAlongPath: number;
}

export interface PlacedAnchor {
  /** Anchor definition */
  anchor: AnchorDefinition;
  /** Bounding box in map tiles */
  bounds: { x: number; y: number; width: number; height: number };
  /** Town layout (if this anchor is a town) */
  townLayout?: TownLayout;
  /** Hamlet layout (if applicable) */
  hamletLayout?: HamletLayout;
  /** Entry anchors for path routing */
  entryAnchors: Point[];
}

export interface RegionExit {
  /** Direction of exit */
  direction: 'north' | 'south' | 'east' | 'west';
  /** Target region ID */
  targetRegion: string;
  /** Position of the exit tiles */
  position: Point;
  /** Condition to cross */
  condition?: string;
}

// --- Region Composer ---

/**
 * Compose a region's outdoor map(s).
 *
 * Takes a RegionDefinition from the DDL and produces complete outdoor maps
 * with towns embedded as organisms.
 */
export async function composeRegion(
  region: RegionDefinition,
  _registry: ArchetypeRegistry,
  options?: {
    /** Override map dimensions (otherwise calculated from time budget) */
    mapSize?: [number, number];
    /** Seed for deterministic generation */
    seed?: number;
    /** Region exits (from regionConnections in world.json) */
    exits?: RegionExit[];
  },
): Promise<RegionMap> {
  const biome = getBiome(region.biome);
  const metrics = calculateRegionMetrics(region);
  const seed = options?.seed ?? hashString(region.id);
  const rng = new SeededRNG(seed);

  // --- 1. Calculate map dimensions from time budget ---
  const [mapWidth, mapHeight] =
    options?.mapSize ?? calculateMapSize(metrics, region.anchors.length);
  const grid = createCollisionGrid(mapWidth, mapHeight);

  // --- 2. Position anchors ---
  const placedAnchors = positionAnchors(region.anchors, mapWidth, mapHeight, rng);

  // --- 3. Layout each anchor ---
  const doorTransitions = new Map<string, Point>();
  const npcPositions = new Map<string, Point>();

  for (const placed of placedAnchors) {
    if (placed.anchor.type === 'town' && placed.anchor.town?.size === 'hamlet') {
      // Hamlet — small buildings, compact layout
      const worldSlotIds = getWorldSlotIds(placed.anchor);
      const totalHouses = (placed.anchor.town.houses ?? 3) + worldSlotIds.length;
      const hamletLayout = layoutHamlet(
        placed.bounds,
        {
          houses: totalHouses,
          well: true,
          houseStyle: 'mixed',
        },
        Math.floor(rng.next() * 100000),
      );
      placed.hamletLayout = hamletLayout;
      placed.entryAnchors = hamletLayout.externalAnchors;

      // Map worldSlot instance IDs to house door anchors
      for (let i = 0; i < worldSlotIds.length && i < hamletLayout.housePlacements.length; i++) {
        doorTransitions.set(worldSlotIds[i], hamletLayout.housePlacements[i].doorAnchor);
      }

      // Position service NPCs near their building doors
      if (placed.anchor.town.services) {
        for (let i = 0; i < placed.anchor.town.services.length && i < hamletLayout.housePlacements.length; i++) {
          const service = placed.anchor.town.services[i];
          if (service.keeperNpc) {
            const door = hamletLayout.housePlacements[i].doorAnchor;
            npcPositions.set(service.keeperNpc, { x: door.x + 1, y: door.y + 1 });
          }
        }
      }

      // Mark house footprints
      for (const house of hamletLayout.housePlacements) {
        markArea(grid, house.position.x, house.position.y, 8, 8, 1);
        markClearance(grid, house.position.x, house.position.y, 8, 8, 2);
      }
    } else if (placed.anchor.type === 'town' && placed.anchor.town) {
      // Town/Village = outdoor building cluster organism
      const worldSlotIds = getWorldSlotIds(placed.anchor);
      const townLayout = layoutTown(
        placed.bounds,
        placed.anchor.town,
        worldSlotIds,
        Math.floor(rng.next() * 100000),
      );
      placed.townLayout = townLayout;
      placed.entryAnchors = townLayout.entryAnchors;

      // Merge door transitions
      for (const [intId, pos] of Array.from(townLayout.doorPositions.entries())) {
        doorTransitions.set(intId, pos);
      }

      // Merge NPC positions
      for (const [npcId, pos] of Array.from(townLayout.npcPositions.entries())) {
        npcPositions.set(npcId, pos);
      }

      // Mark building footprints on collision grid
      for (const building of townLayout.buildings) {
        markArea(
          grid,
          building.position.x,
          building.position.y,
          building.footprint.width,
          building.footprint.height,
          1, // blocked
        );
        markClearance(
          grid,
          building.position.x,
          building.position.y,
          building.footprint.width,
          building.footprint.height,
          2, // clearance
        );
      }
    } else {
      // Landmark, camp, shrine, dungeon entrance — small footprint
      const cx = placed.bounds.x + Math.floor(placed.bounds.width / 2);
      const cy = placed.bounds.y + Math.floor(placed.bounds.height / 2);

      // Small blocked area for the feature
      markArea(grid, cx - 2, cy - 2, 5, 5, 1);
      markClearance(grid, cx - 2, cy - 2, 5, 5, 2);

      // Entry anchors at cardinal directions, outside the blocked+clearance zone
      placed.entryAnchors = [
        { x: cx, y: cy - 5 }, // North
        { x: cx, y: cy + 5 }, // South
        { x: cx + 5, y: cy }, // East
        { x: cx - 5, y: cy }, // West
      ];
    }

    // Add NPCs from anchor definition
    if (placed.anchor.npcs) {
      for (const npc of placed.anchor.npcs) {
        if (!npcPositions.has(npc.id)) {
          // Default position near the anchor center
          const cx = placed.bounds.x + Math.floor(placed.bounds.width / 2);
          const cy = placed.bounds.y + Math.floor(placed.bounds.height / 2);
          npcPositions.set(npc.id, { x: cx + rng.nextInt(-3, 3), y: cy + rng.nextInt(-3, 3) });
        }
      }
    }
  }

  // --- 4. Nudge entry anchors off blocked tiles ---
  // Buildings are placed before entry anchors are finalized, so an anchor
  // at a bounds edge can land on a building footprint. Walk outward in a
  // spiral until we find a tile passable for the road width.
  for (const placed of placedAnchors) {
    for (let i = 0; i < placed.entryAnchors.length; i++) {
      placed.entryAnchors[i] = nudgeToPassable(grid, placed.entryAnchors[i], biome.roadWidth);
    }
  }

  // --- 5. Route paths between anchors ---
  const pathRequests = buildRegionPaths(placedAnchors, biome, options?.exits ?? []);
  const routedPaths = routeAll(grid, pathRequests);

  // --- 6. Place wild features ---
  const wildFeatureObjects = placeWildFeatures(
    region.connectiveTissue.wildFeatures ?? [],
    grid,
    mapWidth,
    mapHeight,
    rng,
  );

  // Mark wild features on collision grid (small 2x2 blocked area)
  for (const feat of wildFeatureObjects) {
    markArea(grid, feat.position.x, feat.position.y, 2, 2, 1);
  }

  // --- 7. Place safe zones along paths ---
  const safeZones = placeSafeZones(
    region.connectiveTissue.safeZoneInterval,
    routedPaths,
    grid,
    mapWidth,
    mapHeight,
    rng,
  );

  // --- 8. Fill ---
  const connectionTiles = (options?.exits ?? []).map((e) => e.position);
  const fill = runFillEngine({
    mapWidth,
    mapHeight,
    biome,
    collisionGrid: grid,
    seed: seed + 1000,
    connectionTiles,
  });

  return {
    regionId: region.id,
    width: mapWidth,
    height: mapHeight,
    biome,
    placedAnchors,
    routedPaths,
    fill,
    collisionGrid: grid,
    doorTransitions,
    npcPositions,
    regionExits: options?.exits ?? [],
    wildFeatureObjects,
    safeZones,
  };
}

// --- Anchor positioning ---

/**
 * Position anchors within the map based on their declared positions.
 *
 * Uses a flow layout: 'start' anchors near the top, 'middle' in the center,
 * 'end' near the bottom. 'side' anchors go to map edges.
 */
function positionAnchors(
  anchors: AnchorDefinition[],
  mapWidth: number,
  mapHeight: number,
  rng: SeededRNG,
): PlacedAnchor[] {
  const placed: PlacedAnchor[] = [];
  const padding = 8;

  // Sort anchors by position priority
  const positionOrder: Record<string, number> = {
    start: 0,
    middle: 1,
    end: 2,
    side: 3,
  };

  const sorted = [...anchors].sort((a, b) => {
    const aOrder = Array.isArray(a.position) ? 1 : (positionOrder[a.position] ?? 1);
    const bOrder = Array.isArray(b.position) ? 1 : (positionOrder[b.position] ?? 1);
    return aOrder - bOrder;
  });

  // Calculate available grid cells
  const cols = Math.ceil(Math.sqrt(sorted.length));
  const rows = Math.ceil(sorted.length / cols);
  const cellW = Math.floor((mapWidth - padding * 2) / cols);
  const cellH = Math.floor((mapHeight - padding * 2) / rows);

  for (let i = 0; i < sorted.length; i++) {
    const anchor = sorted[i];
    let x: number;
    let y: number;
    let w: number;
    let h: number;

    if (Array.isArray(anchor.position)) {
      // Explicit position
      x = anchor.position[0];
      y = anchor.position[1];
      w = 20;
      h = 20;
    } else {
      // Grid-based positioning
      const col = i % cols;
      const row = Math.floor(i / cols);
      x = padding + col * cellW;
      y = padding + row * cellH;

      // Size based on anchor type
      if (anchor.type === 'town' && anchor.town) {
        const townSize = estimateTownSize(anchor.town.size);
        w = Math.min(townSize.width, cellW - 4);
        h = Math.min(townSize.height, cellH - 4);
      } else {
        w = Math.min(20, cellW - 4);
        h = Math.min(20, cellH - 4);
      }

      // Add jitter for organic feel
      x += rng.nextInt(0, Math.max(0, cellW - w - 4));
      y += rng.nextInt(0, Math.max(0, cellH - h - 4));
    }

    placed.push({
      anchor,
      bounds: { x, y, width: w, height: h },
      entryAnchors: [], // Will be set during layout
    });
  }

  return placed;
}

// --- Path building ---

function buildRegionPaths(
  anchors: PlacedAnchor[],
  biome: BiomeDefinition,
  exits: RegionExit[],
): PathRequest[] {
  const requests: PathRequest[] = [];

  // Connect anchors in sequence (main road through region)
  for (let i = 0; i < anchors.length - 1; i++) {
    const fromAnchor = anchors[i].entryAnchors[0];
    const toAnchor = anchors[i + 1].entryAnchors[0];
    if (fromAnchor && toAnchor) {
      requests.push({
        from: fromAnchor,
        to: toAnchor,
        width: biome.roadWidth,
        terrain: biome.roadTerrain,
        priority: 'main',
      });
    }
  }

  // Connect region exits to nearest anchor
  for (const exit of exits) {
    let nearest: Point | null = null;
    let bestDist = Infinity;

    for (const anchor of anchors) {
      for (const entry of anchor.entryAnchors) {
        const dist = Math.abs(exit.position.x - entry.x) + Math.abs(exit.position.y - entry.y);
        if (dist < bestDist) {
          bestDist = dist;
          nearest = entry;
        }
      }
    }

    if (nearest) {
      requests.push({
        from: exit.position,
        to: nearest,
        width: biome.roadWidth,
        terrain: biome.roadTerrain,
        priority: 'main',
      });
    }
  }

  // Branch connections for non-adjacent anchors
  for (let i = 0; i < anchors.length; i++) {
    for (let j = i + 2; j < anchors.length; j++) {
      const a = anchors[i].entryAnchors[0];
      const b = anchors[j].entryAnchors[0];
      if (!a || !b) continue;

      // Only add shortcut if anchors are reasonably close
      const dist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
      if (dist < 80) {
        requests.push({
          from: a,
          to: b,
          width: Math.max(1, biome.roadWidth - 1),
          terrain: biome.roadTerrain,
          priority: 'branch',
        });
      }
    }
  }

  return requests;
}

// --- Wild features placement ---

/**
 * Place wild features in the region based on connective tissue rules.
 *
 * Placement strategies:
 * - near-path: Within 5-8 tiles of a routed path (cell 2), not on the path itself
 * - off-path: 15+ tiles from any path, in empty ground (cell 0)
 * - hidden: Map corners or edges, behind scatter objects
 */
function placeWildFeatures(
  features: WildFeature[],
  grid: CollisionGrid,
  mapWidth: number,
  mapHeight: number,
  rng: SeededRNG,
): PlacedWildFeature[] {
  const placed: PlacedWildFeature[] = [];

  // Build a distance-to-path map for efficient placement queries
  const pathDistances = computePathDistances(grid, mapWidth, mapHeight);

  for (const feature of features) {
    let remaining = feature.count;
    let attempts = 0;
    const maxAttempts = feature.count * 50;

    while (remaining > 0 && attempts < maxAttempts) {
      attempts++;

      const x = rng.nextInt(2, mapWidth - 3);
      const y = rng.nextInt(2, mapHeight - 3);

      // Must be on empty ground (cell 0) and not blocked
      const idx = y * mapWidth + x;
      if (grid.data[idx] !== 0) continue;

      // Check 2x2 area is clear
      if (!isAreaClear(grid, x, y, 2, 2, mapWidth, mapHeight)) continue;

      // Check distance-to-nearest-path constraint
      const dist = pathDistances[idx];

      let valid = false;
      switch (feature.placement) {
        case 'near-path':
          valid = dist >= 5 && dist <= 8;
          break;
        case 'off-path':
          valid = dist >= 15;
          break;
        case 'hidden':
          // Prefer corners and edges of the map
          valid = isHiddenPosition(x, y, mapWidth, mapHeight, dist);
          break;
      }

      if (!valid) continue;

      // Check minimum distance from other placed features (at least 10 tiles apart)
      const tooClose = placed.some(
        (p) =>
          Math.abs(p.position.x - x) + Math.abs(p.position.y - y) < 10,
      );
      if (tooClose) continue;

      placed.push({
        type: feature.type,
        position: { x, y },
        placement: feature.placement,
      });
      remaining--;
    }
  }

  return placed;
}

/**
 * Compute Manhattan distance from each tile to the nearest path tile (cell 2).
 * Returns a flat array indexed by (y * width + x).
 * Uses BFS flood-fill from all path tiles.
 */
function computePathDistances(
  grid: CollisionGrid,
  width: number,
  height: number,
): Uint16Array {
  const dist = new Uint16Array(width * height).fill(0xffff);
  const queue: number[] = [];

  // Seed BFS from all path tiles
  for (let i = 0; i < width * height; i++) {
    if (grid.data[i] === 2) {
      dist[i] = 0;
      queue.push(i);
    }
  }

  const dirs = [-1, 1, -width, width];
  let head = 0;

  while (head < queue.length) {
    const idx = queue[head++];
    const d = dist[idx];
    const x = idx % width;

    for (const dir of dirs) {
      const ni = idx + dir;
      if (ni < 0 || ni >= width * height) continue;

      // Prevent wrapping at horizontal edges
      const nx = ni % width;
      if (dir === -1 && x === 0) continue;
      if (dir === 1 && x === width - 1) continue;

      if (d + 1 < dist[ni]) {
        dist[ni] = d + 1;
        queue.push(ni);
      }
    }
  }

  return dist;
}

/**
 * Check if a position qualifies as "hidden" for feature placement.
 * Hidden positions are in map corners, dead ends, or behind edge walls.
 */
function isHiddenPosition(
  x: number,
  y: number,
  mapWidth: number,
  mapHeight: number,
  distToPath: number,
): boolean {
  const cornerMargin = Math.min(mapWidth, mapHeight) * 0.15;
  const isNearCorner =
    (x < cornerMargin && y < cornerMargin) ||
    (x < cornerMargin && y > mapHeight - cornerMargin) ||
    (x > mapWidth - cornerMargin && y < cornerMargin) ||
    (x > mapWidth - cornerMargin && y > mapHeight - cornerMargin);

  const isNearEdge =
    x < 6 || y < 6 || x > mapWidth - 7 || y > mapHeight - 7;

  // Hidden = near a corner, or near edge and at least somewhat off-path
  return isNearCorner || (isNearEdge && distToPath >= 8);
}

/**
 * Check if a rectangular area is entirely empty ground (cell 0).
 */
function isAreaClear(
  grid: CollisionGrid,
  x: number,
  y: number,
  w: number,
  h: number,
  mapWidth: number,
  mapHeight: number,
): boolean {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const gx = x + dx;
      const gy = y + dy;
      if (gx < 0 || gx >= mapWidth || gy < 0 || gy >= mapHeight) return false;
      if (grid.data[gy * mapWidth + gx] !== 0) return false;
    }
  }
  return true;
}

// --- Safe zone placement ---

/**
 * Place roadside camp/rest spots at regular intervals along main paths.
 *
 * Safe zones are 5x5 blocked areas adjacent to the path with a campfire
 * object and a bench. They provide rest points every N minutes of walk time.
 */
function placeSafeZones(
  safeZoneInterval: number | undefined,
  routedPaths: RoutedPath[],
  grid: CollisionGrid,
  mapWidth: number,
  mapHeight: number,
  rng: SeededRNG,
): PlacedSafeZone[] {
  if (!safeZoneInterval || safeZoneInterval <= 0) return [];

  const WALK_SPEED_TPS = 4; // tiles per second
  const intervalTiles = safeZoneInterval * 60 * WALK_SPEED_TPS;

  const zones: PlacedSafeZone[] = [];

  // Walk along each main routed path
  const mainPaths = routedPaths.filter((p) => p.request.priority === 'main');

  for (const routedPath of mainPaths) {
    const waypoints = routedPath.waypoints;
    if (waypoints.length === 0) continue;

    let tilesSinceLastZone = 0;

    for (let i = 1; i < waypoints.length; i++) {
      tilesSinceLastZone++;

      if (tilesSinceLastZone >= intervalTiles) {
        const wp = waypoints[i];

        // Find a valid 5x5 camp position adjacent to the path
        const campPos = findCampPosition(
          grid,
          wp,
          mapWidth,
          mapHeight,
          rng,
        );

        if (campPos) {
          // Mark 5x5 camp area as blocked
          markArea(grid, campPos.x, campPos.y, 5, 5, 1);

          zones.push({
            position: campPos,
            distanceAlongPath: i,
          });

          tilesSinceLastZone = 0;
        }
      }
    }
  }

  return zones;
}

/**
 * Find a valid position for a 5x5 camp adjacent to a path waypoint.
 * Tries all four directions from the waypoint, picking the first clear spot.
 */
function findCampPosition(
  grid: CollisionGrid,
  pathPoint: Point,
  mapWidth: number,
  mapHeight: number,
  rng: SeededRNG,
): Point | null {
  // Try offsets: camp placed adjacent to path in randomized cardinal order
  const offsets = [
    { x: 3, y: -2 },  // East of path
    { x: -8, y: -2 }, // West of path
    { x: -2, y: 3 },  // South of path
    { x: -2, y: -8 }, // North of path
  ];

  // Shuffle offsets for variety
  for (let i = offsets.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i);
    [offsets[i], offsets[j]] = [offsets[j], offsets[i]];
  }

  for (const offset of offsets) {
    const cx = pathPoint.x + offset.x;
    const cy = pathPoint.y + offset.y;

    // Check bounds
    if (cx < 0 || cy < 0 || cx + 5 > mapWidth || cy + 5 > mapHeight) continue;

    // Check 5x5 area is clear
    if (isAreaClear(grid, cx, cy, 5, 5, mapWidth, mapHeight)) {
      return { x: cx, y: cy };
    }
  }

  return null;
}

// --- Map sizing ---

function calculateMapSize(
  metrics: { outdoorScreens: number },
  _anchorCount: number,
): [number, number] {
  // Each "screen" is roughly 80x80 tiles at 16px
  // Arrange screens in a rough grid
  const screens = Math.max(1, metrics.outdoorScreens);
  const cols = Math.ceil(Math.sqrt(screens));
  const rows = Math.ceil(screens / cols);

  // But cap at reasonable sizes for RPG-JS
  const tileWidth = Math.min(200, cols * 80);
  const tileHeight = Math.min(200, rows * 80);

  return [tileWidth, tileHeight];
}

// --- Helpers ---

function getWorldSlotIds(anchor: AnchorDefinition): string[] {
  const ids: string[] = [];

  // Direct world slots on the anchor (building doors → child worlds)
  if (anchor.worldSlots) {
    ids.push(...anchor.worldSlots.map((s) => s.instanceId));
  }

  // Dungeon floor world slots
  if (anchor.dungeon?.worldSlots) {
    ids.push(...anchor.dungeon.worldSlots.map((s) => s.instanceId));
  }

  return ids;
}

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Nudge a point to the nearest tile passable for a given road width.
 * Searches outward in concentric rings. Returns the original point
 * if already passable or no passable tile found within 20 tiles.
 */
function nudgeToPassable(
  grid: CollisionGrid,
  point: Point,
  roadWidth: number,
): Point {
  const halfW = Math.floor(roadWidth / 2);

  const isPassable = (x: number, y: number): boolean => {
    for (let dy = -halfW; dy <= halfW; dy++) {
      for (let dx = -halfW; dx <= halfW; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= grid.width || ny < 0 || ny >= grid.height) return false;
        if (grid.data[ny * grid.width + nx] === 1) return false;
      }
    }
    return true;
  };

  if (isPassable(point.x, point.y)) return point;

  // Spiral outward to find nearest passable tile
  for (let r = 1; r < 20; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        const nx = point.x + dx;
        const ny = point.y + dy;
        if (nx >= 0 && nx < grid.width && ny >= 0 && ny < grid.height) {
          if (isPassable(nx, ny)) return { x: nx, y: ny };
        }
      }
    }
  }

  return point;
}
