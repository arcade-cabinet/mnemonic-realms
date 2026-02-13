/** Batch generation: processes all assets in selected categories. */

import { existsSync } from 'node:fs';
import type { GoogleGenAI } from '@google/genai';
import { getDirtyIds, removeDirtyId } from '../dirty';
import { processAsset } from './asset-processor';
import {
  CATEGORY_MODELS,
  loadManifest,
  MANIFEST_MAP,
  RATE_LIMIT_MS,
  saveManifest,
} from './model-config';
import type { AssetEntry } from './types';

export async function runBatch(
  ai: GoogleGenAI | null,
  target: string,
  index: number | undefined,
  dryRun: boolean,
  modelOverride?: string,
): Promise<void> {
  console.log('Mnemonic Realms — Asset Generation\n');
  const targets = target === 'all' ? Object.keys(MANIFEST_MAP) : [target];
  const dirtyIds = getDirtyIds();
  if (dirtyIds.size > 0) {
    console.log(`Dirty manifest: ${dirtyIds.size} asset(s) marked for forced regeneration\n`);
  }

  for (const t of targets) {
    const info = MANIFEST_MAP[t];
    if (!info) {
      console.error(`Unknown: ${t}`);
      process.exit(1);
    }
    if (!existsSync(info.path)) {
      console.error(`Manifest not found: ${info.path}`);
      process.exit(1);
    }

    const manifest = loadManifest<{ assets: AssetEntry[]; styleGuide?: string }>(info);
    const assets = index !== undefined ? [manifest.assets[index]] : manifest.assets;

    console.log(`Processing ${t}: ${assets.length} asset(s)\n`);
    let gen = 0;
    let skip = 0;
    let fail = 0;

    for (const asset of assets) {
      if (!ai && !dryRun) break;
      if (!ai) continue;
      const result = await processAsset(
        ai,
        asset,
        info.outputDir,
        manifest.styleGuide,
        dryRun,
        modelOverride || CATEGORY_MODELS[t],
        dirtyIds,
      );
      const ma = manifest.assets.find((a) => a.id === asset.id);
      if (ma && result.status !== 'skipped') {
        ma.status = result.status;
        if (result.metadata) ma.metadata = result.metadata;
        if (result.error) (ma as { lastError?: string }).lastError = result.error;
      }
      if (result.status === 'generated') {
        gen++;
        if (dirtyIds.has(asset.id)) removeDirtyId(asset.id);
      } else if (result.status === 'skipped') skip++;
      else fail++;
      if (result.status === 'generated' && ai) {
        await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
      }
    }

    if (!dryRun && (gen > 0 || fail > 0)) {
      saveManifest(info, manifest);
    }
    console.log(`\n${t}: ${gen} generated, ${skip} skipped, ${fail} failed\n`);
  }
}
