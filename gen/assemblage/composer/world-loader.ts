/**
 * World DDL Loader — Assembles Split JSON Files
 *
 * The world DDL is split across multiple files for DRY:
 *   gen/ddl/world.json           — Top-level (name, properties, region refs, connections)
 *   gen/ddl/regions/*.json       — One per region (biome, anchors, tissue, time budget)
 *   gen/ddl/interiors/*.json     — One per interior (archetype, NPCs, objects, transitions)
 *
 * This loader reads world.json, resolves all region refs to full RegionDefinitions,
 * and resolves all interior refs to full InteriorDefinitions.
 *
 * Architecture level: DDL I/O
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  AnchorDefinition,
  RegionConnection,
  RegionDefinition,
  WorldDefinition,
} from './world-ddl';

// --- File-level types (match the JSON shape) ---

/** world.json shape — regions are string IDs, not full objects */
interface WorldFile {
  name: string;
  properties: {
    startRegion: string;
    startAnchor: string;
    vibrancySystem: boolean;
  };
  regions: string[];
  regionConnections: RegionConnection[];
}

/** Interior JSON with transition info */
export interface InteriorFile {
  id: string;
  name: string;
  archetype: string;
  parentAnchor: string;
  floor?: number;
  theme?: string;
  npcs?: Array<{ id: string; role: string; placement: string }>;
  objects?: string[];
  enemies?: string[];
  boss?: string;
  transitions?: Record<string, { to: string; type: string }>;
}

// --- Loaded world (fully resolved) ---

export interface LoadedWorld {
  /** Fully resolved world definition */
  world: WorldDefinition;
  /** All interior definitions keyed by ID */
  interiors: Map<string, InteriorFile>;
}

/**
 * Load the complete world DDL from split JSON files.
 *
 * @param ddlRoot Path to gen/ddl/ directory
 */
export function loadWorldDDL(ddlRoot: string): LoadedWorld {
  // --- 1. Load world.json ---
  const worldPath = join(ddlRoot, 'world.json');
  const worldFile: WorldFile = JSON.parse(readFileSync(worldPath, 'utf-8'));

  // --- 2. Load all region JSONs ---
  const regionsDir = join(ddlRoot, 'regions');
  const regions: RegionDefinition[] = [];

  for (const regionId of worldFile.regions) {
    const regionPath = join(regionsDir, `${regionId}.json`);
    const regionData: RegionDefinition = JSON.parse(readFileSync(regionPath, 'utf-8'));
    regions.push(regionData);
  }

  // --- 3. Load all interior JSONs ---
  const interiorsDir = join(ddlRoot, 'interiors');
  const interiors = new Map<string, InteriorFile>();

  let files: string[];
  try {
    files = readdirSync(interiorsDir).filter((f) => f.endsWith('.json'));
  } catch {
    files = [];
  }

  for (const file of files) {
    const interiorData: InteriorFile = JSON.parse(readFileSync(join(interiorsDir, file), 'utf-8'));
    interiors.set(interiorData.id, interiorData);
  }

  // --- 4. Assemble WorldDefinition ---
  const world: WorldDefinition = {
    name: worldFile.name,
    properties: worldFile.properties,
    regions,
    regionConnections: worldFile.regionConnections,
  };

  return { world, interiors };
}

/**
 * Get all interior IDs referenced by an anchor.
 */
export function getAnchorInteriorIds(anchor: AnchorDefinition): string[] {
  const ids: string[] = [];

  // Direct interiors on the anchor
  if (Array.isArray(anchor.interiors)) {
    ids.push(...anchor.interiors);
  }

  // Dungeon floors
  if (anchor.dungeon?.interiors) {
    ids.push(...anchor.dungeon.interiors);
  }

  return ids;
}
