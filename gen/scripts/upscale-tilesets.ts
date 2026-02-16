/**
 * Backterria Tileset Upscale + Vibrancy Pipeline (US-001 + US-002)
 *
 * Step 1: 2x nearest-neighbor upscale all 16px Backterria tilesheets
 * Step 2: Copy already-32px assets as-is
 * Step 3: Pack individual Natural Props into composite tilesheets
 * Step 4: Generate vibrancy tier variants (muted/vivid) for terrain sheets
 *
 * Outputs to assets/tilesets/32px/
 * Usage: pnpm tileset:build
 */
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..', '..');
const BACKTERRIA = join(ROOT, 'assets', 'tilesets', 'backterria');
const OUTPUT = join(ROOT, 'assets', 'tilesets', '32px');

// ── Tilesheets to 2x upscale (all are 16px grids) ──────────────────
const UPSCALE_SHEETS: { src: string; out: string }[] = [
  {
    src: 'The Overworld 1-3.png',
    out: 'backterria-overworld.png',
  },
  {
    src: 'natural/Tiles/The Natural 1-4 Tileset.png',
    out: 'backterria-natural.png',
  },
  {
    src: 'The Plants 1-1.png',
    out: 'backterria-plants.png',
  },
  {
    src: 'The Interiors 1-5 Alpha.png',
    out: 'backterria-interiors.png',
  },
  {
    src: 'The Signs 16 v1-0 Alpha.png',
    out: 'backterria-signs-16.png',
  },
  {
    src: 'The Items v1-0 Alpha.png',
    out: 'backterria-items.png',
  },
  {
    src: 'The Symbols v1-0 Alpha.png',
    out: 'backterria-symbols.png',
  },
  {
    src: 'post-apocalyptic/Tiles/Building Tiles.png',
    out: 'backterria-postapoc-buildings.png',
  },
  {
    src: 'post-apocalyptic/Tiles/Road Tiles.png',
    out: 'backterria-postapoc-roads.png',
  },
  {
    src: 'post-apocalyptic/Tiles/Pavement Tiles.png',
    out: 'backterria-postapoc-pavement.png',
  },
];

// ── Already at 32px — copy as-is ───────────────────────────────────
const COPY_AS_IS: { src: string; out: string }[] = [
  {
    src: 'The Signs 32 v1-1 Alpha.png',
    out: 'backterria-signs-32.png',
  },
];

// ── Prop directories to pack into composite sheets ─────────────────
// Natural Props are individual PNGs at 32x32 or 64x64/64x95 (already 32px scale)
// Post-Apoc icons/props are 16x16 individual PNGs (need upscaling first)
interface PropGroup {
  dir: string;
  out: string;
  columns: number;
  upscale: boolean; // true = 16px sources, false = already 32px
}

const PROP_GROUPS: PropGroup[] = [
  {
    dir: 'natural/Props',
    out: 'backterria-natural-props.png',
    columns: 16,
    upscale: false, // Already 32px
  },
  {
    dir: 'natural/Icons',
    out: 'backterria-natural-icons.png',
    columns: 8,
    upscale: false, // Already 32px
  },
  {
    dir: 'post-apocalyptic/Icons',
    out: 'backterria-postapoc-icons.png',
    columns: 16,
    upscale: true, // 16px → 32px
  },
];

// ── Helpers ─────────────────────────────────────────────────────────

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/** Recursively collect all PNG files from a directory */
function collectPngs(dir: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectPngs(full));
    } else if (extname(entry).toLowerCase() === '.png') {
      results.push(full);
    }
  }
  return results.sort();
}

// ── Step 1: 2x Nearest-Neighbor Upscale ─────────────────────────────

async function upscaleSheet(src: string, out: string): Promise<void> {
  const srcPath = join(BACKTERRIA, src);
  if (!existsSync(srcPath)) {
    console.warn(`  SKIP (not found): ${src}`);
    return;
  }

  const meta = await sharp(srcPath).metadata();
  const w = meta.width!;
  const h = meta.height!;

  await sharp(srcPath)
    .resize(w * 2, h * 2, { kernel: sharp.kernel.nearest })
    .png()
    .toFile(join(OUTPUT, out));

  console.log(`  ${src} (${w}x${h}) → ${out} (${w * 2}x${h * 2})`);
}

// ── Step 2: Copy already-32px assets ────────────────────────────────

async function copySheet(src: string, out: string): Promise<void> {
  const srcPath = join(BACKTERRIA, src);
  if (!existsSync(srcPath)) {
    console.warn(`  SKIP (not found): ${src}`);
    return;
  }

  const meta = await sharp(srcPath).metadata();
  // Just copy through sharp to normalize format
  await sharp(srcPath).png().toFile(join(OUTPUT, out));

  console.log(`  ${src} (${meta.width}x${meta.height}) → ${out} (copied)`);
}

// ── Step 3: Pack individual props into composite tilesheets ─────────

async function packProps(group: PropGroup): Promise<void> {
  const dir = join(BACKTERRIA, group.dir);
  const pngs = collectPngs(dir);

  if (pngs.length === 0) {
    console.warn(`  SKIP (no PNGs): ${group.dir}`);
    return;
  }

  // Read all prop images and get their metadata
  interface PropImage {
    path: string;
    name: string;
    width: number;
    height: number;
    buffer: Buffer;
  }

  const props: PropImage[] = [];
  for (const p of pngs) {
    const img = sharp(p);
    const meta = await img.metadata();
    let w = meta.width!;
    let h = meta.height!;
    let buf: Buffer;

    if (group.upscale) {
      // 16px → 32px
      buf = await sharp(p)
        .resize(w * 2, h * 2, { kernel: sharp.kernel.nearest })
        .png()
        .toBuffer();
      w *= 2;
      h *= 2;
    } else {
      buf = await sharp(p).png().toBuffer();
    }

    props.push({
      path: p,
      name: basename(p, '.png'),
      width: w,
      height: h,
      buffer: buf,
    });
  }

  // Determine cell size (max dimension, rounded up to 32px grid)
  const tileSize = 32;
  const maxW = Math.max(...props.map((p) => p.width));
  const maxH = Math.max(...props.map((p) => p.height));
  const cellW = Math.ceil(maxW / tileSize) * tileSize;
  const cellH = Math.ceil(maxH / tileSize) * tileSize;

  const cols = group.columns;
  const rows = Math.ceil(props.length / cols);
  const sheetW = cols * cellW;
  const sheetH = rows * cellH;

  // Build composite
  const composites: sharp.OverlayOptions[] = props.map((prop, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // Center prop in cell
    const offsetX = col * cellW + Math.floor((cellW - prop.width) / 2);
    const offsetY = row * cellH + Math.floor((cellH - prop.height) / 2);
    return {
      input: prop.buffer,
      left: offsetX,
      top: offsetY,
    };
  });

  await sharp({
    create: {
      width: sheetW,
      height: sheetH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toFile(join(OUTPUT, group.out));

  console.log(
    `  ${group.dir} (${props.length} props) → ${group.out} (${sheetW}x${sheetH}, ${cols}x${rows} grid, ${cellW}x${cellH} cells)`,
  );
}

// ── Step 4: Vibrancy tier variants ──────────────────────────────────

// Terrain sheets that get vibrancy variants (not props/icons/signs)
const VIBRANCY_SHEETS = [
  'backterria-overworld.png',
  'backterria-natural.png',
  'backterria-plants.png',
  'backterria-interiors.png',
  'backterria-natural-props.png',
  'backterria-postapoc-buildings.png',
  'backterria-postapoc-roads.png',
  'backterria-postapoc-pavement.png',
];

interface VibrancyTier {
  suffix: string;
  saturation: number; // multiplier: 1.0 = unchanged
  brightness: number; // multiplier: 1.0 = unchanged
}

const VIBRANCY_TIERS: VibrancyTier[] = [
  { suffix: '_muted', saturation: 0.6, brightness: 0.85 },
  { suffix: '_vivid', saturation: 1.3, brightness: 1.1 },
];

async function generateVibrancyVariants(filename: string): Promise<void> {
  const srcPath = join(OUTPUT, filename);
  if (!existsSync(srcPath)) {
    console.warn(`  SKIP (not found): ${filename}`);
    return;
  }

  const base = filename.replace('.png', '');
  for (const tier of VIBRANCY_TIERS) {
    const outName = `${base}${tier.suffix}.png`;
    await sharp(srcPath)
      .modulate({
        saturation: tier.saturation,
        brightness: tier.brightness,
      })
      .png()
      .toFile(join(OUTPUT, outName));

    console.log(`  ${filename} → ${outName} (sat:${tier.saturation} bri:${tier.brightness})`);
  }
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('Backterria Tileset Upscale Pipeline');
  console.log('===================================\n');

  ensureDir(OUTPUT);

  // Step 1: Upscale 16px tilesheets
  console.log('Step 1: 2x Nearest-Neighbor Upscale (16px → 32px)');
  for (const sheet of UPSCALE_SHEETS) {
    await upscaleSheet(sheet.src, sheet.out);
  }

  // Step 2: Copy already-32px sheets
  console.log('\nStep 2: Copy Already-32px Assets');
  for (const sheet of COPY_AS_IS) {
    await copySheet(sheet.src, sheet.out);
  }

  // Step 3: Pack props into composite sheets
  console.log('\nStep 3: Pack Individual Props → Composite Tilesheets');
  for (const group of PROP_GROUPS) {
    await packProps(group);
  }

  // Step 4: Generate vibrancy tier variants
  console.log('\nStep 4: Vibrancy Tier Variants (Muted + Vivid)');
  for (const sheet of VIBRANCY_SHEETS) {
    await generateVibrancyVariants(sheet);
  }

  // Summary
  const outputs = readdirSync(OUTPUT).filter((f) => f.endsWith('.png'));
  console.log(`\nDone! ${outputs.length} tilesheets in ${OUTPUT}`);
  for (const f of outputs.sort()) {
    const meta = await sharp(join(OUTPUT, f)).metadata();
    console.log(`  ${f} — ${meta.width}x${meta.height}`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
