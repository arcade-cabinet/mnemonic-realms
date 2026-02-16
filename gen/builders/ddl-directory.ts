/** Generic DDL directory loader — schema-driven recomposable pattern. */

import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ZodType } from 'zod';
import { PROJECT_ROOT } from './manifest-io';

const DDL_ROOT = resolve(PROJECT_ROOT, 'gen/ddl');

/**
 * Load all .json files from a DDL subdirectory, merge into a single
 * typed array validated against the entry schema.
 *
 * Each JSON file must contain a raw array of entries (not a wrapper object).
 * Files starting with _ are skipped (reserved for metadata).
 */
export function loadDdlDirectory<T>(dir: string, entrySchema: ZodType<T>): T[] {
  const fullDir = resolve(DDL_ROOT, dir);
  const files = readdirSync(fullDir)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .sort();

  const entries: T[] = [];
  for (const file of files) {
    const raw = JSON.parse(readFileSync(resolve(fullDir, file), 'utf-8'));
    if (!Array.isArray(raw)) {
      throw new Error(`${dir}/${file}: expected JSON array, got ${typeof raw}`);
    }
    for (const item of raw) {
      entries.push(entrySchema.parse(item));
    }
  }
  return entries;
}

/** Load _meta.json from a DDL subdirectory, validated against schema. */
export function loadDdlMeta<T>(dir: string, schema: ZodType<T>): T {
  const file = resolve(DDL_ROOT, dir, '_meta.json');
  const raw = JSON.parse(readFileSync(file, 'utf-8'));
  return schema.parse(raw);
}
