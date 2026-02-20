/**
 * Pure sprite helper functions — no React or Skia imports.
 * Testable in Vitest without React Native runtime.
 */

import type { CameraState } from './types.js';

// ── Types ───────────────────────────────────────────────────────────────────

/** A sprite ready for rendering after culling and sorting. */
export interface SpriteEntry {
  /** World X position in pixels */
  x: number;
  /** World Y position in pixels */
  y: number;
  /** Sprite sheet frame index */
  frame: number;
  /** Sprite width in pixels */
  width: number;
  /** Sprite height in pixels */
  height: number;
}

export interface SpriteAtlasConfig {
  /** Sprite width in pixels (typically 16) */
  spriteWidth: number;
  /** Sprite height in pixels (typically 16) */
  spriteHeight: number;
  /** Number of sprite columns in the atlas image */
  columns: number;
}

// ── Helper functions (pure, no React) ───────────────────────────────────────

/**
 * Sort sprites by Y position for correct depth ordering.
 * Entities with higher Y (further down screen) render on top.
 */
export function sortSpritesByDepth(sprites: SpriteEntry[]): SpriteEntry[] {
  return [...sprites].sort((a, b) => a.y - b.y);
}

/**
 * Compute the source rectangle in the sprite atlas for a given frame.
 */
export function getSpriteSourceRect(
  frame: number,
  columns: number,
  spriteWidth: number,
  spriteHeight: number,
): { x: number; y: number; width: number; height: number } {
  const col = frame % columns;
  const row = Math.floor(frame / columns);
  return {
    x: col * spriteWidth,
    y: row * spriteHeight,
    width: spriteWidth,
    height: spriteHeight,
  };
}

/**
 * Filter sprites to only those visible in the camera viewport.
 */
export function cullSprites(sprites: SpriteEntry[], camera: CameraState): SpriteEntry[] {
  return sprites.filter((s) => {
    const screenX = s.x - camera.x;
    const screenY = s.y - camera.y;
    return (
      screenX + s.width > 0 &&
      screenX < camera.viewportWidth &&
      screenY + s.height > 0 &&
      screenY < camera.viewportHeight
    );
  });
}
