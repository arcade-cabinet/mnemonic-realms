/** Batch code generation: processes all entries in selected code categories. */

import { existsSync } from 'node:fs';
import type { GoogleGenAI } from '@google/genai';
import { getDirtyIds, removeDirtyId } from '../dirty';
import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import { CODE_MANIFEST_MAP } from './code-config';
import { processCodeEntry } from './code-processor';
import { loadManifest, MODELS, RATE_LIMIT_MS, saveManifest } from './model-config';

export async function runCodeBatch(
  ai: GoogleGenAI | null,
  target: string,
  index: number | undefined,
  dryRun: boolean,
  modelOverride?: string,
): Promise<void> {
  console.log('Mnemonic Realms — Code Generation\n');
  const targets = target === 'all' ? Object.keys(CODE_MANIFEST_MAP) : [target];
  const dirtyIds = getDirtyIds();
  if (dirtyIds.size > 0) {
    console.log(`Dirty manifest: ${dirtyIds.size} entry(s) marked for forced regeneration\n`);
  }

  for (const t of targets) {
    const info = CODE_MANIFEST_MAP[t];
    if (!info) {
      console.error(`Unknown code target: ${t}`);
      process.exit(1);
    }
    if (!existsSync(info.path)) {
      console.error(`Code manifest not found: ${info.path}`);
      console.error('Run "pnpm exec tsx gen/scripts/build-manifests.ts code" first.');
      process.exit(1);
    }

    const manifest = loadManifest<CodeGenManifest>(info);
    const entries = index !== undefined ? [manifest.assets[index]] : manifest.assets;

    console.log(`Processing ${t}: ${entries.length} entry(s)\n`);
    let gen = 0;
    let skip = 0;
    let fail = 0;
    const model = modelOverride || MODELS.geminiFlash;

    for (const entry of entries) {
      if (!ai && !dryRun) break;
      if (dryRun) {
        console.log(`  [DRY RUN] Would generate: ${entry.id} → ${entry.filename}`);
        skip++;
        continue;
      }
      if (!ai) continue;
      const result = await processCodeEntry(
        ai,
        entry,
        info.outputDir,
        manifest.systemPrompt,
        dryRun,
        model,
        dirtyIds,
      );
      const ma = manifest.assets.find((a) => a.id === entry.id);
      if (ma && result.status !== 'skipped') {
        ma.status = result.status;
        if (result.metadata) ma.metadata = result.metadata;
        if (result.error) (ma as CodeGenEntry & { lastError?: string }).lastError = result.error;
      }
      if (result.status === 'generated') {
        gen++;
        if (dirtyIds.has(entry.id)) removeDirtyId(entry.id);
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
