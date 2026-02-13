/**
 * GenAI Model Configuration
 *
 * Model selection and manifest loading for the asset generation pipeline.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PROJECT_ROOT = resolve(
  import.meta.dirname ?? process.cwd(),
  import.meta.dirname ? '../..' : '.',
);
export const MANIFESTS_DIR = resolve(PROJECT_ROOT, 'gen/manifests');
export const OUTPUT_DIR = resolve(PROJECT_ROOT, 'gen/output');
export { PROJECT_ROOT };

export const MODELS = {
  gemini: 'gemini-2.5-flash-image',
  geminiFlash: 'gemini-2.5-flash',
  geminiPro: 'gemini-3-pro-image-preview',
  imagen: 'imagen-4.0-generate-001',
  imagenUltra: 'imagen-4.0-ultra-generate-001',
  imagenFast: 'imagen-4.0-fast-generate-001',
};

export const CATEGORY_MODELS: Record<string, string> = {
  tilesets: MODELS.gemini,
  sprites: MODELS.gemini,
  portraits: MODELS.gemini,
  items: MODELS.gemini,
  ui: MODELS.gemini,
};

export function isImagenModel(model: string): boolean {
  return model.startsWith('imagen-');
}

export const RATE_LIMIT_MS = 2000;

export interface ManifestInfo {
  type: string;
  path: string;
  outputDir: string;
}

export const MANIFEST_MAP: Record<string, ManifestInfo> = {
  tilesets: {
    type: 'tilesets',
    path: resolve(MANIFESTS_DIR, 'tilesets/manifest.json'),
    outputDir: resolve(OUTPUT_DIR, 'tilesets'),
  },
  sprites: {
    type: 'sprites',
    path: resolve(MANIFESTS_DIR, 'sprites/manifest.json'),
    outputDir: resolve(OUTPUT_DIR, 'sprites'),
  },
  portraits: {
    type: 'portraits',
    path: resolve(MANIFESTS_DIR, 'portraits/manifest.json'),
    outputDir: resolve(OUTPUT_DIR, 'portraits'),
  },
  items: {
    type: 'items',
    path: resolve(MANIFESTS_DIR, 'items/manifest.json'),
    outputDir: resolve(OUTPUT_DIR, 'items'),
  },
  ui: {
    type: 'ui',
    path: resolve(MANIFESTS_DIR, 'ui/manifest.json'),
    outputDir: resolve(OUTPUT_DIR, 'ui'),
  },
};

export function loadManifest<T>(info: ManifestInfo): T {
  return JSON.parse(readFileSync(info.path, 'utf-8'));
}

export function saveManifest(info: ManifestInfo, manifest: unknown): void {
  writeFileSync(info.path, JSON.stringify(manifest, null, 2));
}
