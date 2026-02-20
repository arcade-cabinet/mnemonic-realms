/**
 * Town Organism — Exterior Building Cluster
 *
 * A town is NOT a separate map. It's an outdoor organism — a cluster of
 * buildings placed within the region's continuous outdoor space. The only
 * transitions are through building doors into interior maps.
 *
 * In Pokemon, you walk from route into town seamlessly. The "town" is just
 * buildings, NPCs, and signposts on the same outdoor tilemap. That's what
 * this organism produces.
 *
 * The town layout algorithm:
 * 1. Place central feature (well, fountain, memorial garden, etc.)
 * 2. Place service buildings around center (shops, inn, forge, etc.)
 * 3. Fill remaining slots with residential houses
 * 4. Connect all buildings with internal roads to the center
 * 5. Expose entry anchors for the region's connective tissue to connect to
 *
 * Config comes from TownDefinition in the region's anchor DDL.
 *
 * Architecture level: ORGANISM
 */

import { SeededRNG } from '../fill-engine';
import type { Point } from '../path-router';
import type { TownDefinition, TownService } from '../world-ddl';

// --- Types ---

export interface TownLayout {
  /** Bounding box this town occupies in region tiles */
  bounds: { x: number; y: number; width: number; height: number };
  /** Central feature placement */
  centralFeature?: {
    type: string;
    position: Point;
  };
  /** All building placements (services + houses) */
  buildings: BuildingPlacement[];
  /** Internal road segments connecting buildings to center */
  internalRoads: Array<{ from: Point; to: Point }>;
  /** Anchors where region paths connect into town */
  entryAnchors: Point[];
  /** NPC spawn positions (keyed by NPC ID) */
  npcPositions: Map<string, Point>;
  /** Door positions that transition to interiors (keyed by interior ID) */
  doorPositions: Map<string, Point>;
}

export interface BuildingPlacement {
  /** What archetype to stamp */
  archetype: string;
  /** Position in region tiles (top-left corner) */
  position: Point;
  /** Building footprint in tiles */
  footprint: { width: number; height: number };
  /** Door position (where the interior transition triggers) */
  doorAnchor: Point;
  /** Service info (null for residential houses) */
  service?: TownService;
  /** Interior ID this building transitions to (if any) */
  interiorId?: string;
}

// --- Size estimates per town size ---

const TOWN_DIMENSIONS: Record<string, { width: number; height: number }> = {
  hamlet: { width: 30, height: 30 },
  village: { width: 45, height: 45 },
  town: { width: 60, height: 55 },
  city: { width: 80, height: 70 },
};

// Service type → archetype mapping
const SERVICE_ARCHETYPES: Record<string, string> = {
  'weapon-shop': 'weapon-shop',
  'armor-shop': 'weapon-shop',
  'general-store': 'weapon-shop',
  inn: 'tavern',
  tavern: 'tavern',
  library: 'library',
  church: 'house-medium',
  blacksmith: 'weapon-shop',
  tailor: 'house-small',
  cartographer: 'house-small',
  fishmonger: 'house-small',
  huntmaster: 'house-small',
  'guild-hall': 'house-medium',
  'elder-house': 'house-small',
};

// Archetype footprints (from reference TMX dimensions at 16px tiles)
const FOOTPRINTS: Record<string, { width: number; height: number }> = {
  'weapon-shop': { width: 25, height: 22 },
  tavern: { width: 25, height: 22 },
  library: { width: 25, height: 22 },
  'house-small': { width: 20, height: 19 },
  'house-medium': { width: 25, height: 22 },
};

/**
 * Layout a town within the given bounds.
 *
 * Towns are exterior organisms: building clusters on the outdoor map.
 * The composer stamps these buildings into the region's collision grid
 * and connects them with roads.
 */
export function layoutTown(
  bounds: { x: number; y: number; width: number; height: number },
  town: TownDefinition,
  interiorIds: string[],
  seed: number,
): TownLayout {
  const rng = new SeededRNG(seed);
  const cx = bounds.x + Math.floor(bounds.width / 2);
  const cy = bounds.y + Math.floor(bounds.height / 2);

  const buildings: BuildingPlacement[] = [];
  const internalRoads: TownLayout['internalRoads'] = [];
  const npcPositions = new Map<string, Point>();
  const doorPositions = new Map<string, Point>();

  // --- 1. Central feature ---
  const centralFeature = town.centralFeature
    ? { type: town.centralFeature, position: { x: cx, y: cy } }
    : undefined;

  // --- 2. Place service buildings in a ring around center ---
  const allSlots = [...town.services];
  const totalBuildings = allSlots.length + town.houses;

  // Ring radius must be large enough that the biggest building footprint
  // doesn't overlap neighbors at the narrowest angular gap.
  // Minimum: largest footprint diagonal + 2-tile gap between buildings.
  const maxFootprint = 25; // weapon-shop/tavern at 25 tiles wide
  const angularGap = (2 * Math.PI) / totalBuildings;
  const minRadiusForSpacing = Math.ceil(
    (maxFootprint + 4) / (2 * Math.sin(angularGap / 2)),
  );
  const ringRadius = Math.max(
    minRadiusForSpacing,
    14,
    Math.min(
      Math.floor(Math.min(bounds.width, bounds.height) / 2) - 4,
      10 + totalBuildings * 3,
    ),
  );

  let interiorIndex = 0;

  /** Check if a new building overlaps any existing building (with 2-tile gap) */
  function wouldOverlap(
    bx: number,
    by: number,
    fw: number,
    fh: number,
  ): boolean {
    const gap = 2;
    for (const existing of buildings) {
      const ox = existing.position.x < bx + fw + gap &&
        existing.position.x + existing.footprint.width + gap > bx;
      const oy = existing.position.y < by + fh + gap &&
        existing.position.y + existing.footprint.height + gap > by;
      if (ox && oy) return true;
    }
    return false;
  }

  /** Place a building on the ring, retrying with jitter if overlap detected */
  function placeOnRing(
    baseAngle: number,
    archetype: string,
  ): { bx: number; by: number; footprint: { width: number; height: number } } {
    const footprint = FOOTPRINTS[archetype] || FOOTPRINTS['house-small'];

    for (let attempt = 0; attempt < 8; attempt++) {
      const jitter = attempt === 0 ? 0 : rng.next() * 0.5 - 0.25;
      const angle = baseAngle + jitter;
      const r = ringRadius + rng.nextInt(-2, 2) + attempt;

      const bx = cx + Math.round(Math.cos(angle) * r) - Math.floor(footprint.width / 2);
      const by = cy + Math.round(Math.sin(angle) * r) - Math.floor(footprint.height / 2);

      if (!wouldOverlap(bx, by, footprint.width, footprint.height)) {
        return { bx, by, footprint };
      }
    }

    // Fallback: push further out
    const angle = baseAngle;
    const r = ringRadius + totalBuildings * 2;
    const bx = cx + Math.round(Math.cos(angle) * r) - Math.floor(footprint.width / 2);
    const by = cy + Math.round(Math.sin(angle) * r) - Math.floor(footprint.height / 2);
    return { bx, by, footprint };
  }

  // Place services first (they get priority positions)
  for (let i = 0; i < allSlots.length; i++) {
    const service = allSlots[i];
    const archetype = SERVICE_ARCHETYPES[service.type] || 'house-small';
    const baseAngle = (i / totalBuildings) * Math.PI * 2 + rng.next() * 0.2;

    const { bx, by, footprint } = placeOnRing(baseAngle, archetype);

    // Door at bottom-center of building
    const doorX = bx + Math.floor(footprint.width / 2);
    const doorY = by + footprint.height;

    const intId = interiorIndex < interiorIds.length ? interiorIds[interiorIndex] : undefined;
    if (intId) interiorIndex++;

    buildings.push({
      archetype,
      position: { x: bx, y: by },
      footprint,
      doorAnchor: { x: doorX, y: doorY },
      service,
      interiorId: intId,
    });

    // Internal road from door to center
    internalRoads.push({
      from: { x: doorX, y: doorY },
      to: { x: cx, y: cy },
    });

    // Door position for transition
    if (intId) {
      doorPositions.set(intId, { x: doorX, y: doorY });
    }

    // NPC position near their building — outside footprint, near door
    if (service.keeperNpc) {
      npcPositions.set(service.keeperNpc, { x: doorX + 1, y: doorY + 1 });
    }
  }

  // --- 3. Place residential houses ---
  for (let h = 0; h < town.houses; h++) {
    const slotIndex = allSlots.length + h;
    const archetype = rng.chance(0.3) ? 'house-medium' : 'house-small';
    const baseAngle = (slotIndex / totalBuildings) * Math.PI * 2 + rng.next() * 0.2;

    const { bx, by, footprint } = placeOnRing(baseAngle, archetype);

    const doorX = bx + Math.floor(footprint.width / 2);
    const doorY = by + footprint.height;

    buildings.push({
      archetype,
      position: { x: bx, y: by },
      footprint,
      doorAnchor: { x: doorX, y: doorY },
    });

    internalRoads.push({
      from: { x: doorX, y: doorY },
      to: { x: cx, y: cy },
    });
  }

  // --- 4. Entry anchors (N, S, E, W of town) ---
  const entryAnchors: Point[] = [
    { x: cx, y: bounds.y }, // North
    { x: cx, y: bounds.y + bounds.height - 1 }, // South
    { x: bounds.x + bounds.width - 1, y: cy }, // East
    { x: bounds.x, y: cy }, // West
  ];

  return {
    bounds,
    centralFeature,
    buildings,
    internalRoads,
    entryAnchors,
    npcPositions,
    doorPositions,
  };
}

/**
 * Estimate the outdoor footprint for a town size.
 */
export function estimateTownSize(size: TownDefinition['size']): { width: number; height: number } {
  return TOWN_DIMENSIONS[size] || TOWN_DIMENSIONS.village;
}
