/**
 * Fog-of-war renderer — thin React component wrapping game canvas children
 * with the vibrancy SkSL shader as a post-processing layer effect.
 *
 * TSX contains ONLY rendering + hooks. All shader math lives in fog-of-war.ts.
 *
 * Smooth transitions: when vibrancy areas unlock, the visual effect
 * interpolates over TRANSITION_DURATION_MS using a Reanimated shared value.
 */

import { Group, ImageShader, Paint, RuntimeShader, Skia } from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useRef } from 'react';
import { cancelAnimation, useSharedValue, withTiming } from 'react-native-reanimated';

import type { VibrancyMap } from '../../ecs/systems/vibrancy.js';
import type { CameraState } from '../types.js';
import {
  buildFogPixelData,
  buildFogUniforms,
  buildVibrancyGrid,
  FOG_SHADER_SOURCE,
  MAX_GRID_SIZE,
  TRANSITION_DURATION_MS,
} from './fog-of-war.js';

// ── Compile shader once ──────────────────────────────────────────────────────

const fogEffect = Skia.RuntimeEffect.Make(FOG_SHADER_SOURCE);

// ── Props ────────────────────────────────────────────────────────────────────

export interface FogRendererProps {
  /** Current vibrancy state for all map areas */
  vibrancyMap: VibrancyMap;
  /** Camera position and viewport dimensions */
  camera: CameraState;
  /** Map width in tiles */
  mapWidth: number;
  /** Map height in tiles */
  mapHeight: number;
  /** Child renderers (tile layers, sprites, etc.) */
  children: React.ReactNode;
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * Wraps game canvas children in a Skia Group with the fog-of-war shader
 * applied as a layer effect. The shader reads a data texture encoding
 * per-tile vibrancy state and applies visual fog accordingly.
 *
 * - Forgotten areas: nearly opaque dark overlay
 * - Partial areas: warm amber haze (shapes visible as invitation)
 * - Remembered areas: NO filter — crystal clear gorgeous art
 */
export const FogRenderer = React.memo(function FogRenderer({
  vibrancyMap,
  camera,
  mapWidth,
  mapHeight,
  children,
}: FogRendererProps) {
  // Track previous vibrancy map for transition detection
  const prevMapRef = useRef(vibrancyMap);
  const transition = useSharedValue(1);

  // Detect vibrancy changes and animate transition
  useEffect(() => {
    if (prevMapRef.current !== vibrancyMap) {
      prevMapRef.current = vibrancyMap;
      transition.value = 0;
      cancelAnimation(transition);
      transition.value = withTiming(1, { duration: TRANSITION_DURATION_MS });
    }
  }, [vibrancyMap, transition]);

  // Build the vibrancy data texture (small image: gridW × gridH pixels)
  const vibrancyImage = useMemo(() => {
    const gridW = Math.min(mapWidth, MAX_GRID_SIZE);
    const gridH = Math.min(mapHeight, MAX_GRID_SIZE);
    const grid = buildVibrancyGrid(vibrancyMap, mapWidth, mapHeight);
    const pixels = buildFogPixelData(grid, gridW, gridH);

    const data = Skia.Data.fromBytes(pixels);
    const info = {
      width: gridW,
      height: gridH,
      colorType: 4, // RGBA_8888
      alphaType: 1, // Opaque
    };
    return Skia.Image.MakeImage(info, data, gridW * 4);
  }, [vibrancyMap, mapWidth, mapHeight]);

  // Build scalar uniforms
  const uniforms = useMemo(
    () => buildFogUniforms(vibrancyMap, camera, mapWidth, mapHeight),
    [vibrancyMap, camera, mapWidth, mapHeight],
  );

  // If shader compilation failed or no image, render children without fog
  if (!fogEffect || !vibrancyImage) {
    return <Group>{children}</Group>;
  }

  // Apply fog-of-war as a layer effect over all children
  return (
    <Group
      layer={
        <Paint>
          <RuntimeShader source={fogEffect} uniforms={{ ...uniforms, uTransition: transition }}>
            <ImageShader
              image={vibrancyImage}
              fit="none"
              x={0}
              y={0}
              width={vibrancyImage.width()}
              height={vibrancyImage.height()}
            />
          </RuntimeShader>
        </Paint>
      }
    >
      {children}
    </Group>
  );
});
