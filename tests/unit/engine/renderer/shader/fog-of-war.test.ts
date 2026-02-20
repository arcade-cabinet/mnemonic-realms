import { describe, expect, it } from 'vitest';
import type { VibrancyMap } from '../../../../../engine/ecs/systems/vibrancy.js';
import type { CameraState } from '../../../../../engine/renderer/types.js';
import {
  MAX_GRID_SIZE,
  VIBRANCY_VALUES,
  buildFogPixelData,
  buildFogUniforms,
  buildVibrancyGrid,
} from '../../../../../engine/renderer/shader/fog-of-war.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function cam(x: number, y: number, vw: number, vh: number): CameraState {
  return { x, y, viewportWidth: vw, viewportHeight: vh };
}

function makeMap(areas: VibrancyMap['areas']): VibrancyMap {
  return { areas };
}

// ── buildVibrancyGrid ────────────────────────────────────────────────────────

describe('buildVibrancyGrid', () => {
  it('returns all 1.0 (remembered) for empty vibrancy map', () => {
    const grid = buildVibrancyGrid(makeMap([]), 10, 10);
    expect(grid).toHaveLength(100);
    expect(grid.every((v) => v === 1.0)).toBe(true);
  });

  it('marks forgotten area tiles as 0.0', () => {
    const map = makeMap([
      { id: 'dark-zone', x: 2, y: 3, width: 3, height: 2, state: 'forgotten' },
    ]);
    const grid = buildVibrancyGrid(map, 10, 10);

    // Tile (2,3) should be forgotten
    expect(grid[3 * 10 + 2]).toBe(0.0);
    // Tile (4,4) should be forgotten (last tile in area)
    expect(grid[4 * 10 + 4]).toBe(0.0);
    // Tile (0,0) should be remembered (default)
    expect(grid[0]).toBe(1.0);
    // Tile (5,3) should be remembered (outside area)
    expect(grid[3 * 10 + 5]).toBe(1.0);
  });

  it('marks partial area tiles as 0.5', () => {
    const map = makeMap([
      { id: 'haze-zone', x: 0, y: 0, width: 2, height: 2, state: 'partial' },
    ]);
    const grid = buildVibrancyGrid(map, 5, 5);

    expect(grid[0]).toBe(0.5);
    expect(grid[1]).toBe(0.5);
    expect(grid[5]).toBe(0.5);
    expect(grid[6]).toBe(0.5);
    // Outside area
    expect(grid[2]).toBe(1.0);
  });

  it('marks remembered area tiles as 1.0', () => {
    const map = makeMap([
      { id: 'clear-zone', x: 0, y: 0, width: 3, height: 3, state: 'remembered' },
    ]);
    const grid = buildVibrancyGrid(map, 5, 5);
    // All tiles should be 1.0 (remembered is the default AND the area state)
    expect(grid.every((v) => v === 1.0)).toBe(true);
  });

  it('clamps to MAX_GRID_SIZE', () => {
    const grid = buildVibrancyGrid(makeMap([]), 200, 200);
    expect(grid).toHaveLength(MAX_GRID_SIZE * MAX_GRID_SIZE);
  });

  it('handles overlapping areas (last area wins)', () => {
    const map = makeMap([
      { id: 'big', x: 0, y: 0, width: 5, height: 5, state: 'forgotten' },
      { id: 'small', x: 1, y: 1, width: 2, height: 2, state: 'partial' },
    ]);
    const grid = buildVibrancyGrid(map, 5, 5);

    // Corner of big area: forgotten
    expect(grid[0]).toBe(0.0);
    // Inside small area: partial (overwrites forgotten)
    expect(grid[1 * 5 + 1]).toBe(0.5);
    expect(grid[2 * 5 + 2]).toBe(0.5);
  });

  it('clips areas that extend beyond map bounds', () => {
    const map = makeMap([
      { id: 'overflow', x: 8, y: 8, width: 10, height: 10, state: 'forgotten' },
    ]);
    const grid = buildVibrancyGrid(map, 10, 10);
    // Tile (8,8) and (9,9) should be forgotten
    expect(grid[8 * 10 + 8]).toBe(0.0);
    expect(grid[9 * 10 + 9]).toBe(0.0);
    // Grid should still be 10×10
    expect(grid).toHaveLength(100);
  });
});

// ── buildFogPixelData ────────────────────────────────────────────────────────

describe('buildFogPixelData', () => {
  it('converts grid values to RGBA bytes', () => {
    const grid = [0.0, 0.5, 1.0, 0.0];
    const pixels = buildFogPixelData(grid, 2, 2);

    expect(pixels).toHaveLength(16); // 4 pixels × 4 bytes
    // First pixel: forgotten (0)
    expect(pixels[0]).toBe(0);
    expect(pixels[3]).toBe(255); // alpha always 255
    // Second pixel: partial (128)
    expect(pixels[4]).toBe(128);
    expect(pixels[7]).toBe(255);
    // Third pixel: remembered (255)
    expect(pixels[8]).toBe(255);
    expect(pixels[11]).toBe(255);
  });

  it('produces uniform RGB channels', () => {
    const grid = [0.5];
    const pixels = buildFogPixelData(grid, 1, 1);
    expect(pixels[0]).toBe(pixels[1]); // R === G
    expect(pixels[1]).toBe(pixels[2]); // G === B
  });
});

// ── buildFogUniforms ─────────────────────────────────────────────────────────

describe('buildFogUniforms', () => {
  it('produces correct scalar uniforms', () => {
    const map = makeMap([
      { id: 'a', x: 0, y: 0, width: 5, height: 5, state: 'remembered' },
    ]);
    const camera = cam(100, 200, 320, 240);
    const uniforms = buildFogUniforms(map, camera, 60, 60);

    expect(uniforms.uResolution).toEqual([320, 240]);
    expect(uniforms.uCameraOffset).toEqual([100, 200]);
    expect(uniforms.uTileSize).toBe(16);
    expect(uniforms.uGridSize).toEqual([60, 60]);
    expect(uniforms.uTransition).toBe(1.0);
  });

  it('clamps grid size to MAX_GRID_SIZE', () => {
    const uniforms = buildFogUniforms(makeMap([]), cam(0, 0, 320, 240), 100, 100);
    expect(uniforms.uGridSize).toEqual([MAX_GRID_SIZE, MAX_GRID_SIZE]);
  });

  it('clamps transition to [0, 1]', () => {
    const u1 = buildFogUniforms(makeMap([]), cam(0, 0, 320, 240), 10, 10, -0.5);
    expect(u1.uTransition).toBe(0);

    const u2 = buildFogUniforms(makeMap([]), cam(0, 0, 320, 240), 10, 10, 1.5);
    expect(u2.uTransition).toBe(1);
  });

  it('remembered-only map produces no-op uniforms (transition=1)', () => {
    const map = makeMap([
      { id: 'a', x: 0, y: 0, width: 60, height: 60, state: 'remembered' },
    ]);
    const uniforms = buildFogUniforms(map, cam(0, 0, 320, 240), 60, 60);
    // Transition is 1.0 — shader will pass through for remembered tiles
    expect(uniforms.uTransition).toBe(1.0);
  });

  it('defaults transition to 1.0 when not provided', () => {
    const uniforms = buildFogUniforms(makeMap([]), cam(0, 0, 320, 240), 10, 10);
    expect(uniforms.uTransition).toBe(1.0);
  });
});

// ── VIBRANCY_VALUES ──────────────────────────────────────────────────────────

describe('VIBRANCY_VALUES', () => {
  it('maps states to expected numeric values', () => {
    expect(VIBRANCY_VALUES.forgotten).toBe(0.0);
    expect(VIBRANCY_VALUES.partial).toBe(0.5);
    expect(VIBRANCY_VALUES.remembered).toBe(1.0);
  });
});

