/**
 * Map Loader — RuntimeMapData JSON → LoadedMap
 *
 * Converts runtime JSON (produced by gen/assemblage/pipeline/runtime-serializer)
 * into engine-ready data structures:
 * - Tile layers as Uint16Array (flat, row-major, for fast Skia Atlas rendering)
 * - Collision grid as Uint8Array
 * - Entity descriptors for behavioral objects (NPCs, chests, transitions, etc.)
 *
 * Tiles are NOT entities — 3600+ tiles per 60×60 map stay as typed arrays.
 * Only behavioral objects (20-50 per map) become entity descriptors.
 */

import type {
  RuntimeMapData,
  RuntimeSpawnPoint,
  RuntimeTransition,
  RuntimeVibrancyArea,
} from '../../gen/assemblage/pipeline/runtime-types.js';
import type { AssemblageObject, EventHook } from '../../gen/assemblage/types.js';

// ── Entity descriptor types ─────────────────────────────────────────────────

export type EntityType = 'npc' | 'chest' | 'transition' | 'trigger' | 'resonance-stone';

/** Descriptor for an entity to be spawned into the ECS world. */
export interface EntityDescriptor {
  /** Entity type determines which traits to attach */
  type: EntityType;
  /** Unique name within the map */
  name: string;
  /** Position in tiles */
  x: number;
  y: number;
  /** Size in tiles (for area triggers/transitions) */
  width: number;
  height: number;
  /** Custom properties from the assemblage object */
  properties: Record<string, string | number | boolean>;
  /** Associated event hook (if any) */
  hook?: EventHook;
}

// ── Loaded map structure ────────────────────────────────────────────────────

/** Processed map data ready for the engine. */
export interface LoadedMap {
  /** Map ID */
  id: string;
  /** Dimensions in tiles */
  width: number;
  height: number;
  /** Tile size in pixels */
  tileWidth: number;
  tileHeight: number;
  /** Layer names in render order (bottom to top) */
  layerOrder: string[];
  /**
   * Tile layers as Uint16Array (row-major).
   * Semantic tile strings are mapped to numeric indices via a string table.
   * Index 0 = empty/transparent.
   */
  layers: Map<string, Uint16Array>;
  /** String table: index → semantic tile string. Index 0 is always '' (empty). */
  tileStringTable: string[];
  /** Collision grid: 1 = blocked, 0 = passable. Length = width * height. */
  collision: Uint8Array;
  /** Entity descriptors for behavioral objects */
  entities: EntityDescriptor[];
  /** Spawn points (data only, not entities) */
  spawnPoints: RuntimeSpawnPoint[];
  /** Vibrancy areas (fog-of-war zones) */
  vibrancyAreas: RuntimeVibrancyArea[];
  /** Raw transitions for quick lookup */
  transitions: RuntimeTransition[];
}

/** Build a string table mapping semantic tile strings to numeric indices. */
function buildStringTable(json: RuntimeMapData): {
  tileToIndex: Map<string | 0, number>;
  tileStringTable: string[];
} {
  const tileToIndex = new Map<string | 0, number>();
  tileToIndex.set(0, 0);
  tileToIndex.set('', 0);
  const tileStringTable: string[] = [''];

  for (const layerName of json.layerOrder) {
    const layerData = json.layers[layerName];
    if (!layerData) continue;
    for (const tile of layerData) {
      if (tile === 0 || tile === '') continue;
      if (!tileToIndex.has(tile)) {
        tileToIndex.set(tile, tileStringTable.length);
        tileStringTable.push(tile);
      }
    }
  }

  return { tileToIndex, tileStringTable };
}

/** Convert semantic tile layers to Uint16Array using the string table. */
function convertLayers(
  json: RuntimeMapData,
  tileCount: number,
  tileToIndex: Map<string | 0, number>,
): Map<string, Uint16Array> {
  const layers = new Map<string, Uint16Array>();
  for (const layerName of json.layerOrder) {
    const layerData = json.layers[layerName];
    const arr = new Uint16Array(tileCount);
    if (layerData) {
      for (let i = 0; i < tileCount && i < layerData.length; i++) {
        arr[i] = tileToIndex.get(layerData[i]) ?? 0;
      }
    }
    layers.set(layerName, arr);
  }
  return layers;
}

/** Convert collision array to Uint8Array. */
function convertCollision(json: RuntimeMapData, tileCount: number): Uint8Array {
  const collision = new Uint8Array(tileCount);
  for (let i = 0; i < tileCount && i < json.collision.length; i++) {
    collision[i] = json.collision[i];
  }
  return collision;
}

/** Extract entity descriptors from assemblage objects, attaching hooks. */
function extractEntities(json: RuntimeMapData): EntityDescriptor[] {
  const hooksByName = new Map<string, EventHook>();
  for (const hook of json.hooks) {
    hooksByName.set(hook.objectName, hook);
  }

  const entities: EntityDescriptor[] = [];
  for (const obj of json.objects) {
    if (obj.type === 'spawn') continue;
    const entityType = mapObjectTypeToEntityType(obj);
    if (!entityType) continue;
    entities.push({
      type: entityType,
      name: obj.name,
      x: obj.x,
      y: obj.y,
      width: obj.width ?? 1,
      height: obj.height ?? 1,
      properties: obj.properties ?? {},
      hook: hooksByName.get(obj.name),
    });
  }
  return entities;
}

/**
 * Load runtime map JSON into engine-ready data structures.
 *
 * Converts semantic tile strings to numeric indices via a string table,
 * packs tile layers into Uint16Array, collision into Uint8Array,
 * and extracts entity descriptors for behavioral objects.
 */
export function loadMapData(json: RuntimeMapData): LoadedMap {
  const { width, height } = json;
  const tileCount = width * height;
  const { tileToIndex, tileStringTable } = buildStringTable(json);

  return {
    id: json.id ?? '',
    width,
    height,
    tileWidth: json.tileWidth,
    tileHeight: json.tileHeight,
    layerOrder: [...json.layerOrder],
    layers: convertLayers(json, tileCount, tileToIndex),
    tileStringTable,
    collision: convertCollision(json, tileCount),
    entities: extractEntities(json),
    spawnPoints: json.spawnPoints,
    vibrancyAreas: json.vibrancyAreas,
    transitions: json.transitions,
  };
}

/** Map AssemblageObject type to EntityDescriptor type. */
function mapObjectTypeToEntityType(obj: AssemblageObject): EntityType | null {
  switch (obj.type) {
    case 'npc':
      // Check if it's a resonance stone via properties
      if (obj.properties?.subtype === 'resonance-stone') return 'resonance-stone';
      return 'npc';
    case 'chest':
      return 'chest';
    case 'transition':
      return 'transition';
    case 'trigger':
      return 'trigger';
    default:
      return null;
  }
}
