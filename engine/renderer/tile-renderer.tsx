/**
 * Skia tile renderer — renders tile layers via Atlas draw calls.
 *
 * Each tile layer becomes a single `<Atlas>` call with viewport culling.
 * Layers stack bottom-to-top: ground → road → water → objects → above.
 *
 * TSX contains ONLY rendering + hooks. All math lives in culling.ts.
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

import { getTileSourceRect, getVisibleTiles } from './culling.js';
import type { CameraState, TileAtlasConfig, TileLayerData } from './types.js';

// ── Props ───────────────────────────────────────────────────────────────────

interface TileLayerProps {
  /** Tile layer data */
  layer: TileLayerData;
  /** Map width in tiles */
  mapWidth: number;
  /** Map height in tiles */
  mapHeight: number;
  /** Atlas tileset image */
  image: SkImage;
  /** Atlas configuration */
  atlas: TileAtlasConfig;
  /** Camera state */
  camera: CameraState;
}

interface TileRendererProps {
  /** Ordered tile layers (bottom to top) */
  layers: TileLayerData[];
  /** Map width in tiles */
  mapWidth: number;
  /** Map height in tiles */
  mapHeight: number;
  /** Atlas tileset image */
  image: SkImage;
  /** Atlas configuration */
  atlas: TileAtlasConfig;
  /** Camera state */
  camera: CameraState;
}

// ── Pixel-perfect sampling ──────────────────────────────────────────────────

const NEAREST_SAMPLING = {
  filter: FilterMode.Nearest,
  mipmap: MipmapMode.None,
} as const;

// ── Single layer renderer ───────────────────────────────────────────────────

/**
 * Renders a single tile layer as one Atlas draw call.
 * Viewport culling ensures only visible tiles generate sprites/transforms.
 */
const TileLayer = React.memo(function TileLayer({
  layer,
  mapWidth,
  mapHeight,
  image,
  atlas,
  camera,
}: TileLayerProps) {
  const { sprites, transforms } = useMemo(() => {
    const visible = getVisibleTiles(
      layer,
      mapWidth,
      mapHeight,
      atlas.tileWidth,
      atlas.tileHeight,
      camera,
    );

    const spriteRects = visible.map((tile) => {
      const src = getTileSourceRect(
        tile.gid,
        atlas.columns,
        atlas.tileWidth,
        atlas.tileHeight,
        atlas.firstGid,
      );
      return rect(src.x, src.y, src.width, src.height);
    });

    // Identity rotation (cos=1, sin=0), positioned at screen coords
    const xforms = visible.map((tile) => Skia.RSXform(1, 0, tile.screenX, tile.screenY));

    return { sprites: spriteRects, transforms: xforms };
  }, [layer, mapWidth, mapHeight, atlas, camera]);

  if (sprites.length === 0) return null;

  return (
    <Atlas image={image} sprites={sprites} transforms={transforms} sampling={NEAREST_SAMPLING} />
  );
});

// ── Multi-layer tile renderer ───────────────────────────────────────────────

/**
 * Renders all tile layers stacked bottom-to-top.
 * Each layer is a separate Atlas draw call with viewport culling.
 */
export const TileRenderer = React.memo(function TileRenderer({
  layers,
  mapWidth,
  mapHeight,
  image,
  atlas,
  camera,
}: TileRendererProps) {
  return (
    <>
      {layers.map((layer) => (
        <TileLayer
          key={layer.name}
          layer={layer}
          mapWidth={mapWidth}
          mapHeight={mapHeight}
          image={image}
          atlas={atlas}
          camera={camera}
        />
      ))}
    </>
  );
});
