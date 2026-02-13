/**
 * Dirty Manifest — targeted regeneration without --force.
 *
 * Maintains a list of asset IDs that should be regenerated regardless
 * of idempotency checks. Safer than --force (which nukes everything).
 *
 * Usage:
 *   pnpm gen dirty list              — show dirty IDs
 *   pnpm gen dirty add <id> [reason] — mark an asset for regen
 *   pnpm gen dirty add-from-docs     — auto-detect from doc changes
 *   pnpm gen dirty clear             — remove all dirty marks
 *
 * The generate step checks dirty.json and treats listed assets as
 * needing regeneration. After successful generation, IDs are auto-removed.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface DirtyEntry {
  id: string;
  reason: string;
  addedAt: string;
}

export interface DirtyManifest {
  description: string;
  entries: DirtyEntry[];
}

const DIRTY_PATH = resolve(import.meta.dirname ?? '.', 'dirty.json');

export function loadDirty(): DirtyManifest {
  if (!existsSync(DIRTY_PATH)) {
    return { description: 'Targeted regeneration manifest', entries: [] };
  }
  return JSON.parse(readFileSync(DIRTY_PATH, 'utf-8'));
}

export function saveDirty(manifest: DirtyManifest): void {
  writeFileSync(DIRTY_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');
}

export function getDirtyIds(): Set<string> {
  const manifest = loadDirty();
  return new Set(manifest.entries.map((e) => e.id));
}

export function addDirtyId(id: string, reason: string): void {
  const manifest = loadDirty();
  if (manifest.entries.some((e) => e.id === id)) return;
  manifest.entries.push({ id, reason, addedAt: new Date().toISOString() });
  saveDirty(manifest);
}

export function removeDirtyId(id: string): void {
  const manifest = loadDirty();
  manifest.entries = manifest.entries.filter((e) => e.id !== id);
  saveDirty(manifest);
}

export function clearDirty(): void {
  saveDirty({ description: 'Targeted regeneration manifest', entries: [] });
}

export function isDirty(id: string, dirtyIds: Set<string>): boolean {
  return dirtyIds.has(id);
}
