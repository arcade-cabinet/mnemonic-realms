/** Shared constants and utilities for asset integration. */

import { resolve } from 'node:path';
import sharp from 'sharp';

const PROJECT_ROOT = resolve(
  import.meta.dirname ?? process.cwd(),
  import.meta.dirname ? '../..' : '.',
);
export const GEN_OUTPUT = resolve(PROJECT_ROOT, 'gen/output');
export const MANIFESTS_DIR = resolve(PROJECT_ROOT, 'gen/manifests');

export const TARGETS = {
  tilesets: resolve(PROJECT_ROOT, 'main/server/maps/tmx'),
  sprites: resolve(PROJECT_ROOT, 'main/client/characters'),
  portraits: resolve(PROJECT_ROOT, 'main/client/gui/portraits'),
  items: resolve(PROJECT_ROOT, 'main/client/gui/icons'),
  ui: resolve(PROJECT_ROOT, 'main/client/gui/assets'),
};

export const OUTPUT_EXT = '.webp';

export interface IntegrationAsset {
  id: string;
  filename: string;
  status: string;
  dimensions: { width: number; height: number; genWidth: number; genHeight: number };
  spriteSize?: string;
  name?: string;
  biome?: string;
  tier?: string;
  category?: string;
  tileSize?: number;
  gridCols?: number;
  gridRows?: number;
}

/** Downscale with nearest-neighbor (preserves pixel art) to lossless WebP. */
export async function downscaleAsset(
  inputPath: string,
  outputPath: string,
  targetWidth: number,
  targetHeight: number,
): Promise<void> {
  await sharp(inputPath)
    .ensureAlpha()
    .resize(targetWidth, targetHeight, { kernel: sharp.kernel.nearest, fit: 'fill' })
    .webp({ lossless: true })
    .toFile(outputPath);
}

/** Check whether an image file has an alpha channel. */
export async function hasAlphaChannel(filePath: string): Promise<boolean> {
  const meta = await sharp(filePath).metadata();
  return meta.hasAlpha === true;
}
