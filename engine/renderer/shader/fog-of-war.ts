/**
 * Vibrancy fog-of-war SkSL shader + uniform builder.
 *
 * Renders per-area visual effects over the game canvas:
 *   - Forgotten: opaque dark overlay (area nearly invisible)
 *   - Partial: warm amber haze (shapes visible as invitation)
 *   - Remembered: NO filter — crystal clear gorgeous 16-bit art
 *
 * Uses a grid-based approach: a small data texture encodes each tile's
 * vibrancy state. The SkSL shader samples this texture to apply per-pixel
 * fog effects. This avoids SkSL's limitations on dynamic array uniforms.
 *
 * All math/uniform computation lives here. The TSX component is thin.
 * NO Skia imports — fully testable in Vitest.
 */

import type { VibrancyMap, VibrancyState } from '../../ecs/systems/vibrancy.js';
import type { CameraState } from '../types.js';
import { TILE_SIZE } from '../types.js';

// ── Constants ────────────────────────────────────────────────────────────────

/** Maximum grid dimension supported by the shader (tiles). */
export const MAX_GRID_SIZE = 64;

/** Vibrancy state → numeric value for the shader grid. */
export const VIBRANCY_VALUES: Record<VibrancyState, number> = {
  forgotten: 0.0,
  partial: 0.5,
  remembered: 1.0,
};

/** Transition duration in milliseconds when areas unlock. */
export const TRANSITION_DURATION_MS = 500;

// ── Types ────────────────────────────────────────────────────────────────────

/** Scalar uniform data passed to the fog-of-war SkSL shader. */
export interface FogUniforms {
  /** Resolution of the viewport [width, height] */
  uResolution: readonly [number, number];
  /** Camera offset in pixels [x, y] */
  uCameraOffset: readonly [number, number];
  /** Tile size in pixels */
  uTileSize: number;
  /** Grid dimensions in tiles [width, height] */
  uGridSize: readonly [number, number];
  /** Animated transition progress (0→1). Used for smooth unlock transitions. */
  uTransition: number;
}

// ── SkSL Shader Source ───────────────────────────────────────────────────────

/**
 * SkSL shader source for the fog-of-war effect.
 *
 * Applied as a layer effect over the game canvas Group.
 * - `image`: auto-bound child content (the rendered game)
 * - `vibrancyTex`: data texture where R channel = vibrancy (0/128/255)
 *
 * For each pixel:
 * 1. Convert screen coord → world coord → tile coord
 * 2. Sample vibrancy texture at tile coord
 * 3. Apply visual effect: forgotten=dark, partial=amber haze, remembered=passthrough
 */
export const FOG_SHADER_SOURCE = `
uniform shader image;
uniform shader vibrancyTex;
uniform vec2 uResolution;
uniform vec2 uCameraOffset;
uniform float uTileSize;
uniform vec2 uGridSize;
uniform float uTransition;

half4 main(float2 coord) {
  half4 color = image.eval(coord);

  // Screen coord → world coord → tile coord
  float2 worldCoord = coord + uCameraOffset;
  float2 tileCoord = floor(worldCoord / uTileSize);

  // Clamp to grid bounds
  tileCoord = clamp(tileCoord, float2(0.0), uGridSize - float2(1.0));

  // Sample vibrancy data texture at tile center (nearest filtering)
  float2 texCoord = tileCoord + float2(0.5);
  half4 texSample = vibrancyTex.eval(texCoord);
  float vibrancy = texSample.r;

  // Remembered (vibrancy ≈ 1.0): NO filter at all — crystal clear art
  if (vibrancy > 0.75) {
    return color;
  }

  // Partial (vibrancy ≈ 0.5): warm amber haze overlay
  if (vibrancy > 0.25) {
    half4 amber = half4(0.55, 0.35, 0.12, 1.0);
    float hazeStrength = 0.55;
    half4 hazed = mix(color, amber, half(hazeStrength));
    // Preserve some luminance so shapes are visible as invitation
    float lum = dot(float3(color.rgb), float3(0.299, 0.587, 0.114));
    hazed.rgb = mix(hazed.rgb, hazed.rgb * half(lum * 1.5 + 0.3), half(0.4));
    return mix(color, hazed, half(uTransition));
  }

  // Forgotten (vibrancy ≈ 0.0): opaque dark overlay
  half4 dark = half4(0.02, 0.02, 0.03, 1.0);
  half4 fogged = mix(color, dark, half(0.95));
  return mix(color, fogged, half(uTransition));
}
`;

// ── Grid Builder ─────────────────────────────────────────────────────────────

/**
 * Build a flat vibrancy grid from the vibrancy map.
 * Each cell represents one tile's vibrancy state as a float (0..1).
 * Grid is row-major, clamped to MAX_GRID_SIZE × MAX_GRID_SIZE.
 *
 * Tiles not covered by any area default to 1.0 (remembered / no fog).
 */
export function buildVibrancyGrid(
  vibrancyMap: VibrancyMap,
  mapWidth: number,
  mapHeight: number,
): number[] {
  const gridW = Math.min(mapWidth, MAX_GRID_SIZE);
  const gridH = Math.min(mapHeight, MAX_GRID_SIZE);
  const grid = new Array<number>(gridW * gridH).fill(1.0);

  for (const area of vibrancyMap.areas) {
    const value = VIBRANCY_VALUES[area.state];
    const startX = Math.max(0, area.x);
    const startY = Math.max(0, area.y);
    const endX = Math.min(gridW, area.x + area.width);
    const endY = Math.min(gridH, area.y + area.height);

    for (let ty = startY; ty < endY; ty++) {
      for (let tx = startX; tx < endX; tx++) {
        grid[ty * gridW + tx] = value;
      }
    }
  }

  return grid;
}

// ── Pixel Data Builder ───────────────────────────────────────────────────────

/**
 * Convert a vibrancy grid to RGBA pixel data for creating a data texture.
 * Each grid cell becomes one pixel: R=G=B=vibrancy*255, A=255.
 *
 * @returns Uint8Array of RGBA pixel data (length = gridW * gridH * 4)
 */
export function buildFogPixelData(
  grid: number[],
  gridWidth: number,
  gridHeight: number,
): Uint8Array {
  const pixels = new Uint8Array(gridWidth * gridHeight * 4);
  const len = Math.min(grid.length, gridWidth * gridHeight);

  for (let i = 0; i < len; i++) {
    const v = Math.round(grid[i] * 255);
    const offset = i * 4;
    pixels[offset] = v; // R
    pixels[offset + 1] = v; // G
    pixels[offset + 2] = v; // B
    pixels[offset + 3] = 255; // A (opaque)
  }

  return pixels;
}

// ── Uniform Builder ──────────────────────────────────────────────────────────

/**
 * Build scalar uniform data for the fog-of-war shader.
 * The vibrancy grid is passed separately as a data texture.
 *
 * @param vibrancyMap - Current vibrancy state for all areas
 * @param camera - Camera position and viewport dimensions
 * @param mapWidth - Map width in tiles
 * @param mapHeight - Map height in tiles
 * @param transition - Animated transition progress (0→1), default 1.0
 */
export function buildFogUniforms(
  _vibrancyMap: VibrancyMap,
  camera: CameraState,
  mapWidth: number,
  mapHeight: number,
  transition = 1.0,
): FogUniforms {
  const gridW = Math.min(mapWidth, MAX_GRID_SIZE);
  const gridH = Math.min(mapHeight, MAX_GRID_SIZE);

  return {
    uResolution: [camera.viewportWidth, camera.viewportHeight] as const,
    uCameraOffset: [camera.x, camera.y] as const,
    uTileSize: TILE_SIZE,
    uGridSize: [gridW, gridH] as const,
    uTransition: Math.max(0, Math.min(1, transition)),
  };
}
