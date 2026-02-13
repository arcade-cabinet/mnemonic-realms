/** CLI status subcommand — shows generation status for images, code, and audio. */

import { existsSync, readFileSync } from 'node:fs';
import { AUDIO_MANIFEST_MAP } from './generators/audio-batch-runner';
import { CODE_MANIFEST_MAP } from './generators/code-config';
import { loadManifest, MANIFEST_MAP } from './generators/model-config';
import type { AssetEntry } from './generators/types';
import type { CodeGenManifest } from './schemas/codegen';

export function runStatus(): void {
  console.log('Mnemonic Realms — Generation Status\n');

  console.log('=== Image Assets ===\n');
  for (const [name, info] of Object.entries(MANIFEST_MAP)) {
    if (!existsSync(info.path)) {
      console.log(`  ${name}: no manifest`);
      continue;
    }
    const m = loadManifest<{ assets: AssetEntry[] }>(info);
    const g = m.assets.filter((a) => a.status === 'generated').length;
    const p = m.assets.filter((a) => a.status === 'pending').length;
    const f = m.assets.filter((a) => a.status === 'failed').length;
    console.log(`  ${name}: ${g}/${m.assets.length} generated, ${p} pending, ${f} failed`);
  }

  console.log('\n=== Code Generation ===\n');
  for (const [name, info] of Object.entries(CODE_MANIFEST_MAP)) {
    try {
      const m = loadManifest<CodeGenManifest>(info);
      const g = m.assets.filter((a) => a.status === 'generated').length;
      const p = m.assets.filter((a) => a.status === 'pending').length;
      const f = m.assets.filter((a) => a.status === 'failed').length;
      console.log(`  ${name}: ${g}/${m.assets.length} generated, ${p} pending, ${f} failed`);
    } catch {
      console.log(`  ${name}: no manifest (run: pnpm gen build code)`);
    }
  }

  console.log('\n=== Audio Assets ===\n');
  for (const [name, info] of Object.entries(AUDIO_MANIFEST_MAP)) {
    if (!existsSync(info.path)) {
      console.log(`  ${name}: no manifest`);
      continue;
    }
    try {
      const m = JSON.parse(readFileSync(info.path, 'utf-8'));
      const assets = m.assets as { status: string; stems?: { filename: string }[] }[];
      const g = assets.filter((a) => a.status === 'generated').length;
      const p = assets.filter((a) => a.status === 'pending').length;
      const f = assets.filter((a) => a.status === 'failed').length;
      const stemCount =
        name === 'bgm' ? assets.reduce((n, a) => n + (a.stems?.length ?? 0), 0) : assets.length;
      const suffix = name === 'bgm' ? ` (${stemCount} stems)` : '';
      console.log(`  ${name}: ${g}/${assets.length} generated, ${p} pending, ${f} failed${suffix}`);
    } catch {
      console.log(`  ${name}: error reading manifest`);
    }
  }
}
