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
import type { AnchorDefinition, RegionDefinition } from './world-ddl';
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
    if (placed.anchor.type === 'town' && placed.anchor.town) {
      // Town = exterior building cluster organism
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
    } else if (placed.anchor.type === 'town' && placed.anchor.town?.size === 'hamlet') {
      // Small hamlet — use the hamlet organism
      const hamletLayout = layoutHamlet(
        placed.bounds,
        {
          houses: placed.anchor.town?.houses ?? 3,
          well: true,
          houseStyle: 'mixed',
        },
        Math.floor(rng.next() * 100000),
      );
      placed.hamletLayout = hamletLayout;
      placed.entryAnchors = hamletLayout.externalAnchors;

      // Mark house footprints
      for (const house of hamletLayout.housePlacements) {
        markArea(grid, house.position.x, house.position.y, 8, 8, 1);
        markClearance(grid, house.position.x, house.position.y, 8, 8, 2);
      }
    } else {
      // Landmark, camp, shrine, dungeon entrance — small footprint
      const cx = placed.bounds.x + Math.floor(placed.bounds.width / 2);
      const cy = placed.bounds.y + Math.floor(placed.bounds.height / 2);
      placed.entryAnchors = [{ x: cx, y: cy }];

      // Small blocked area for the feature
      markArea(grid, cx - 2, cy - 2, 5, 5, 1);
      markClearance(grid, cx - 2, cy - 2, 5, 5, 2);
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

  // --- 4. Route paths between anchors ---
  const pathRequests = buildRegionPaths(placedAnchors, biome, options?.exits ?? []);
  const routedPaths = routeAll(grid, pathRequests);

  // --- 5. Fill ---
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
