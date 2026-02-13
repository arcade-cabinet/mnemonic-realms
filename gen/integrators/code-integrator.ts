/** Code integrator: copies generated code to game dirs and formats with Biome. */

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { CODE_MANIFEST_MAP } from '../generators/code-config';
import type { CodeGenManifest } from '../schemas/codegen';

const PROJECT_ROOT = resolve(
  import.meta.dirname ?? process.cwd(),
  import.meta.dirname ? '../..' : '.',
);

export async function integrateCode(categories: string[], dryRun: boolean): Promise<void> {
  console.log('Mnemonic Realms — Code Integration\n');
  const targets = categories.includes('all') ? Object.keys(CODE_MANIFEST_MAP) : categories;

  const integratedPaths: string[] = [];

  for (const cat of targets) {
    const info = CODE_MANIFEST_MAP[cat];
    if (!info) {
      console.warn(`  Unknown code category: ${cat}`);
      continue;
    }

    const manifestPath = info.path;
    if (!existsSync(manifestPath)) {
      console.log(`  ${cat}: no manifest`);
      continue;
    }

    const manifest: CodeGenManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    const generated = manifest.assets.filter((a) => a.status === 'generated');
    console.log(`  ${cat}: ${generated.length} files to integrate`);

    for (const entry of generated) {
      const sourcePath = resolve(info.outputDir, entry.filename);
      if (!existsSync(sourcePath)) {
        console.warn(`    Missing: ${sourcePath}`);
        continue;
      }

      const targetPath = resolve(PROJECT_ROOT, entry.targetPath);
      if (dryRun) {
        console.log(`    [DRY] ${entry.filename} → ${entry.targetPath}`);
        integratedPaths.push(targetPath);
        continue;
      }

      mkdirSync(dirname(targetPath), { recursive: true });
      copyFileSync(sourcePath, targetPath);
      console.log(`    ${entry.filename} → ${entry.targetPath}`);
      integratedPaths.push(targetPath);
    }
  }

  if (integratedPaths.length === 0) {
    console.log('\n  No files to integrate.');
    return;
  }

  if (!dryRun) {
    console.log(`\n  Formatting ${integratedPaths.length} files with Biome...`);
    try {
      const tsFiles = integratedPaths.filter((p) => p.endsWith('.ts') || p.endsWith('.vue'));
      if (tsFiles.length > 0) {
        execFileSync('npx', ['biome', 'format', '--write', ...tsFiles], {
          cwd: PROJECT_ROOT,
          stdio: 'pipe',
        });
        console.log('    Formatted successfully.');
      }
    } catch {
      console.warn('    Biome formatting failed (non-fatal). Files still integrated.');
    }
  }

  console.log(`\n  Integrated ${integratedPaths.length} code files.`);
}
