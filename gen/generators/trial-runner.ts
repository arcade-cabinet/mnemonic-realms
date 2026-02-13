/** Trial generation: one representative asset from each category. */

import { existsSync } from 'node:fs';
import type { GoogleGenAI } from '@google/genai';
import { processAsset } from './asset-processor';
import {
  CATEGORY_MODELS,
  loadManifest,
  MANIFEST_MAP,
  RATE_LIMIT_MS,
  saveManifest,
} from './model-config';
import type { AssetEntry } from './types';

const TRIAL_PICKS: [string, number][] = [
  ['tilesets', 2],
  ['sprites', 0],
  ['portraits', 1],
  ['items', 6],
];

export async function runTrial(ai: GoogleGenAI | null, dryRun: boolean): Promise<void> {
  console.log('Mnemonic Realms — Trial Generation (4 assets)\n');

  for (const [cat, idx] of TRIAL_PICKS) {
    const info = MANIFEST_MAP[cat];
    if (!info || !existsSync(info.path)) continue;
    const m = loadManifest<{ assets: AssetEntry[]; styleGuide?: string }>(info);
    if (!m.assets[idx]) continue;

    if (!ai) continue;
    const result = await processAsset(
      ai,
      m.assets[idx],
      info.outputDir,
      m.styleGuide,
      dryRun,
      CATEGORY_MODELS[cat],
    );

    if (result.status !== 'skipped') {
      m.assets[idx].status = result.status;
      if (result.metadata) m.assets[idx].metadata = result.metadata;
      saveManifest(info, m);
    }

    console.log(`  ${m.assets[idx].id}: ${result.status}`);
    if (result.status === 'generated') {
      await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
    }
  }

  console.log('\nTrial complete.');
}
