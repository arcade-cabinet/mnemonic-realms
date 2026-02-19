/**
 * Core types for the assemblage map composition system.
 *
 * Assemblages are reusable building blocks (house, shop, forest border, etc.)
 * that get stamped onto a multi-layer map canvas. The canvas resolves semantic
 * tile names to actual tile IDs via a TilesetPalette, then serializes to TMX.
 */

// --- Semantic tile references ---

/**
 * A semantic tile reference, resolved by the palette at serialization time.
 * Format: 'terrain:<name>' for auto-tiled terrains, 'fixed:<name>' for static tiles,
 * 'object:<name>' for object tiles, or 0 for empty/transparent.
 */
export type SemanticTile = string | 0;

/** A rectangular grid of semantic tiles for one layer. Row-major order. */
export interface TileStamp {
  width: number;
  height: number;
  /** Row-major tile data. Length = width * height. */
  tiles: SemanticTile[];
}

// --- Collision ---

/** A rectangular grid of collision flags. 1 = blocked, 0 = passable. */
export interface CollisionStamp {
  width: number;
  height: number;
  /** Row-major collision data. Length = width * height. */
  data: (0 | 1)[];
}

// --- Visual objects (buildings, trees, props) ---

/**
 * A visual object placed in a TMX object group.
 * These are tileset images (buildings, trees, props) positioned at pixel coords.
 * Unlike tile layers, these can be any size and aren't grid-aligned.
 */
export interface VisualObject {
  /** Semantic name referencing a palette object (e.g., 'building.house-red-1') */
  objectRef: string;
  /** Position relative to assemblage origin (in tiles, converted to pixels at serialization) */
  x: number;
  y: number;
}

// --- Events and hooks ---

/** A TMX object (NPC, chest, transition zone, trigger) */
export interface AssemblageObject {
  /** Unique name within the assemblage (e.g., 'keeper-npc', 'door-south') */
  name: string;
  /** Object type for RPG-JS event system */
  type: 'npc' | 'chest' | 'transition' | 'trigger' | 'spawn';
  /** Position relative to assemblage origin (in tiles) */
  x: number;
  y: number;
  /** Size in tiles (default 1x1) */
  width?: number;
  height?: number;
  /** Custom properties passed to the event handler */
  properties?: Record<string, string | number | boolean>;
}

/** TypeScript event behavior definition */
export interface EventHook {
  /** Which object this hook attaches to (by name) */
  objectName: string;
  /** RPG-JS event class to use or generate */
  eventClass: string;
  /** Import path for the event class (if hand-authored) */
  importPath?: string;
  /** Inline behavior configuration (for generated events) */
  config?: Record<string, unknown>;
}

// --- Assemblage definition ---

/** An anchor point on an assemblage for connecting paths or other assemblages */
export interface Anchor {
  name: string;
  /** Position relative to assemblage origin (in tiles) */
  x: number;
  y: number;
}

/**
 * Complete assemblage definition — a reusable building block.
 *
 * Assemblages are composed of named layers matching the TMX layer structure.
 * Each layer is a TileStamp. Transparent (0) tiles don't overwrite the canvas.
 */
export interface AssemblageDefinition {
  /** Unique assemblage ID (e.g., 'house-red', 'fountain', 'forest-border-north') */
  id: string;
  /** Human-readable description */
  description: string;
  /** Size in tiles */
  width: number;
  height: number;
  /** Named layer stamps. Keys match TMX layer names (ground, road, water, etc.) */
  layers: Record<string, TileStamp>;
  /** Collision data for this assemblage */
  collision?: CollisionStamp;
  /** Visual objects — buildings, trees, props placed in TMX object groups */
  visuals?: VisualObject[];
  /** Event objects (NPCs, chests, transitions) */
  objects?: AssemblageObject[];
  /** Event hooks for generated TypeScript code */
  hooks?: EventHook[];
  /** Named anchor points for connecting paths and other assemblages */
  anchors?: Anchor[];
}

// --- Map composition ---

/** An assemblage placed at a specific position on the map canvas */
export interface PlacedAssemblage {
  /** Reference to the assemblage definition */
  assemblage: AssemblageDefinition;
  /** Top-left position on the map canvas (in tiles) */
  x: number;
  y: number;
}

/** A path connecting two points on the map (road, river, etc.) */
export interface PathSegment {
  /** Terrain type for auto-tiling (e.g., 'road', 'road.brick') */
  terrain: string;
  /** Layer to draw on (e.g., 'road') */
  layer: string;
  /** Path width in tiles */
  width: number;
  /** Waypoints (in tile coordinates). Path follows these points in order. */
  points: { x: number; y: number }[];
}

/** Complete map definition composed from assemblages, paths, and objects */
export interface MapComposition {
  /** Map ID (used for filenames, e.g., 'everwick') */
  id: string;
  /** Human-readable name */
  name: string;
  /** Canvas dimensions in tiles */
  width: number;
  height: number;
  /** Tile size in pixels */
  tileWidth: number;
  tileHeight: number;
  /** Palette name to use for tile resolution */
  paletteName: string;
  /** Default ground terrain (fills entire ground layer before stamping) */
  defaultGround: string;
  /** Layer names in render order (bottom to top) */
  layers: string[];
  /** Placed assemblages */
  placements: PlacedAssemblage[];
  /** Paths connecting locations */
  paths?: PathSegment[];
  /** Map-level visual objects (buildings, trees not in assemblages) */
  visuals?: VisualObject[];
  /** Map-level objects not part of any assemblage (e.g., player spawn) */
  objects?: AssemblageObject[];
  /** Map-level event hooks */
  hooks?: EventHook[];
}
