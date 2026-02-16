/**
 * Tile extrusion for seamless rendering.
 *
 * Creates a 1px border around each tile by duplicating edge pixels.
 * Updates TSX files with margin/spacing so RPG-JS/PixiJS reads the
 * extruded tileset correctly. This eliminates sub-pixel tile seam gaps.
 *
 * Input: 32×32 packed tiles (no spacing)
 * Output: 34×34 tiles (32 + 1px border on each side), spacing=2, margin=1
 *
 * Usage: pnpm exec tsx scripts/extrude-tilesets.ts [--dry-run]
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const TILE_SIZE = 32;
const EXTRUDE = 1; // pixels of border to add
const TMX_DIR = resolve(import.meta.dirname, '../main/server/maps/tmx');

async function extrudeTileset(pngPath: string, dryRun: boolean): Promise<boolean> {
  const { data, info } = await sharp(pngPath).raw().toBuffer({ resolveWithObject: true });
  const srcW = info.width;
  const srcH = info.height;
  const ch = info.channels;

  const cols = Math.floor(srcW / TILE_SIZE);
  const rows = Math.floor(srcH / TILE_SIZE);

  // New dimensions: each tile becomes (TILE_SIZE + 2*EXTRUDE), tiles packed with EXTRUDE*2 spacing + EXTRUDE margin
  const extTile = TILE_SIZE + 2 * EXTRUDE; // 34
  const dstW = cols * extTile;
  const dstH = rows * extTile;

  const dst = Buffer.alloc(dstW * dstH * ch);

  for (let tr = 0; tr < rows; tr++) {
    for (let tc = 0; tc < cols; tc++) {
      // Source tile origin
      const sx = tc * TILE_SIZE;
      const sy = tr * TILE_SIZE;
      // Destination tile origin (includes margin)
      const dx = tc * extTile + EXTRUDE;
      const dy = tr * extTile + EXTRUDE;

      // Copy the tile content
      for (let y = 0; y < TILE_SIZE; y++) {
        for (let x = 0; x < TILE_SIZE; x++) {
          const si = ((sy + y) * srcW + (sx + x)) * ch;
          const di = ((dy + y) * dstW + (dx + x)) * ch;
          for (let c = 0; c < ch; c++) dst[di + c] = data[si + c];
        }
      }

      // Extrude edges: duplicate border pixels into the margin

      // Top edge: duplicate row 0 of tile upward
      for (let x = 0; x < TILE_SIZE; x++) {
        const si = ((sy) * srcW + (sx + x)) * ch;
        const di = ((dy - 1) * dstW + (dx + x)) * ch;
        for (let c = 0; c < ch; c++) dst[di + c] = data[si + c];
      }

      // Bottom edge: duplicate last row of tile downward
      for (let x = 0; x < TILE_SIZE; x++) {
        const si = ((sy + TILE_SIZE - 1) * srcW + (sx + x)) * ch;
        const di = ((dy + TILE_SIZE) * dstW + (dx + x)) * ch;
        for (let c = 0; c < ch; c++) dst[di + c] = data[si + c];
      }

      // Left edge: duplicate col 0 of tile leftward
      for (let y = 0; y < TILE_SIZE; y++) {
        const si = ((sy + y) * srcW + sx) * ch;
        const di = ((dy + y) * dstW + (dx - 1)) * ch;
        for (let c = 0; c < ch; c++) dst[di + c] = data[si + c];
      }

      // Right edge: duplicate last col of tile rightward
      for (let y = 0; y < TILE_SIZE; y++) {
        const si = ((sy + y) * srcW + (sx + TILE_SIZE - 1)) * ch;
        const di = ((dy + y) * dstW + (dx + TILE_SIZE)) * ch;
        for (let c = 0; c < ch; c++) dst[di + c] = data[si + c];
      }

      // Corners: duplicate corner pixels
      const corners = [
        [0, 0, -1, -1],                              // top-left
        [TILE_SIZE - 1, 0, TILE_SIZE, -1],            // top-right
        [0, TILE_SIZE - 1, -1, TILE_SIZE],            // bottom-left
        [TILE_SIZE - 1, TILE_SIZE - 1, TILE_SIZE, TILE_SIZE], // bottom-right
      ];
      for (const [cx, cy, ex, ey] of corners) {
        const si = ((sy + cy) * srcW + (sx + cx)) * ch;
        const di = ((dy + ey) * dstW + (dx + ex)) * ch;
        for (let c = 0; c < ch; c++) dst[di + c] = data[si + c];
      }
    }
  }

  if (!dryRun) {
    await sharp(dst, { raw: { width: dstW, height: dstH, channels: ch } })
      .png()
      .toFile(pngPath);
  }

  return true;
}

function updateTsx(tsxPath: string, dryRun: boolean): boolean {
  let content = readFileSync(tsxPath, 'utf-8');

  // Skip if already extruded (has margin attribute)
  if (content.includes('margin=')) return false;

  // Parse current dimensions
  const tileCountMatch = content.match(/tilecount="(\d+)"/);
  const columnsMatch = content.match(/columns="(\d+)"/);
  const imgWidthMatch = content.match(/width="(\d+)"/g);
  const imgHeightMatch = content.match(/height="(\d+)"/g);

  if (!tileCountMatch || !columnsMatch) return false;

  const tileCount = parseInt(tileCountMatch[1]);
  const columns = parseInt(columnsMatch[1]);
  const rows = Math.ceil(tileCount / columns);

  // New image dimensions
  const extTile = TILE_SIZE + 2 * EXTRUDE;
  const newW = columns * extTile;
  const newH = rows * extTile;

  // Add margin and spacing to tileset element
  content = content.replace(
    /(<tileset[^>]*)(>)/,
    `$1 margin="${EXTRUDE}" spacing="${EXTRUDE * 2}"$2`,
  );

  // Update image width and height
  content = content.replace(
    /(<image[^>]*)\bwidth="\d+"([^>]*)\bheight="\d+"/,
    `$1width="${newW}"$2height="${newH}"`,
  );

  if (!dryRun) {
    writeFileSync(tsxPath, content);
  }

  return true;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  console.log(`Tile Extrusion ${dryRun ? '(DRY RUN)' : ''}`);
  console.log('─'.repeat(50));

  // Process tiles_*.png files
  const pngFiles = readdirSync(TMX_DIR)
    .filter((f) => f.startsWith('tiles_') && f.endsWith('.png'))
    .sort();

  for (const file of pngFiles) {
    const pngPath = resolve(TMX_DIR, file);
    await extrudeTileset(pngPath, dryRun);
    console.log(`  PNG: ${file} — extruded`);
  }

  // Process tiles_*.tsx files
  const tsxFiles = readdirSync(TMX_DIR)
    .filter((f) => f.startsWith('tiles_') && f.endsWith('.tsx'))
    .sort();

  let updated = 0;
  for (const file of tsxFiles) {
    const tsxPath = resolve(TMX_DIR, file);
    if (updateTsx(tsxPath, dryRun)) {
      console.log(`  TSX: ${file} — updated (margin=${EXTRUDE}, spacing=${EXTRUDE * 2})`);
      updated++;
    } else {
      console.log(`  TSX: ${file} — skipped (already extruded)`);
    }
  }

  console.log('─'.repeat(50));
  console.log(`${pngFiles.length} PNGs extruded, ${updated} TSXs updated`);
  if (dryRun) console.log('(Dry run — no files modified)');
}

main().catch(console.error);
