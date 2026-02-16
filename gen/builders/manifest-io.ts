/** Manifest I/O — read, merge, and write manifest files. */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { GenerationMetadata } from '../schemas/index';

const PROJECT_ROOT = resolve(
  import.meta.dirname ?? process.cwd(),
  import.meta.dirname ? '../..' : '.',
);
export const MANIFESTS_DIR = resolve(PROJECT_ROOT, 'gen/manifests');
export { PROJECT_ROOT };

export function timestamp(): string {
  return new Date().toISOString();
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Compute generation dimensions at 4x target, capped at 2048 per dimension. */
export function genDims(
  width: number,
  height: number,
): { width: number; height: number; genWidth: number; genHeight: number } {
  return {
    width,
    height,
    genWidth: Math.min(width * 4, 2048),
    genHeight: Math.min(height * 4, 2048),
  };
}

interface MergeableAsset {
  id: string;
  status: string;
  metadata?: GenerationMetadata;
  lastError?: string;
}

/** Merge new assets with existing, preserving generation state for unchanged IDs. */
export function mergeManifestAssets<T extends MergeableAsset>(
  newAssets: T[],
  existingAssets: T[],
): T[] {
  const existingMap = new Map(existingAssets.map((a) => [a.id, a]));
  let preserved = 0;
  let reset = 0;

  const merged = newAssets.map((newAsset) => {
    const existing = existingMap.get(newAsset.id);
    if (existing?.metadata) {
      preserved++;
      return {
        ...newAsset,
        status: existing.status,
        metadata: existing.metadata,
        ...(existing.lastError ? { lastError: existing.lastError } : {}),
      };
    }
    reset++;
    return newAsset;
  });

  const removed = existingAssets.filter((a) => !newAssets.some((n) => n.id === a.id));
  if (removed.length > 0) {
    console.log(
      `    Removed ${removed.length} stale assets: ${removed.map((a) => a.id).join(', ')}`,
    );
  }
  console.log(`    Merged: ${preserved} preserved, ${reset} new/reset`);
  return merged;
}

type ManifestData = {
  assets: MergeableAsset[];
} & Record<string, unknown>;

/** Write manifest to disk, merging with existing if present. */
export function writeManifest(subdir: string, manifest: ManifestData): void {
  const dir = resolve(MANIFESTS_DIR, subdir);
  mkdirSync(dir, { recursive: true });
  const path = resolve(dir, 'manifest.json');

  if (existsSync(path)) {
    try {
      const existing = JSON.parse(readFileSync(path, 'utf-8'));
      if (existing.assets?.length) {
        manifest.assets = mergeManifestAssets(manifest.assets, existing.assets);
      }
    } catch {
      console.log(`    Warning: could not parse existing ${path}, overwriting`);
    }
  }

  writeFileSync(path, JSON.stringify(manifest, null, 2));
  console.log(`  Wrote ${path}`);
}
