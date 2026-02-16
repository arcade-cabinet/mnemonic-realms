/**
 * GenAI Model Configuration
 *
 * Model selection and manifest loading for the code/audio generation pipeline.
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
  geminiFlash: 'gemini-2.5-flash',
};

export const RATE_LIMIT_MS = 2000;

export interface ManifestInfo {
  type: string;
  path: string;
  outputDir: string;
}

export function loadManifest<T>(info: ManifestInfo): T {
  return JSON.parse(readFileSync(info.path, 'utf-8'));
}

export function saveManifest(info: ManifestInfo, manifest: unknown): void {
  writeFileSync(info.path, JSON.stringify(manifest, null, 2));
}
