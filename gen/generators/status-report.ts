/** Shows generation status across all manifest categories. */

import { existsSync } from 'node:fs';
import { loadManifest, MANIFEST_MAP } from './model-config';
import type { AssetEntry } from './types';

export function showStatus(): void {
  console.log('Mnemonic Realms — Asset Generation Status\n');

  for (const [name, info] of Object.entries(MANIFEST_MAP)) {
    if (!existsSync(info.path)) {
      console.log(`${name}: no manifest found`);
      continue;
    }

    const manifest = loadManifest<{ assets: AssetEntry[] }>(info);
    const total = manifest.assets.length;
    const pending = manifest.assets.filter((a) => a.status === 'pending').length;
    const generated = manifest.assets.filter((a) => a.status === 'generated').length;
    const failed = manifest.assets.filter((a) => a.status === 'failed').length;
    const generating = manifest.assets.filter((a) => a.status === 'generating').length;

    console.log(`${name}: ${total} assets`);
    console.log(
      `  generated: ${generated}  pending: ${pending}  failed: ${failed}  in-progress: ${generating}`,
    );

    if (failed > 0) {
      for (const a of manifest.assets.filter((a) => a.status === 'failed')) {
        console.log(
          `    FAILED: ${a.id} — ${(a as { lastError?: string }).lastError || 'unknown'}`,
        );
      }
    }
    console.log();
  }
}
