/**
 * Runtime map data types consumed by the MnemonicEngine at load time.
 *
 * These types define the JSON format written to data/maps/*.json.
 * The engine loads these directly — no TMX parsing at runtime.
 *
 * Semantic tile references (e.g., 'terrain:grass') are preserved;
 * GID resolution happens at runtime using the palette.
 */

import type { AssemblageObject, EventHook, SemanticTile } from '../types.ts';

// --- Visual objects ---

/** A visual object placed on the map (building, tree, prop). */
export interface RuntimeVisual {
  /** Semantic name referencing a palette object (e.g., 'building.house-red-1') */
  objectRef: string;
  /** Position in tiles */
  x: number;
  y: number;
}

// --- Spawn points ---

/** A named spawn point on the map. */
export interface RuntimeSpawnPoint {
  /** Spawn point ID (e.g., 'player-spawn', 'from-everwick') */
  id: string;
  /** Position in tiles */
  x: number;
  y: number;
}

// --- World transitions ---

/** A transition zone to another world/region. */
export interface RuntimeTransition {
  /** Transition ID (e.g., 'door-tavern', 'exit-frontier') */
  id: string;
  /** Position in tiles */
  x: number;
  y: number;
  /** Size in tiles */
  width: number;
  height: number;
  /** Target world or region ID */
  target: string;
  /** Transition type */
  type: 'door' | 'region' | 'encounter' | string;
  /** Additional properties */
  properties?: Record<string, string | number | boolean>;
}

// --- Vibrancy areas ---

/** A vibrancy area defining memory state for a map region. */
export interface RuntimeVibrancyArea {
  /** Area ID */
  id: string;
  /** Bounding rectangle in tiles */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Initial vibrancy state */
  initialState: 'forgotten' | 'partial' | 'remembered';
  /** Quest that unlocks this area (if any) */
  unlockQuest?: string;
}

// --- Main runtime map data ---

/** Runtime map data consumed by the MnemonicEngine at load time. */
export interface RuntimeMapData {
  /** Map ID (e.g., 'settled-lands', 'everwick') */
  id?: string;
  /** Canvas dimensions in tiles */
  width: number;
  height: number;
  /** Tile size in pixels */
  tileWidth: number;
  tileHeight: number;
  /** Layer names in render order (bottom to top) */
  layerOrder: string[];
  /** Each layer is a flat array of SemanticTile references (row-major). */
  layers: Record<string, SemanticTile[]>;
  /** Flat collision grid: 1 = blocked, 0 = passable. Length = width * height. */
  collision: (0 | 1)[];
  /** Visual objects (buildings, trees, props). */
  visuals: RuntimeVisual[];
  /** Event objects (NPCs, chests, transitions, triggers, spawns). */
  objects: AssemblageObject[];
  /** Event hooks for behavior wiring. */
  hooks: EventHook[];
  /** Extracted spawn points for quick lookup. */
  spawnPoints: RuntimeSpawnPoint[];
  /** Extracted world transitions for quick lookup. */
  transitions: RuntimeTransition[];
  /** Vibrancy areas (memory fog-of-war zones). */
  vibrancyAreas: RuntimeVibrancyArea[];
}
