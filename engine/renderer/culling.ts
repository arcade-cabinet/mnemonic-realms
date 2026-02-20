/**
 * Viewport culling for tile rendering.
 *
 * Pure math — no rendering, no React, no Skia.
 * Determines which tiles are visible within the camera viewport
 * and returns their screen positions for the Atlas draw call.
 */

import type { CameraState, TileLayerData, VisibleTile } from './types.js';

// ── Tile range calculation ──────────────────────────────────────────────────

/**
 * Compute the range of tile columns/rows visible in the viewport.
 * Adds a 1-tile margin on each side to avoid pop-in during scrolling.
 */
export function getVisibleTileRange(
  camera: CameraState,
  mapWidth: number,
  mapHeight: number,
  tileWidth: number,
  tileHeight: number,
): { startCol: number; endCol: number; startRow: number; endRow: number } {
  // Convert camera pixel position to tile coordinates
  const startCol = Math.max(0, Math.floor(camera.x / tileWidth) - 1);
  const startRow = Math.max(0, Math.floor(camera.y / tileHeight) - 1);

  // End tile = camera position + viewport size, plus 1-tile margin
  const endCol = Math.min(
    mapWidth - 1,
    Math.floor((camera.x + camera.viewportWidth) / tileWidth) + 1,
  );
  const endRow = Math.min(
    mapHeight - 1,
    Math.floor((camera.y + camera.viewportHeight) / tileHeight) + 1,
  );

  return { startCol, endCol, startRow, endRow };
}

// ── Visible tile extraction ─────────────────────────────────────────────────

/**
 * Extract visible tiles from a layer, applying viewport culling.
 *
 * Returns only tiles that:
 * 1. Fall within the camera viewport (with 1-tile margin)
 * 2. Have a non-zero GID (0 = empty/transparent)
 *
 * Screen positions are computed relative to the camera origin.
 *
 * @param layer - Tile layer data (flat array, row-major)
 * @param mapWidth - Map width in tiles
 * @param mapHeight - Map height in tiles
 * @param tileWidth - Tile width in pixels
 * @param tileHeight - Tile height in pixels
 * @param camera - Camera state (position + viewport)
 * @returns Array of visible tiles with screen positions
 */
export function getVisibleTiles(
  layer: TileLayerData,
  mapWidth: number,
  mapHeight: number,
  tileWidth: number,
  tileHeight: number,
  camera: CameraState,
): VisibleTile[] {
  const { startCol, endCol, startRow, endRow } = getVisibleTileRange(
    camera,
    mapWidth,
    mapHeight,
    tileWidth,
    tileHeight,
  );

  const result: VisibleTile[] = [];

  for (let row = startRow; row <= endRow; row++) {
    const rowOffset = row * mapWidth;
    const screenY = row * tileHeight - camera.y;

    for (let col = startCol; col <= endCol; col++) {
      const gid = layer.tiles[rowOffset + col];

      // Skip empty tiles
      if (gid === 0) continue;

      result.push({
        gid,
        screenX: col * tileWidth - camera.x,
        screenY,
      });
    }
  }

  return result;
}

// ── Atlas source rect calculation ───────────────────────────────────────────

/**
 * Compute the source rectangle (x, y, width, height) within the atlas
 * texture for a given tile GID.
 *
 * @param gid - Tile GID (1-based; 0 is empty)
 * @param atlasColumns - Number of tile columns in the atlas image
 * @param tileWidth - Tile width in pixels
 * @param tileHeight - Tile height in pixels
 * @param firstGid - First GID in this tileset (default 1)
 * @returns Source rect { x, y, width, height } in the atlas
 */
export function getTileSourceRect(
  gid: number,
  atlasColumns: number,
  tileWidth: number,
  tileHeight: number,
  firstGid = 1,
): { x: number; y: number; width: number; height: number } {
  const localId = gid - firstGid;
  const col = localId % atlasColumns;
  const row = Math.floor(localId / atlasColumns);

  return {
    x: col * tileWidth,
    y: row * tileHeight,
    width: tileWidth,
    height: tileHeight,
  };
}
