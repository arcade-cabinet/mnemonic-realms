/**
 * Audio Batch Runner
 *
 * Processes all BGM and ambient assets from their manifests,
 * following the same batch pattern as batch-runner.ts and code-batch-runner.ts.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { AmbientAsset, AmbientManifest } from '../schemas/audio-ambient';
import type { BgmAsset, BgmManifest } from '../schemas/audio-bgm';
import { processAmbientAsset, processBgmStem } from './audio-gen';
import { MANIFESTS_DIR, OUTPUT_DIR } from './model-config';

interface AudioManifestInfo {
  type: string;
  path: string;
  outputDir: string;
}

export const AUDIO_MANIFEST_MAP: Record<string, AudioManifestInfo> = {
  bgm: {
    type: 'bgm',
    path: resolve(MANIFESTS_DIR, 'audio/bgm/manifest.json'),
    outputDir: resolve(OUTPUT_DIR, 'audio/bgm'),
  },
  ambient: {
    type: 'ambient',
    path: resolve(MANIFESTS_DIR, 'audio/ambient/manifest.json'),
    outputDir: resolve(OUTPUT_DIR, 'audio/ambient'),
  },
};

function loadManifest<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function saveManifest(path: string, manifest: unknown): void {
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
}

/** Run BGM generation for all tracks. */
async function runBgmBatch(
  index: number | undefined,
  dryRun: boolean,
): Promise<{ generated: number; skipped: number; failed: number }> {
  const info = AUDIO_MANIFEST_MAP.bgm;
  if (!existsSync(info.path)) {
    console.error(`  BGM manifest not found: ${info.path}`);
    return { generated: 0, skipped: 0, failed: 0 };
  }

  const manifest = loadManifest<BgmManifest>(info.path);
  const assets = index !== undefined ? [manifest.assets[index]] : manifest.assets;

  console.log(
    `\n  BGM: ${assets.length} track(s), ${assets.reduce((n, a) => n + a.stems.length, 0)} stem(s)\n`,
  );

  let gen = 0;
  let skip = 0;
  let fail = 0;

  for (const bgm of assets) {
    console.log(`  [${bgm.id}] ${bgm.name} — ${bgm.tempo}bpm ${bgm.key} ${bgm.mood}`);

    let allStemsGenerated = true;
    let anyStemFailed = false;

    for (let s = 0; s < bgm.stems.length; s++) {
      const result = processBgmStem(bgm, s, info.outputDir, dryRun);

      if (result.status === 'generated') {
        gen++;
        // Store stem metadata
        if (!('stemMetadata' in bgm)) {
          (bgm as BgmAsset & { stemMetadata: Record<number, unknown> }).stemMetadata = {};
        }
        (bgm as BgmAsset & { stemMetadata: Record<number, unknown> }).stemMetadata[
          bgm.stems[s].layer
        ] = result.metadata;
      } else if (result.status === 'failed') {
        fail++;
        anyStemFailed = true;
        allStemsGenerated = false;
      } else {
        skip++;
      }
    }

    // Update asset status in manifest
    const manifestAsset = manifest.assets.find((a) => a.id === bgm.id);
    if (manifestAsset) {
      if (anyStemFailed) {
        manifestAsset.status = 'pending'; // Keep pending so it retries
      } else if (allStemsGenerated || gen > 0) {
        manifestAsset.status = 'generated';
      }
      // Copy stemMetadata to manifest
      if ('stemMetadata' in bgm) {
        (manifestAsset as BgmAsset & { stemMetadata: unknown }).stemMetadata = (
          bgm as BgmAsset & { stemMetadata: unknown }
        ).stemMetadata;
      }
    }
  }

  if (!dryRun && (gen > 0 || fail > 0)) {
    manifest.updatedAt = new Date().toISOString();
    saveManifest(info.path, manifest);
  }

  return { generated: gen, skipped: skip, failed: fail };
}

/** Run ambient generation for all loops. */
async function runAmbientBatch(
  index: number | undefined,
  dryRun: boolean,
): Promise<{ generated: number; skipped: number; failed: number }> {
  const info = AUDIO_MANIFEST_MAP.ambient;
  if (!existsSync(info.path)) {
    console.error(`  Ambient manifest not found: ${info.path}`);
    return { generated: 0, skipped: 0, failed: 0 };
  }

  const manifest = loadManifest<AmbientManifest>(info.path);
  const assets = index !== undefined ? [manifest.assets[index]] : manifest.assets;

  console.log(`\n  Ambient: ${assets.length} loop(s)\n`);

  let gen = 0;
  let skip = 0;
  let fail = 0;

  for (const asset of assets) {
    const result = processAmbientAsset(asset, info.outputDir, dryRun);

    const manifestAsset = manifest.assets.find((a) => a.id === asset.id);
    if (manifestAsset && result.status !== 'skipped') {
      manifestAsset.status = result.status;
      if (result.metadata) {
        (manifestAsset as AmbientAsset & { metadata: unknown }).metadata = result.metadata;
      }
      if (result.error) {
        (manifestAsset as AmbientAsset & { lastError?: string }).lastError = result.error;
      }
    }

    if (result.status === 'generated') gen++;
    else if (result.status === 'skipped') skip++;
    else fail++;
  }

  if (!dryRun && (gen > 0 || fail > 0)) {
    manifest.updatedAt = new Date().toISOString();
    saveManifest(info.path, manifest);
  }

  return { generated: gen, skipped: skip, failed: fail };
}

/** Run the full audio generation batch. */
export async function runAudioBatch(
  target: string,
  index: number | undefined,
  dryRun: boolean,
): Promise<void> {
  console.log('Mnemonic Realms — Audio Generation\n');

  const runBgm = target === 'all' || target === 'bgm';
  const runAmbient = target === 'all' || target === 'ambient';

  let totalGen = 0;
  let totalSkip = 0;
  let totalFail = 0;

  if (runBgm) {
    const { generated, skipped, failed } = await runBgmBatch(
      target === 'bgm' ? index : undefined,
      dryRun,
    );
    totalGen += generated;
    totalSkip += skipped;
    totalFail += failed;
    console.log(`\n  BGM: ${generated} generated, ${skipped} skipped, ${failed} failed`);
  }

  if (runAmbient) {
    const { generated, skipped, failed } = await runAmbientBatch(
      target === 'ambient' ? index : undefined,
      dryRun,
    );
    totalGen += generated;
    totalSkip += skipped;
    totalFail += failed;
    console.log(`\n  Ambient: ${generated} generated, ${skipped} skipped, ${failed} failed`);
  }

  console.log(`\nAudio total: ${totalGen} generated, ${totalSkip} skipped, ${totalFail} failed`);
}
