/**
 * World Composer — Orchestrates Everything
 *
 * Worlds all the way down. The World Composer:
 * 1. Loads the split DDL (world.json + region JSONs + world instance JSONs)
 * 2. Composes each region as outdoor maps with towns embedded
 * 3. Resolves world instances from templates + slot config
 * 4. Wires up all transitions (building doors, dungeon entries, region gates)
 * 5. Produces the complete game world
 *
 * The fractal pattern:
 *   World = composition of Regions
 *   Region = outdoor map with Town organisms + connective tissue
 *   Town = outdoor building cluster organism (NOT a separate map)
 *   WorldInstance = child world from template (shop, dungeon, fortress, etc.)
 *     Each child world has its own regions (floors, rooms, wings)
 *     Same algebra recursively
 *
 * Architecture level: WORLD (the outermost onion)
 */

import type { ArchetypeRegistry } from './archetypes';
import { composeRegion, type RegionExit, type RegionMap } from './region-composer';
import type { RegionConnection, RegionDefinition } from './world-ddl';
import type { WorldInstance, WorldTemplate } from './world-template';
import { loadWorldDDL } from './world-loader';

// --- Output types ---

export interface ComposedWorld {
  /** Game name */
  name: string;
  /** Starting region */
  startRegion: string;
  /** Starting anchor within that region */
  startAnchor: string;
  /** All composed region outdoor maps */
  regionMaps: Map<string, RegionMap>;
  /** All resolved world instances (shops, dungeons, etc.) */
  worldInstances: Map<string, ComposedWorldInstance>;
  /** Region connections with resolved positions */
  connections: ResolvedConnection[];
}

export interface ComposedWorldInstance {
  /** Instance ID */
  id: string;
  /** Display name */
  name: string;
  /** Template this was created from */
  templateId: string;
  /** Parent anchor (what outdoor location connects to this world) */
  parentAnchor: string;
  /** Slot values applied to the template */
  slotValues: Record<string, unknown>;
  /** Additional properties */
  properties: Record<string, unknown>;
  /** Resolved template (if available) */
  template?: WorldTemplate;
}

export interface ResolvedConnection {
  /** Source region */
  fromRegion: string;
  /** Target region */
  toRegion: string;
  /** Connection type */
  type: 'adjacent' | 'gate' | 'ferry' | 'portal';
  /** Quest condition */
  condition?: string;
  /** Position on source region map */
  sourcePosition: { x: number; y: number };
  /** Position on target region map */
  targetPosition: { x: number; y: number };
}

// --- World Composer ---

/**
 * Compose the entire game world.
 *
 * This is the top-level entry point. Give it the DDL root path and
 * an archetype registry, get back a complete game world.
 */
export async function composeWorld(
  ddlRoot: string,
  registry: ArchetypeRegistry,
  options?: {
    /** Only compose specific regions (for incremental builds) */
    regions?: string[];
    /** Seed for deterministic generation */
    seed?: number;
  },
): Promise<ComposedWorld> {
  // --- 1. Load DDL ---
  const loaded = loadWorldDDL(ddlRoot);
  const { world, worldInstances, templates } = loaded;

  // --- 2. Determine which regions to compose ---
  const regionsToCompose = options?.regions
    ? world.regions.filter((r) => options.regions!.includes(r.id))
    : world.regions;

  // --- 3. Build region exit maps from connections ---
  const exitMap = buildExitMap(world.regionConnections, regionsToCompose);

  // --- 4. Compose each region ---
  const regionMaps = new Map<string, RegionMap>();

  for (const region of regionsToCompose) {
    const exits = exitMap.get(region.id) ?? [];
    const regionMap = await composeRegion(region, registry, {
      seed: options?.seed ? options.seed + hashString(region.id) : undefined,
      exits,
    });
    regionMaps.set(region.id, regionMap);
  }

  // --- 5. Build composed world instances ---
  const composedInstances = new Map<string, ComposedWorldInstance>();

  for (const [id, instance] of Array.from(worldInstances.entries())) {
    composedInstances.set(id, worldInstanceToComposed(instance, templates));
  }

  // --- 6. Resolve connections ---
  const connections = resolveConnections(world.regionConnections, regionMaps);

  return {
    name: world.name,
    startRegion: world.properties.startRegion,
    startAnchor: world.properties.startAnchor,
    regionMaps,
    worldInstances: composedInstances,
    connections,
  };
}

/**
 * Compose a single region (for incremental builds).
 */
export async function composeSingleRegion(
  ddlRoot: string,
  regionId: string,
  registry: ArchetypeRegistry,
): Promise<RegionMap> {
  const loaded = loadWorldDDL(ddlRoot);
  const region = loaded.world.regions.find((r) => r.id === regionId);
  if (!region) {
    throw new Error(`Region not found: ${regionId}`);
  }

  const exitMap = buildExitMap(loaded.world.regionConnections, [region]);
  return composeRegion(region, registry, {
    exits: exitMap.get(regionId) ?? [],
  });
}

// --- Helper functions ---

function buildExitMap(
  connections: RegionConnection[],
  regions: RegionDefinition[],
): Map<string, RegionExit[]> {
  const exitMap = new Map<string, RegionExit[]>();
  const regionIds = new Set(regions.map((r) => r.id));

  for (const conn of connections) {
    if (!regionIds.has(conn.from)) continue;

    const exits = exitMap.get(conn.from) ?? [];

    // Default positions based on direction
    const position = directionToEdgePosition(conn.direction ?? 'south', 100, 100);

    exits.push({
      direction: conn.direction ?? 'south',
      targetRegion: conn.to,
      position,
      condition: conn.condition,
    });

    exitMap.set(conn.from, exits);
  }

  return exitMap;
}

function directionToEdgePosition(
  direction: string,
  mapWidth: number,
  mapHeight: number,
): { x: number; y: number } {
  switch (direction) {
    case 'north':
      return { x: Math.floor(mapWidth / 2), y: 0 };
    case 'south':
      return { x: Math.floor(mapWidth / 2), y: mapHeight - 1 };
    case 'east':
      return { x: mapWidth - 1, y: Math.floor(mapHeight / 2) };
    case 'west':
      return { x: 0, y: Math.floor(mapHeight / 2) };
    default:
      return { x: Math.floor(mapWidth / 2), y: mapHeight - 1 };
  }
}

function resolveConnections(
  connections: RegionConnection[],
  regionMaps: Map<string, RegionMap>,
): ResolvedConnection[] {
  const resolved: ResolvedConnection[] = [];

  for (const conn of connections) {
    const sourceMap = regionMaps.get(conn.from);
    const targetMap = regionMaps.get(conn.to);

    // Use region exit positions if available, otherwise defaults
    const sourceExit = sourceMap?.regionExits.find((e) => e.targetRegion === conn.to);
    const targetExit = targetMap?.regionExits.find((e) => e.targetRegion === conn.from);

    resolved.push({
      fromRegion: conn.from,
      toRegion: conn.to,
      type: conn.connectionType,
      condition: conn.condition,
      sourcePosition: sourceExit?.position ?? { x: 50, y: 99 },
      targetPosition: targetExit?.position ?? { x: 50, y: 0 },
    });
  }

  return resolved;
}

function worldInstanceToComposed(
  instance: WorldInstance,
  templates: Map<string, WorldTemplate>,
): ComposedWorldInstance {
  return {
    id: instance.id,
    name: instance.name,
    templateId: instance.templateId,
    parentAnchor: instance.parentAnchor,
    slotValues: instance.slotValues,
    properties: instance.properties ?? {},
    template: templates.get(instance.templateId),
  };
}

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
