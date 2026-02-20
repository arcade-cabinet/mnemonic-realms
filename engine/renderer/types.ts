/**
 * Renderer-specific types for the Skia tile renderer.
 *
 * These types decouple the renderer from the map loader (US-004).
 * The loader will produce data matching these interfaces; the renderer
 * consumes them without knowing how they were loaded.
 */

// ── Tile layer data ─────────────────────────────────────────────────────────

/**
 * A single tile layer ready for rendering.
 * Row-major flat array of numeric tile IDs (GIDs).
 * 0 = empty/transparent (skip rendering).
 */
export interface TileLayerData {
  /** Layer name (e.g., 'ground', 'road', 'water', 'objects', 'above') */
  name: string;
  /** Flat array of tile GIDs, row-major. Length = mapWidth * mapHeight. */
  tiles: number[];
}

// ── Atlas configuration ─────────────────────────────────────────────────────

/**
 * Configuration for a tileset atlas image.
 * Maps numeric GIDs to source rectangles within the atlas texture.
 */
export interface TileAtlasConfig {
  /** Tile width in pixels (always 16 for this project) */
  tileWidth: number;
  /** Tile height in pixels (always 16 for this project) */
  tileHeight: number;
  /** Number of tile columns in the atlas image */
  columns: number;
  /** First GID in this tileset (for multi-tileset support) */
  firstGid: number;
  /** Total number of tiles in this tileset */
  tileCount: number;
}

// ── Camera state ────────────────────────────────────────────────────────────

/** Camera position and viewport dimensions in pixels. */
export interface CameraState {
  /** Camera X position in world pixels (top-left of viewport) */
  x: number;
  /** Camera Y position in world pixels (top-left of viewport) */
  y: number;
  /** Viewport width in pixels */
  viewportWidth: number;
  /** Viewport height in pixels */
  viewportHeight: number;
}

// ── Visible tile output ─────────────────────────────────────────────────────

/** A tile that passed viewport culling and should be rendered. */
export interface VisibleTile {
  /** Tile GID (index into the atlas) */
  gid: number;
  /** Screen X position in pixels (after camera offset) */
  screenX: number;
  /** Screen Y position in pixels (after camera offset) */
  screenY: number;
}

// ── Tile map props ──────────────────────────────────────────────────────────

/** Props for the TileRenderer component. */
export interface TileRendererProps {
  /** Ordered tile layers (bottom to top) */
  layers: TileLayerData[];
  /** Map width in tiles */
  mapWidth: number;
  /** Map height in tiles */
  mapHeight: number;
  /** Tile width in pixels */
  tileWidth: number;
  /** Tile height in pixels */
  tileHeight: number;
  /** Camera state (position + viewport) */
  camera: CameraState;
  /** Atlas configuration for GID → source rect mapping */
  atlas: TileAtlasConfig;
}

// ── Constants ───────────────────────────────────────────────────────────────

/** Default tile size in pixels for this project. */
export const TILE_SIZE = 16;

/** Default map dimensions in tiles. */
export const DEFAULT_MAP_SIZE = 60;

/** Default map dimensions in pixels. */
export const DEFAULT_MAP_PIXELS = DEFAULT_MAP_SIZE * TILE_SIZE; // 960
