/**
 * Camera renderer — wraps child renderers in a Skia Group with translate transform.
 *
 * TSX contains ONLY rendering + hooks. All camera math lives in
 * engine/ecs/systems/camera.ts (computeCameraPosition, lerpCamera).
 */

import { Group } from '@shopify/react-native-skia';
import type React from 'react';

import type { CameraState } from './types.js';

// ── Props ───────────────────────────────────────────────────────────────────

export interface CameraViewProps {
  /** Camera state (position + viewport dimensions) in pixels */
  camera: CameraState;
  /** Child renderers (TileRenderer, sprite layers, etc.) */
  children: React.ReactNode;
}

// ── Camera view component ───────────────────────────────────────────────────

/**
 * Wraps child Skia renderers in a Group translated by the negative camera offset.
 * This shifts the entire world so the camera viewport shows the correct region.
 *
 * Camera position is the top-left corner of the viewport in world pixels.
 * Children are rendered in world coordinates; this component handles the
 * world-to-screen transformation.
 */
export function CameraView({ camera, children }: CameraViewProps) {
  return (
    <Group transform={[{ translateX: -camera.x }, { translateY: -camera.y }]}>{children}</Group>
  );
}
