/**
 * Skia sprite renderer — renders entity sprites via Atlas draw calls.
 *
 * Queries renderableQuery for entities with Position + Sprite,
 * sorts by Y for depth ordering, and renders as a single Atlas call.
 *
 * TSX contains ONLY rendering + hooks. All sorting logic in sprite-helpers.ts.
 */

import {
  Atlas,
  FilterMode,
  MipmapMode,
  rect,
  type SkImage,
  Skia,
} from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import type { SpriteAtlasConfig, SpriteEntry } from './sprite-helpers.js';
import { cullSprites, getSpriteSourceRect, sortSpritesByDepth } from './sprite-helpers.js';
import type { CameraState } from './types.js';

// Re-export types and helpers so existing consumers still work
export type { SpriteAtlasConfig, SpriteEntry } from './sprite-helpers.js';
export { cullSprites, getSpriteSourceRect, sortSpritesByDepth } from './sprite-helpers.js';

export interface SpriteRendererProps {
  /** Sprite entries to render (pre-sorted by Y for depth) */
  sprites: SpriteEntry[];
  /** Sprite atlas image */
  image: SkImage;
  /** Atlas configuration */
  atlas: SpriteAtlasConfig;
  /** Camera state for world-to-screen positioning */
  camera: CameraState;
}

// ── Pixel-perfect sampling ──────────────────────────────────────────────────

const NEAREST_SAMPLING = {
  filter: FilterMode.Nearest,
  mipmap: MipmapMode.None,
} as const;

// ── Sprite renderer component ───────────────────────────────────────────────

/**
 * Renders entity sprites as a single Skia Atlas draw call.
 * Sprites are depth-sorted by Y position and viewport-culled.
 */
export const SpriteRenderer = React.memo(function SpriteRenderer({
  sprites,
  image,
  atlas,
  camera,
}: SpriteRendererProps) {
  const { spriteRects, transforms } = useMemo(() => {
    const sorted = sortSpritesByDepth(sprites);
    const visible = cullSprites(sorted, camera);

    const rects = visible.map((s) => {
      const src = getSpriteSourceRect(
        s.frame,
        atlas.columns,
        atlas.spriteWidth,
        atlas.spriteHeight,
      );
      return rect(src.x, src.y, src.width, src.height);
    });

    const xforms = visible.map((s) => {
      const screenX = s.x - camera.x;
      const screenY = s.y - camera.y;
      return Skia.RSXform(1, 0, screenX, screenY);
    });

    return { spriteRects: rects, transforms: xforms };
  }, [sprites, atlas, camera]);

  if (spriteRects.length === 0) return null;

  return (
    <Atlas
      image={image}
      sprites={spriteRects}
      transforms={transforms}
      sampling={NEAREST_SAMPLING}
    />
  );
});
