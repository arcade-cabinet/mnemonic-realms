/**
 * Repair white edge pixels in AI-generated tileset PNGs.
 *
 * AI image models often add subtle white borders between tiles in a tileset grid.
 * This script detects white-ish edge pixels on each 32×32 tile boundary and
 * replaces them with the nearest interior pixel color ("inward extrusion").
 *
 * Only repairs pixels that are significantly whiter than their interior neighbor —
 * genuinely white tile content is preserved.
 *
 * Usage: pnpm exec tsx scripts/repair-tileset-edges.ts [--dry-run]
 */

import { readdirSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import sharp from 'sharp';

const TILE_SIZE = 32;
const WHITE_THRESHOLD = 235; // Pixel luminance above this = candidate for repair
const DIFF_THRESHOLD = 40; // Only repair if edge is this much brighter than interior neighbor

const TMX_DIR = resolve(import.meta.dirname, '../main/server/maps/tmx');

function luminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

async function repairTileset(filePath: string, dryRun: boolean): Promise<{ repaired: number; total: number }> {
  const { data, info } = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const pixels = Buffer.from(data); // mutable copy

  const cols = Math.floor(w / TILE_SIZE);
  const rows = Math.floor(h / TILE_SIZE);
  let repaired = 0;
  const totalEdgePixels = (cols - 1) * h * 2 + (rows - 1) * w * 2; // approximate

  // Repair vertical tile boundaries (column edges)
  for (let tc = 1; tc < cols; tc++) {
    const bx = tc * TILE_SIZE; // boundary x: right edge of left tile = bx-1, left edge of right tile = bx
    for (let y = 0; y < h; y++) {
      // Right edge of left tile (bx-1): interior neighbor is bx-2
      repairPixel(pixels, w, ch, bx - 1, y, bx - 2, y);
      // Left edge of right tile (bx): interior neighbor is bx+1
      repairPixel(pixels, w, ch, bx, y, bx + 1, y);
    }
  }

  // Repair horizontal tile boundaries (row edges)
  for (let tr = 1; tr < rows; tr++) {
    const by = tr * TILE_SIZE;
    for (let x = 0; x < w; x++) {
      // Bottom edge of top tile (by-1): interior neighbor is by-2
      repairPixel(pixels, w, ch, x, by - 1, x, by - 2);
      // Top edge of bottom tile (by): interior neighbor is by+1
      repairPixel(pixels, w, ch, x, by, x, by + 1);
    }
  }

  function repairPixel(buf: Buffer, width: number, channels: number, ex: number, ey: number, ix: number, iy: number) {
    if (ix < 0 || ix >= width || iy < 0 || iy >= h) return;
    const ei = (ey * width + ex) * channels;
    const ii = (iy * width + ix) * channels;

    const eLum = luminance(buf[ei], buf[ei + 1], buf[ei + 2]);
    const iLum = luminance(buf[ii], buf[ii + 1], buf[ii + 2]);

    // Only repair if the edge pixel is white-ish AND significantly brighter than interior
    if (eLum >= WHITE_THRESHOLD && (eLum - iLum) >= DIFF_THRESHOLD) {
      buf[ei] = buf[ii]; // R
      buf[ei + 1] = buf[ii + 1]; // G
      buf[ei + 2] = buf[ii + 2]; // B
      if (channels > 3) buf[ei + 3] = buf[ii + 3]; // A
      repaired++;
    }
  }

  if (!dryRun && repaired > 0) {
    await sharp(pixels, { raw: { width: w, height: h, channels: ch } })
      .png()
      .toFile(filePath);
  }

  return { repaired, total: totalEdgePixels };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  console.log(`Tileset Edge Repair ${dryRun ? '(DRY RUN)' : ''}`);
  console.log('─'.repeat(50));

  const files = readdirSync(TMX_DIR)
    .filter((f) => f.startsWith('tiles_') && f.endsWith('.png'))
    .sort();

  let totalFiles = 0;
  let totalRepaired = 0;

  for (const file of files) {
    const filePath = resolve(TMX_DIR, file);
    const { repaired, total } = await repairTileset(filePath, dryRun);
    const pct = total > 0 ? ((100 * repaired) / total).toFixed(1) : '0.0';
    const status = repaired > 0 ? `${repaired} pixels repaired (${pct}%)` : 'clean';
    console.log(`  ${file}: ${status}`);
    totalFiles++;
    totalRepaired += repaired;
  }

  console.log('─'.repeat(50));
  console.log(`${totalFiles} tilesets processed, ${totalRepaired} pixels repaired total`);
  if (dryRun) console.log('(Dry run — no files modified)');
}

main().catch(console.error);
