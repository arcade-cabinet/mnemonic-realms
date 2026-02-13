/** Integrates generated tilesets into RPG-JS map directory. */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { GEN_OUTPUT, type IntegrationAsset, MANIFESTS_DIR, TARGETS } from './shared';

function generateTilesetTsx(assets: IntegrationAsset[]): void {
  for (const asset of assets) {
    if (!asset.tileSize || !asset.gridCols || !asset.gridRows) continue;
    const tileCount = asset.gridCols * asset.gridRows;
    const imageW = asset.gridCols * asset.tileSize;
    const imageH = asset.gridRows * asset.tileSize;
    const tsxName = asset.filename.replace('.png', '.tsx');

    const tsx = `<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.11.2" name="${asset.id}" tilewidth="${asset.tileSize}" tileheight="${asset.tileSize}" tilecount="${tileCount}" columns="${asset.gridCols}">
 <image source="${asset.filename}" width="${imageW}" height="${imageH}"/>
</tileset>
`;
    writeFileSync(resolve(TARGETS.tilesets, tsxName), tsx);
    console.log(`    Generated TSX: ${tsxName}`);
  }
}

export async function integrateTilesets(dryRun: boolean): Promise<number> {
  const manifestPath = resolve(MANIFESTS_DIR, 'tilesets/manifest.json');
  if (!existsSync(manifestPath)) {
    console.log('  No tileset manifest');
    return 0;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const generated = manifest.assets.filter((a: IntegrationAsset) => a.status === 'generated');
  console.log(`  Tilesets: ${generated.length} to process`);

  let processed = 0;
  for (const asset of generated as IntegrationAsset[]) {
    const inputPath = resolve(GEN_OUTPUT, 'tilesets', asset.filename);
    if (!existsSync(inputPath)) continue;

    const outputPath = resolve(TARGETS.tilesets, asset.filename);
    if (dryRun) {
      console.log(
        `    [DRY] ${asset.filename} → ${asset.dimensions.width}×${asset.dimensions.height}`,
      );
      processed++;
      continue;
    }

    mkdirSync(TARGETS.tilesets, { recursive: true });
    await sharp(inputPath)
      .ensureAlpha()
      .resize(asset.dimensions.width, asset.dimensions.height, {
        kernel: sharp.kernel.nearest,
        fit: 'fill',
      })
      .png()
      .toFile(outputPath);
    console.log(
      `    ${asset.filename} → ${asset.dimensions.width}×${asset.dimensions.height} (PNG)`,
    );
    processed++;
  }

  if (!dryRun && processed > 0) {
    generateTilesetTsx(generated as IntegrationAsset[]);
  }
  return processed;
}
