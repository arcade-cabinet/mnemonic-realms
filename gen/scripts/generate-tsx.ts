/**
 * TSX Definition Generator (US-004)
 *
 * Generates Tiled .tsx tileset definition files for all Backterria 32px
 * tilesheets. Removes old AI-generated TSX + PNG files.
 *
 * TSX files are placed in main/server/maps/tmx/ alongside TMX map files.
 * Image sources use relative paths to assets/tilesets/32px/.
 *
 * Usage: pnpm tileset:tsx
 */
import { readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..', '..');
const SHEETS_DIR = join(ROOT, 'assets', 'tilesets', '32px');
const TMX_DIR = join(ROOT, 'main', 'server', 'maps', 'tmx');

// Relative path from TMX_DIR to SHEETS_DIR
const REL_PATH = '../../../../assets/tilesets/32px';

function generateTsx(
  name: string,
  imagePath: string,
  width: number,
  height: number,
  tileWidth: number,
  tileHeight: number,
): string {
  const columns = Math.floor(width / tileWidth);
  const tilecount = columns * Math.floor(height / tileHeight);

  return `<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.11.2" name="${name}" tilewidth="${tileWidth}" tileheight="${tileHeight}" tilecount="${tilecount}" columns="${columns}">
 <image source="${imagePath}" width="${width}" height="${height}"/>
</tileset>
`;
}

async function main() {
  console.log('TSX Definition Generator');
  console.log('========================\n');

  // Step 1: Remove old AI-generated files
  console.log('Step 1: Remove Old AI-Generated TSX + PNG Files');
  const oldFiles = readdirSync(TMX_DIR).filter(
    (f) =>
      (f.startsWith('tiles_') || f.startsWith('overlay_')) &&
      (f.endsWith('.tsx') || f.endsWith('.png')),
  );

  for (const f of oldFiles) {
    unlinkSync(join(TMX_DIR, f));
  }
  console.log(`  Removed ${oldFiles.length} old AI-generated files`);

  // Step 2: Generate new TSX files from 32px sheets
  console.log('\nStep 2: Generate New Backterria TSX Definitions');
  const sheets = readdirSync(SHEETS_DIR)
    .filter((f) => f.endsWith('.png'))
    .sort();

  let generated = 0;
  for (const sheet of sheets) {
    const meta = await sharp(join(SHEETS_DIR, sheet)).metadata();
    const w = meta.width!;
    const h = meta.height!;

    // Determine tile size — all Backterria sheets use 32x32 tiles
    // Props sheet has 64x96 cells but individual tiles are 32x32 within
    const tileW = 32;
    const tileH = 32;

    const name = sheet.replace('.png', '');
    const imagePath = `${REL_PATH}/${sheet}`;
    const tsx = generateTsx(name, imagePath, w, h, tileW, tileH);
    const outPath = join(TMX_DIR, `${name}.tsx`);

    writeFileSync(outPath, tsx, 'utf-8');
    const cols = Math.floor(w / tileW);
    const rows = Math.floor(h / tileH);
    console.log(`  ${name}.tsx — ${cols}x${rows} tiles (${cols * rows} total)`);
    generated++;
  }

  console.log(`\nDone! Generated ${generated} TSX files, removed ${oldFiles.length} old files`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
