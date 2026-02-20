import { describe, it, expect } from 'vitest';
import {
  getVisibleTileRange,
  getVisibleTiles,
  getTileSourceRect,
} from '../../../../engine/renderer/culling.js';
import type {
  CameraState,
  TileLayerData,
} from '../../../../engine/renderer/types.js';

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Create a camera at given position with given viewport. */
function cam(x: number, y: number, vw: number, vh: number): CameraState {
  return { x, y, viewportWidth: vw, viewportHeight: vh };
}

/** Create a tile layer with given tiles. */
function layer(name: string, tiles: number[]): TileLayerData {
  return { name, tiles };
}

// ── getVisibleTileRange ─────────────────────────────────────────────────────

describe('getVisibleTileRange', () => {
  it('returns full range when camera covers entire map', () => {
    // 4x4 map, 16px tiles, camera at (0,0) with 64x64 viewport
    const range = getVisibleTileRange(cam(0, 0, 64, 64), 4, 4, 16, 16);
    expect(range.startCol).toBe(0);
    expect(range.startRow).toBe(0);
    expect(range.endCol).toBe(3);
    expect(range.endRow).toBe(3);
  });

  it('clamps to map bounds', () => {
    // Camera at origin, 1-tile margin would go to -1 but clamps to 0
    const range = getVisibleTileRange(cam(0, 0, 32, 32), 4, 4, 16, 16);
    expect(range.startCol).toBe(0);
    expect(range.startRow).toBe(0);
    // viewport covers 2 tiles + 1 margin = col 2, clamped to 3
    expect(range.endCol).toBe(3);
    expect(range.endRow).toBe(3);
  });

  it('offsets range when camera is scrolled', () => {
    // 60x60 map, camera at (160, 240) with 320x240 viewport
    const range = getVisibleTileRange(cam(160, 240, 320, 240), 60, 60, 16, 16);
    // startCol = floor(160/16) - 1 = 10 - 1 = 9
    expect(range.startCol).toBe(9);
    // startRow = floor(240/16) - 1 = 15 - 1 = 14
    expect(range.startRow).toBe(14);
    // endCol = floor((160+320)/16) + 1 = 30 + 1 = 31
    expect(range.endCol).toBe(31);
    // endRow = floor((240+240)/16) + 1 = 30 + 1 = 31
    expect(range.endRow).toBe(31);
  });

  it('clamps end to map bounds when camera is near edge', () => {
    // Camera near bottom-right of 10x10 map
    const range = getVisibleTileRange(cam(128, 128, 64, 64), 10, 10, 16, 16);
    // endCol = floor((128+64)/16) + 1 = 12 + 1 = 13, clamped to 9
    expect(range.endCol).toBe(9);
    expect(range.endRow).toBe(9);
  });
});

// ── getVisibleTiles ─────────────────────────────────────────────────────────

describe('getVisibleTiles', () => {
  it('returns only non-zero tiles within viewport', () => {
    // 4x4 map with some empty tiles
    // prettier-ignore
    const tiles = [
      1, 2, 0, 0,
      3, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 4,
    ];
    const result = getVisibleTiles(
      layer('ground', tiles),
      4, 4, 16, 16,
      cam(0, 0, 64, 64),
    );
    // Should find tiles 1, 2, 3, 4 (all non-zero)
    expect(result).toHaveLength(4);
    expect(result.map((t) => t.gid)).toEqual([1, 2, 3, 4]);
  });

  it('computes correct screen positions', () => {
    // prettier-ignore
    const tiles = [
      1, 2,
      3, 4,
    ];
    const result = getVisibleTiles(
      layer('ground', tiles),
      2, 2, 16, 16,
      cam(0, 0, 32, 32),
    );
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ gid: 1, screenX: 0, screenY: 0 });
    expect(result[1]).toEqual({ gid: 2, screenX: 16, screenY: 0 });
    expect(result[2]).toEqual({ gid: 3, screenX: 0, screenY: 16 });
    expect(result[3]).toEqual({ gid: 4, screenX: 16, screenY: 16 });
  });

  it('offsets screen positions by camera', () => {
    // prettier-ignore
    const tiles = [
      1, 2,
      3, 4,
    ];
    const result = getVisibleTiles(
      layer('ground', tiles),
      2, 2, 16, 16,
      cam(8, 4, 32, 32),
    );
    // Tile (0,0) at screen (0*16 - 8, 0*16 - 4) = (-8, -4)
    expect(result[0]).toEqual({ gid: 1, screenX: -8, screenY: -4 });
    // Tile (1,0) at screen (1*16 - 8, 0*16 - 4) = (8, -4)
    expect(result[1]).toEqual({ gid: 2, screenX: 8, screenY: -4 });
  });

  it('culls tiles outside viewport on large map', () => {
    // 10x10 map, camera viewing only center portion
    const tiles = new Array(100).fill(0).map((_, i) => i + 1);
    const result = getVisibleTiles(
      layer('ground', tiles),
      10, 10, 16, 16,
      // Camera at (64, 64) with 32x32 viewport
      // Visible range: cols 3-6, rows 3-6 (with margin)
      cam(64, 64, 32, 32),
    );
    // Should NOT include tiles from row 0-1 or col 0-1
    const hasTopLeft = result.some((t) => t.gid === 1); // tile at (0,0)
    expect(hasTopLeft).toBe(false);
    // Should include tiles in the visible range
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(100);
  });

  it('returns empty array for all-zero layer', () => {
    const tiles = new Array(16).fill(0);
    const result = getVisibleTiles(
      layer('empty', tiles),
      4, 4, 16, 16,
      cam(0, 0, 64, 64),
    );
    expect(result).toHaveLength(0);
  });
});

// ── getTileSourceRect ───────────────────────────────────────────────────────

describe('getTileSourceRect', () => {
  it('maps GID 1 to top-left of atlas', () => {
    const src = getTileSourceRect(1, 10, 16, 16, 1);
    expect(src).toEqual({ x: 0, y: 0, width: 16, height: 16 });
  });

  it('maps GID to correct column and row', () => {
    // GID 5 with 4 columns: localId=4, col=0, row=1
    const src = getTileSourceRect(5, 4, 16, 16, 1);
    expect(src).toEqual({ x: 0, y: 16, width: 16, height: 16 });
  });

  it('handles non-1 firstGid', () => {
    // GID 11 with firstGid=10: localId=1, col=1, row=0
    const src = getTileSourceRect(11, 10, 16, 16, 10);
    expect(src).toEqual({ x: 16, y: 0, width: 16, height: 16 });
  });

  it('wraps columns correctly', () => {
    // 8 columns, GID 9 (localId=8): col=0, row=1
    const src = getTileSourceRect(9, 8, 16, 16, 1);
    expect(src).toEqual({ x: 0, y: 16, width: 16, height: 16 });
  });

  it('handles large GIDs', () => {
    // 10 columns, GID 25 (localId=24): col=4, row=2
    const src = getTileSourceRect(25, 10, 16, 16, 1);
    expect(src).toEqual({ x: 64, y: 32, width: 16, height: 16 });
  });
});

