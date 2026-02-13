/** Integrates sprites into RPG-JS characters directory. */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  downscaleAsset,
  GEN_OUTPUT,
  type IntegrationAsset,
  MANIFESTS_DIR,
  OUTPUT_EXT,
  TARGETS,
} from './shared';

interface SpriteEntry {
  id: string;
  name: string;
  filename: string;
  width: number;
  height: number;
}

function pascal(id: string): string {
  return id
    .replace(/^sprite-/, '')
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');
}

function generateSpritesheetBindings(entries: SpriteEntry[]): void {
  const declarations = entries.map((e) => {
    const cls = pascal(e.id);
    return `@Spritesheet({
  id: '${e.id}',
  image: require('./${e.filename}'),
  ...RMSpritesheet(${e.width}, ${e.height}),
})
export class ${cls}Sprite {}`;
  });

  const classNames = entries.map((e) => `${pascal(e.id)}Sprite`);

  const content = `/**
 * Auto-generated spritesheet bindings from GenAI pipeline.
 * Regenerate with: pnpm exec tsx gen/scripts/integrate-assets.ts sprites
 */

import { Spritesheet, Presets } from '@rpgjs/client';
const { RMSpritesheet } = Presets;

${declarations.join('\n\n')}

export const generatedSprites = [${classNames.join(', ')}];
`;
  writeFileSync(resolve(TARGETS.sprites, 'generated.ts'), content);
  console.log(`    Generated bindings: ${entries.length} sprites → generated.ts`);
}

export async function integrateSprites(dryRun: boolean): Promise<number> {
  const manifestPath = resolve(MANIFESTS_DIR, 'sprites/manifest.json');
  if (!existsSync(manifestPath)) {
    console.log('  No sprite manifest');
    return 0;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const generated = manifest.assets.filter((a: IntegrationAsset) => a.status === 'generated');
  console.log(`  Sprites: ${generated.length} to process`);

  let processed = 0;
  const entries: SpriteEntry[] = [];

  for (const asset of generated as IntegrationAsset[]) {
    const inputPath = resolve(GEN_OUTPUT, 'sprites', asset.filename);
    if (!existsSync(inputPath)) continue;

    const webpName = asset.filename.replace(/\.png$/, OUTPUT_EXT);
    const outputPath = resolve(TARGETS.sprites, webpName);
    if (dryRun) {
      console.log(`    [DRY] ${asset.filename} → ${webpName}`);
      processed++;
      continue;
    }

    mkdirSync(TARGETS.sprites, { recursive: true });
    await downscaleAsset(inputPath, outputPath, asset.dimensions.width, asset.dimensions.height);
    console.log(`    ${asset.filename} → ${webpName}`);

    // RMSpritesheet(frameWidth, frameHeight) — RPG Maker standard is 3 cols x 4 rows.
    // Standard sprites: 32px wide x 64px tall frames (character taller than wide).
    // Boss sprites: 64px wide x 64px tall frames (large square frames).
    const fw = asset.spriteSize === '64x64' ? 64 : 32;
    const fh = 64;
    entries.push({
      id: asset.id,
      name: asset.name || asset.id,
      filename: webpName,
      width: fw,
      height: fh,
    });
    processed++;
  }

  if (!dryRun && entries.length > 0) generateSpritesheetBindings(entries);
  return processed;
}
