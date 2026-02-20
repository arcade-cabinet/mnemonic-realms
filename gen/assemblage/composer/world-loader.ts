/**
 * World DDL Loader — Assembles Split JSON Files
 *
 * The world DDL is split across multiple files:
 *   gen/ddl/world.json           — Top-level (name, properties, region refs, connections)
 *   gen/ddl/regions/*.json       — One per region (biome, anchors, tissue, time budget)
 *   gen/ddl/worlds/*.json        — One per world instance (template + slot config)
 *   gen/ddl/templates/*.json     — World templates (layout shape definitions)
 *
 * This loader reads world.json, resolves all region refs to full RegionDefinitions,
 * and loads all world instances from the worlds/ directory.
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
import type { WorldInstance, WorldSlot, WorldTemplate } from './world-template';

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

// --- Loaded world (fully resolved) ---

export interface LoadedWorld {
  /** Fully resolved world definition */
  world: WorldDefinition;
  /** All world instances keyed by ID */
  worldInstances: Map<string, WorldInstance>;
  /** All world templates keyed by ID */
  templates: Map<string, WorldTemplate>;
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

  // --- 3. Load all world instance JSONs ---
  const worldsDir = join(ddlRoot, 'worlds');
  const worldInstances = new Map<string, WorldInstance>();

  let worldFiles: string[];
  try {
    worldFiles = readdirSync(worldsDir).filter((f) => f.endsWith('.json'));
  } catch {
    worldFiles = [];
  }

  for (const file of worldFiles) {
    const instanceData: WorldInstance = JSON.parse(readFileSync(join(worldsDir, file), 'utf-8'));
    worldInstances.set(instanceData.id, instanceData);
  }

  // --- 4. Load all template JSONs ---
  const templatesDir = join(ddlRoot, 'templates');
  const templates = new Map<string, WorldTemplate>();

  let templateFiles: string[];
  try {
    templateFiles = readdirSync(templatesDir).filter((f) => f.endsWith('.json'));
  } catch {
    templateFiles = [];
  }

  for (const file of templateFiles) {
    const templateData: WorldTemplate = JSON.parse(readFileSync(join(templatesDir, file), 'utf-8'));
    templates.set(templateData.id, templateData);
  }

  // --- 5. Assemble WorldDefinition ---
  const world: WorldDefinition = {
    name: worldFile.name,
    properties: worldFile.properties,
    regions,
    regionConnections: worldFile.regionConnections,
  };

  return { world, worldInstances, templates };
}

/**
 * Get all world slot instance IDs referenced by an anchor.
 */
export function getAnchorWorldSlotIds(anchor: AnchorDefinition): string[] {
  const ids: string[] = [];

  // Direct world slots on the anchor
  if (Array.isArray(anchor.worldSlots)) {
    ids.push(...anchor.worldSlots.map((s: WorldSlot) => s.instanceId));
  }

  // Dungeon floor world slots
  if (anchor.dungeon?.worldSlots) {
    ids.push(...anchor.dungeon.worldSlots.map((s: WorldSlot) => s.instanceId));
  }

  return ids;
}
