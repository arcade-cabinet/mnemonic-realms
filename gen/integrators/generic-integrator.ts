/** Generic integrator for portraits and item icons (downscale to WebP). */

import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  downscaleAsset,
  GEN_OUTPUT,
  type IntegrationAsset,
  MANIFESTS_DIR,
  OUTPUT_EXT,
} from './shared';

export async function integrateCategory(
  category: string,
  targetDir: string,
  dryRun: boolean,
): Promise<number> {
  const manifestPath = resolve(MANIFESTS_DIR, `${category}/manifest.json`);
  if (!existsSync(manifestPath)) {
    console.log(`  No ${category} manifest`);
    return 0;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const generated = manifest.assets.filter((a: IntegrationAsset) => a.status === 'generated');
  console.log(`  ${category}: ${generated.length} to process`);

  let processed = 0;
  for (const asset of generated as IntegrationAsset[]) {
    const inputPath = resolve(GEN_OUTPUT, category, asset.filename);
    if (!existsSync(inputPath)) continue;

    const webpName = asset.filename.replace(/\.png$/, OUTPUT_EXT);
    const outputPath = resolve(targetDir, webpName);
    if (dryRun) {
      console.log(`    [DRY] ${asset.filename} → ${webpName}`);
      processed++;
      continue;
    }

    mkdirSync(targetDir, { recursive: true });
    await downscaleAsset(inputPath, outputPath, asset.dimensions.width, asset.dimensions.height);
    console.log(`    ${asset.filename} → ${webpName}`);
    processed++;
  }

  return processed;
}
