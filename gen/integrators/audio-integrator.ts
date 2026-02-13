/**
 * Audio Integrator
 *
 * Copies generated audio files from gen/output/audio/ to public/assets/audio/
 * so that Vite serves them as static assets in the browser build.
 * Also validates existence and updates manifest statuses.
 */

import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { GEN_OUTPUT, MANIFESTS_DIR } from './shared';

const PROJECT_ROOT = resolve(
  import.meta.dirname ?? process.cwd(),
  import.meta.dirname ? '../..' : '.',
);

// Vite publicDir is "assets" (set in rpg.toml), so static files
// live at <root>/assets/ and get copied to dist/ at build time.
const PUBLIC_AUDIO = resolve(PROJECT_ROOT, 'assets/audio');

interface AudioAsset {
  id: string;
  filename: string;
  status: string;
  metadata?: Record<string, unknown>;
}

interface BgmEntry extends AudioAsset {
  stems: { filename: string }[];
}

function _hashFile(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

/** Copy BGM stems from gen/output to public/assets/audio/bgm. */
function integrateBgm(dryRun: boolean): number {
  const manifestPath = resolve(MANIFESTS_DIR, 'audio/bgm/manifest.json');
  const sourceDir = resolve(GEN_OUTPUT, 'audio/bgm');
  const destDir = resolve(PUBLIC_AUDIO, 'bgm');

  if (!existsSync(manifestPath)) {
    console.log('  BGM: no manifest');
    return 0;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const generated = manifest.assets.filter(
    (a: AudioAsset) => a.status === 'generated',
  ) as BgmEntry[];
  console.log(`  BGM: ${generated.length} track(s) to integrate`);

  let processed = 0;

  for (const bgm of generated) {
    for (const stem of bgm.stems) {
      const srcPath = resolve(sourceDir, stem.filename);
      if (!existsSync(srcPath)) {
        console.log(`    Missing: ${stem.filename}`);
        continue;
      }

      const destPath = resolve(destDir, stem.filename);

      if (dryRun) {
        console.log(`    [DRY] ${stem.filename} -> public/assets/audio/bgm/`);
      } else {
        mkdirSync(destDir, { recursive: true });
        copyFileSync(srcPath, destPath);
        console.log(`    ${stem.filename}`);
      }
      processed++;
    }
  }

  return processed;
}

/** Copy ambient loops from gen/output to public/assets/audio/ambient. */
function integrateAmbient(dryRun: boolean): number {
  const manifestPath = resolve(MANIFESTS_DIR, 'audio/ambient/manifest.json');
  const sourceDir = resolve(GEN_OUTPUT, 'audio/ambient');
  const destDir = resolve(PUBLIC_AUDIO, 'ambient');

  if (!existsSync(manifestPath)) {
    console.log('  Ambient: no manifest');
    return 0;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const generated = manifest.assets.filter((a: AudioAsset) => a.status === 'generated');
  console.log(`  Ambient: ${generated.length} loop(s) to integrate`);

  let processed = 0;

  for (const asset of generated as AudioAsset[]) {
    const srcPath = resolve(sourceDir, asset.filename);
    if (!existsSync(srcPath)) {
      console.log(`    Missing: ${asset.filename}`);
      continue;
    }

    const destPath = resolve(destDir, asset.filename);

    if (dryRun) {
      console.log(`    [DRY] ${asset.filename} -> public/assets/audio/ambient/`);
    } else {
      mkdirSync(destDir, { recursive: true });
      copyFileSync(srcPath, destPath);
      console.log(`    ${asset.filename}`);
    }
    processed++;
  }

  return processed;
}

/** Run audio integration for specified targets. */
export async function integrateAudio(targets: string[], dryRun: boolean): Promise<number> {
  console.log('\n--- Audio Integration ---');

  const all = targets.length === 0 || targets.includes('all') || targets.includes('audio');
  const doBgm = all || targets.includes('bgm');
  const doAmbient = all || targets.includes('ambient');

  let total = 0;

  if (doBgm) {
    total += integrateBgm(dryRun);
  }

  if (doAmbient) {
    total += integrateAmbient(dryRun);
  }

  console.log(`  Audio: ${total} file(s) ${dryRun ? 'would be' : ''} integrated`);
  return total;
}
