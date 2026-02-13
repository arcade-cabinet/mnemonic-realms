#!/usr/bin/env npx tsx
/**
 * Asset Integration Script
 *
 * Post-processes generated assets from gen/output/ and integrates them
 * into the RPG-JS module structure:
 *
 * 1. Downscales images to exact pixel dimensions via sharp
 * 2. Copies tilesets → main/server/maps/tmx/ (where TMX files reference them)
 * 3. Copies sprites → main/client/characters/ (where @Spritesheet decorators load them)
 * 4. Copies portraits → main/client/gui/portraits/ (for dialogue Vue components)
 * 5. Copies item icons → main/client/gui/icons/ (for inventory UI)
 * 6. Generates @Spritesheet TypeScript bindings for new sprites
 * 7. Generates tileset XML fragments for TMX map files
 *
 * Usage:
 *   pnpm exec tsx gen/scripts/integrate-assets.ts           # Process all
 *   pnpm exec tsx gen/scripts/integrate-assets.ts tilesets   # Process tilesets only
 *   pnpm exec tsx gen/scripts/integrate-assets.ts sprites    # Process sprites only
 *   pnpm exec tsx gen/scripts/integrate-assets.ts --dry-run  # Preview only
 */

import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, basename, extname } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname ?? process.cwd(), import.meta.dirname ? '../..' : '.');
const GEN_OUTPUT = resolve(PROJECT_ROOT, 'gen/output');
const MANIFESTS_DIR = resolve(PROJECT_ROOT, 'gen/manifests');

// RPG-JS target directories
const TARGETS = {
  tilesets: resolve(PROJECT_ROOT, 'main/server/maps/tmx'),
  sprites: resolve(PROJECT_ROOT, 'main/client/characters'),
  portraits: resolve(PROJECT_ROOT, 'main/client/gui/portraits'),
  items: resolve(PROJECT_ROOT, 'main/client/gui/icons'),
};

// ============================================================================
// POST-PROCESSING
// ============================================================================

interface AssetEntry {
  id: string;
  filename: string;
  status: string;
  dimensions: { width: number; height: number; genWidth: number; genHeight: number };
  spriteSize?: string;
  name?: string;
  biome?: string;
  tier?: string;
  category?: string;
  tileSize?: number;
  gridCols?: number;
  gridRows?: number;
}

/** Output format: lossless WebP for better compression with transparency */
const OUTPUT_EXT = '.webp';

/**
 * Downscale a generated image to its target pixel dimensions using
 * nearest-neighbor interpolation (preserves pixel art crispness).
 * Outputs lossless WebP for optimal compression with transparency support.
 */
async function downscaleAsset(
  inputPath: string,
  outputPath: string,
  targetWidth: number,
  targetHeight: number,
): Promise<void> {
  await sharp(inputPath)
    .resize(targetWidth, targetHeight, {
      kernel: sharp.kernel.nearest,
      fit: 'fill',
    })
    .webp({ lossless: true })
    .toFile(outputPath);
}

// ============================================================================
// TILESET INTEGRATION
// ============================================================================

async function integrateTilesets(dryRun: boolean): Promise<number> {
  const manifestPath = resolve(MANIFESTS_DIR, 'tilesets/manifest.json');
  if (!existsSync(manifestPath)) { console.log('  No tileset manifest found'); return 0; }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const generated = manifest.assets.filter((a: AssetEntry) => a.status === 'generated');
  console.log(`  Tilesets: ${generated.length} generated assets to process`);

  let processed = 0;
  for (const asset of generated as AssetEntry[]) {
    const inputPath = resolve(GEN_OUTPUT, 'tilesets', asset.filename);
    if (!existsSync(inputPath)) continue;

    // Tilesets stay as PNG for Tiled TMX compatibility
    const outputPath = resolve(TARGETS.tilesets, asset.filename);
    if (dryRun) {
      console.log(`    [DRY] ${asset.filename} → ${asset.dimensions.width}×${asset.dimensions.height}`);
      processed++;
      continue;
    }

    mkdirSync(TARGETS.tilesets, { recursive: true });
    // Tilesets use PNG (Tiled editor requirement)
    await sharp(inputPath)
      .resize(asset.dimensions.width, asset.dimensions.height, { kernel: sharp.kernel.nearest, fit: 'fill' })
      .png()
      .toFile(outputPath);
    console.log(`    ${asset.filename} → ${asset.dimensions.width}×${asset.dimensions.height} (PNG for TMX)`);
    processed++;
  }

  // Generate tileset XML fragments for TMX files
  if (!dryRun && processed > 0) {
    generateTilesetTsx(generated as AssetEntry[]);
  }

  return processed;
}

/**
 * Generate .tsx (Tiled tileset XML) files for each processed tileset.
 * TMX maps reference these to know tile dimensions and image source.
 */
function generateTilesetTsx(assets: AssetEntry[]): void {
  for (const asset of assets) {
    if (!asset.tileSize || !asset.gridCols || !asset.gridRows) continue;

    const tileCount = asset.gridCols * asset.gridRows;
    const imageWidth = asset.gridCols * asset.tileSize;
    const imageHeight = asset.gridRows * asset.tileSize;
    const tsxName = asset.filename.replace('.png', '.tsx');

    const tsx = `<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.11.2" name="${asset.id}" tilewidth="${asset.tileSize}" tileheight="${asset.tileSize}" tilecount="${tileCount}" columns="${asset.gridCols}">
 <image source="${asset.filename}" width="${imageWidth}" height="${imageHeight}"/>
</tileset>
`;

    const outputPath = resolve(TARGETS.tilesets, tsxName);
    writeFileSync(outputPath, tsx);
    console.log(`    Generated TSX: ${tsxName}`);
  }
}

// ============================================================================
// SPRITE INTEGRATION
// ============================================================================

async function integrateSprites(dryRun: boolean): Promise<number> {
  const manifestPath = resolve(MANIFESTS_DIR, 'sprites/manifest.json');
  if (!existsSync(manifestPath)) { console.log('  No sprite manifest found'); return 0; }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const generated = manifest.assets.filter((a: AssetEntry) => a.status === 'generated');
  console.log(`  Sprites: ${generated.length} generated assets to process`);

  let processed = 0;
  const spritesheetEntries: { id: string; name: string; filename: string; width: number; height: number; framesWidth: number; framesHeight: number }[] = [];

  for (const asset of generated as AssetEntry[]) {
    const inputPath = resolve(GEN_OUTPUT, 'sprites', asset.filename);
    if (!existsSync(inputPath)) continue;

    const webpFilename = asset.filename.replace(/\.png$/, OUTPUT_EXT);
    const outputPath = resolve(TARGETS.sprites, webpFilename);
    if (dryRun) {
      console.log(`    [DRY] ${asset.filename} → ${webpFilename} ${asset.dimensions.width}×${asset.dimensions.height}`);
      processed++;
      continue;
    }

    mkdirSync(TARGETS.sprites, { recursive: true });
    await downscaleAsset(inputPath, outputPath, asset.dimensions.width, asset.dimensions.height);
    console.log(`    ${asset.filename} → ${webpFilename} ${asset.dimensions.width}×${asset.dimensions.height}`);

    // Track for spritesheet binding generation
    const frameW = asset.spriteSize === '64x64' ? 64 : 32;
    const frameH = asset.spriteSize === '64x64' ? 64 : 32;
    spritesheetEntries.push({
      id: asset.id,
      name: asset.name || asset.id,
      filename: webpFilename,
      width: frameW,
      height: frameH,
      framesWidth: 3,
      framesHeight: 4,
    });
    processed++;
  }

  // Generate @Spritesheet bindings
  if (!dryRun && spritesheetEntries.length > 0) {
    generateSpritesheetBindings(spritesheetEntries);
  }

  return processed;
}

/**
 * Generate TypeScript @Spritesheet decorator bindings for RPG-JS.
 * Writes to main/client/characters/generated.ts
 */
function generateSpritesheetBindings(
  entries: { id: string; name: string; filename: string; width: number; height: number; framesWidth: number; framesHeight: number }[],
): void {
  const imports = `import { Spritesheet, Presets } from '@rpgjs/client';
const { RMSpritesheet } = Presets;
`;

  const declarations = entries.map((e) => {
    const className = e.id
      .replace(/^sprite-/, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');

    return `@Spritesheet({
  id: '${e.id}',
  image: require('./${e.filename}'),
  ...RMSpritesheet(${e.width}, ${e.height}),
})
export class ${className}Sprite {}`;
  });

  const classNames = entries.map((e) =>
    e.id.replace(/^sprite-/, '').split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Sprite',
  );

  const content = `/**
 * Auto-generated spritesheet bindings from GenAI pipeline.
 * DO NOT EDIT — regenerate with: pnpm exec tsx gen/scripts/integrate-assets.ts sprites
 */

${imports}
${declarations.join('\n\n')}

/** All generated sprite classes for RpgModule registration */
export const generatedSprites = [${classNames.join(', ')}];
`;

  const outputPath = resolve(TARGETS.sprites, 'generated.ts');
  writeFileSync(outputPath, content);
  console.log(`    Generated spritesheet bindings: ${entries.length} sprites → generated.ts`);
}

// ============================================================================
// PORTRAIT & ITEM INTEGRATION
// ============================================================================

async function integratePortraits(dryRun: boolean): Promise<number> {
  const manifestPath = resolve(MANIFESTS_DIR, 'portraits/manifest.json');
  if (!existsSync(manifestPath)) { console.log('  No portrait manifest found'); return 0; }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const generated = manifest.assets.filter((a: AssetEntry) => a.status === 'generated');
  console.log(`  Portraits: ${generated.length} generated assets to process`);

  let processed = 0;
  for (const asset of generated as AssetEntry[]) {
    const inputPath = resolve(GEN_OUTPUT, 'portraits', asset.filename);
    if (!existsSync(inputPath)) continue;

    const webpFilename = asset.filename.replace(/\.png$/, OUTPUT_EXT);
    const outputPath = resolve(TARGETS.portraits, webpFilename);
    if (dryRun) {
      console.log(`    [DRY] ${asset.filename} → ${webpFilename} ${asset.dimensions.width}×${asset.dimensions.height}`);
      processed++;
      continue;
    }

    mkdirSync(TARGETS.portraits, { recursive: true });
    await downscaleAsset(inputPath, outputPath, asset.dimensions.width, asset.dimensions.height);
    console.log(`    ${asset.filename} → ${webpFilename} ${asset.dimensions.width}×${asset.dimensions.height}`);
    processed++;
  }

  return processed;
}

async function integrateItems(dryRun: boolean): Promise<number> {
  const manifestPath = resolve(MANIFESTS_DIR, 'items/manifest.json');
  if (!existsSync(manifestPath)) { console.log('  No item manifest found'); return 0; }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const generated = manifest.assets.filter((a: AssetEntry) => a.status === 'generated');
  console.log(`  Items: ${generated.length} generated assets to process`);

  let processed = 0;
  for (const asset of generated as AssetEntry[]) {
    const inputPath = resolve(GEN_OUTPUT, 'items', asset.filename);
    if (!existsSync(inputPath)) continue;

    const webpFilename = asset.filename.replace(/\.png$/, OUTPUT_EXT);
    const outputPath = resolve(TARGETS.items, webpFilename);
    if (dryRun) {
      console.log(`    [DRY] ${asset.filename} → ${webpFilename} ${asset.dimensions.width}×${asset.dimensions.height}`);
      processed++;
      continue;
    }

    mkdirSync(TARGETS.items, { recursive: true });
    await downscaleAsset(inputPath, outputPath, asset.dimensions.width, asset.dimensions.height);
    console.log(`    ${asset.filename} → ${webpFilename} ${asset.dimensions.width}×${asset.dimensions.height}`);
    processed++;
  }

  return processed;
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const targets = args.filter((a) => !a.startsWith('--'));
  const processAll = targets.length === 0;

  console.log('Mnemonic Realms — Asset Integration\n');

  let total = 0;

  if (processAll || targets.includes('tilesets')) {
    total += await integrateTilesets(dryRun);
  }
  if (processAll || targets.includes('sprites')) {
    total += await integrateSprites(dryRun);
  }
  if (processAll || targets.includes('portraits')) {
    total += await integratePortraits(dryRun);
  }
  if (processAll || targets.includes('items')) {
    total += await integrateItems(dryRun);
  }

  console.log(`\nDone. ${total} assets ${dryRun ? 'would be' : ''} processed.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
