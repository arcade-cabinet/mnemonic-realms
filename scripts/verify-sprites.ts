/**
 * Spritesheet Quality Verifier
 *
 * Analyzes all spritesheets in assets/sprites/ for common AI generation artifacts:
 *   1. Solid lines (rows/columns with zero variance — rendering artifacts)
 *   2. Near-identical frames (animation frames too similar — no real animation)
 *   3. Blank/transparent frames (empty frames that shouldn't be)
 *   4. Dimension mismatches (wrong size for CHAR or BOSS sheets)
 *
 * Usage: pnpm exec tsx scripts/verify-sprites.ts [--json] [--fix]
 *   --json   Output machine-readable JSON instead of human-readable report
 *   --fix    Move flagged sprites to assets/sprites/_quarantine/ for manual review
 */

import { existsSync, mkdirSync, readdirSync, renameSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import sharp from 'sharp';

const SPRITES_DIR = resolve(import.meta.dirname ?? process.cwd(), '../assets/sprites');
const QUARANTINE_DIR = join(SPRITES_DIR, '_quarantine');

// Expected dimensions from generated.ts
const CHAR_SHEET = { width: 96, height: 256, cols: 3, rows: 4, frameW: 32, frameH: 64 };
const BOSS_SHEET = { width: 192, height: 256, cols: 3, rows: 4, frameW: 64, frameH: 64 };

// Thresholds
const SOLID_LINE_VARIANCE_THRESHOLD = 2; // Max std dev for a row/col to be "solid"
const SOLID_LINE_MIN_COUNT = 3; // Flag if this many solid lines found
const FRAME_SIMILARITY_THRESHOLD = 0.97; // Cosine similarity above this = "too similar"
const BLANK_FRAME_ALPHA_THRESHOLD = 10; // Average alpha below this = "blank"
const BLANK_FRAME_VARIANCE_THRESHOLD = 5; // RGB variance below this = "single color"

interface FrameStats {
  row: number;
  col: number;
  avgAlpha: number;
  rgbVariance: number;
  pixels: Uint8Array;
}

interface SpriteIssue {
  type: 'solid-lines' | 'identical-frames' | 'blank-frames' | 'wrong-dimensions';
  severity: 'error' | 'warning';
  detail: string;
}

interface SpriteReport {
  file: string;
  width: number;
  height: number;
  expectedType: 'char' | 'boss' | 'unknown';
  issues: SpriteIssue[];
  pass: boolean;
}

/** Extract raw RGBA pixels for a sub-region of the image. */
async function extractFrame(
  img: sharp.Sharp,
  x: number,
  y: number,
  w: number,
  h: number,
): Promise<Uint8Array> {
  const { data } = await img
    .clone()
    .extract({ left: x, top: y, width: w, height: h })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}

/** Compute standard deviation of an array of numbers. */
function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sq = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return Math.sqrt(sq);
}

/** Check for solid horizontal lines (rows with near-zero variance). */
function detectSolidRows(pixels: Uint8Array, width: number, height: number): number[] {
  const solidRows: number[] = [];
  for (let y = 0; y < height; y++) {
    const rowPixels: number[] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // Use luminance to flatten to single value
      rowPixels.push(pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114);
    }
    if (stdDev(rowPixels) < SOLID_LINE_VARIANCE_THRESHOLD) {
      solidRows.push(y);
    }
  }
  return solidRows;
}

/** Check for solid vertical lines (columns with near-zero variance). */
function detectSolidCols(pixels: Uint8Array, width: number, height: number): number[] {
  const solidCols: number[] = [];
  for (let x = 0; x < width; x++) {
    const colPixels: number[] = [];
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 4;
      colPixels.push(pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114);
    }
    if (stdDev(colPixels) < SOLID_LINE_VARIANCE_THRESHOLD) {
      solidCols.push(x);
    }
  }
  return solidCols;
}

/** Compute normalized cross-correlation between two same-size pixel buffers. */
function frameSimilarity(a: Uint8Array, b: Uint8Array): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  // Compare RGB channels only (skip alpha)
  for (let i = 0; i < a.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const va = a[i + c];
      const vb = b[i + c];
      dotProduct += va * vb;
      normA += va * va;
      normB += vb * vb;
    }
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 1 : dotProduct / denom;
}

/** Get frame statistics. */
function analyzeFrame(pixels: Uint8Array): { avgAlpha: number; rgbVariance: number } {
  let alphaSum = 0;
  const rgbValues: number[] = [];

  for (let i = 0; i < pixels.length; i += 4) {
    alphaSum += pixels[i + 3];
    rgbValues.push(pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114);
  }

  return {
    avgAlpha: alphaSum / (pixels.length / 4),
    rgbVariance: stdDev(rgbValues),
  };
}

async function verifySpritesheet(filePath: string): Promise<SpriteReport> {
  const file = basename(filePath);
  const img = sharp(filePath);
  const meta = await img.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  // Determine expected sheet type
  const isBoss = file.startsWith('sprite_boss_');
  const expectedType = isBoss ? 'boss' : 'char';
  const sheet = isBoss ? BOSS_SHEET : CHAR_SHEET;

  const issues: SpriteIssue[] = [];

  // Check 1: Dimensions
  if (width !== sheet.width || height !== sheet.height) {
    issues.push({
      type: 'wrong-dimensions',
      severity: 'error',
      detail: `Expected ${sheet.width}x${sheet.height}, got ${width}x${height}`,
    });
    // Can't do frame analysis if dimensions are wrong
    return { file, width, height, expectedType, issues, pass: false };
  }

  // Get full image pixels for line detection
  const fullPixels = new Uint8Array(
    (await img.clone().raw().toBuffer()).buffer,
  );

  // Check 2: Solid lines
  const solidRows = detectSolidRows(fullPixels, width, height);
  const solidCols = detectSolidCols(fullPixels, width, height);

  // Filter out edge rows/cols (top/bottom/sides are often uniform)
  const interiorSolidRows = solidRows.filter(
    (y) => y > 2 && y < height - 3 && y % sheet.frameH !== 0 && y % sheet.frameH !== sheet.frameH - 1,
  );
  const interiorSolidCols = solidCols.filter(
    (x) => x > 0 && x < width - 1 && x % sheet.frameW !== 0 && x % sheet.frameW !== sheet.frameW - 1,
  );

  if (interiorSolidRows.length >= SOLID_LINE_MIN_COUNT) {
    issues.push({
      type: 'solid-lines',
      severity: 'warning',
      detail: `${interiorSolidRows.length} solid horizontal lines at rows: ${interiorSolidRows.slice(0, 10).join(',')}${interiorSolidRows.length > 10 ? '...' : ''}`,
    });
  }
  if (interiorSolidCols.length >= SOLID_LINE_MIN_COUNT) {
    issues.push({
      type: 'solid-lines',
      severity: 'warning',
      detail: `${interiorSolidCols.length} solid vertical lines at cols: ${interiorSolidCols.slice(0, 10).join(',')}${interiorSolidCols.length > 10 ? '...' : ''}`,
    });
  }

  // Check 3 & 4: Extract individual frames
  const frames: FrameStats[][] = []; // frames[row][col]

  for (let row = 0; row < sheet.rows; row++) {
    const rowFrames: FrameStats[] = [];
    for (let col = 0; col < sheet.cols; col++) {
      const x = col * sheet.frameW;
      const y = row * sheet.frameH;
      const pixels = await extractFrame(img, x, y, sheet.frameW, sheet.frameH);
      const stats = analyzeFrame(pixels);
      rowFrames.push({ row, col, ...stats, pixels });
    }
    frames.push(rowFrames);
  }

  // Check 3: Blank frames
  const blankFrames: string[] = [];
  for (const rowFrames of frames) {
    for (const frame of rowFrames) {
      if (
        frame.avgAlpha < BLANK_FRAME_ALPHA_THRESHOLD ||
        frame.rgbVariance < BLANK_FRAME_VARIANCE_THRESHOLD
      ) {
        blankFrames.push(`(${frame.row},${frame.col})`);
      }
    }
  }
  if (blankFrames.length > 0) {
    issues.push({
      type: 'blank-frames',
      severity: blankFrames.length >= sheet.rows * sheet.cols / 2 ? 'error' : 'warning',
      detail: `${blankFrames.length}/${sheet.rows * sheet.cols} blank/single-color frames: ${blankFrames.join(', ')}`,
    });
  }

  // Check 4: Frame similarity within each direction row
  const identicalRows: string[] = [];
  for (let row = 0; row < sheet.rows; row++) {
    const rowFrames = frames[row];
    // Compare frame 0 vs 1, 0 vs 2
    const sim01 = frameSimilarity(rowFrames[0].pixels, rowFrames[1].pixels);
    const sim02 = frameSimilarity(rowFrames[0].pixels, rowFrames[2].pixels);
    if (sim01 > FRAME_SIMILARITY_THRESHOLD && sim02 > FRAME_SIMILARITY_THRESHOLD) {
      identicalRows.push(`row ${row} (sim: ${(Math.min(sim01, sim02) * 100).toFixed(1)}%)`);
    }
  }
  if (identicalRows.length > 0) {
    issues.push({
      type: 'identical-frames',
      severity: identicalRows.length >= sheet.rows ? 'error' : 'warning',
      detail: `${identicalRows.length}/${sheet.rows} direction rows have near-identical frames: ${identicalRows.join(', ')}`,
    });
  }

  const hasErrors = issues.some((i) => i.severity === 'error');
  return { file, width, height, expectedType, issues, pass: issues.length === 0 || !hasErrors };
}

async function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');
  const doFix = args.includes('--fix');

  if (!existsSync(SPRITES_DIR)) {
    console.error(`Sprites directory not found: ${SPRITES_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(SPRITES_DIR)
    .filter((f) => f.endsWith('.webp') && !f.startsWith('.'))
    .sort();

  if (!jsonOutput) {
    console.log(`\nSpritesheet Quality Verification`);
    console.log(`================================`);
    console.log(`Scanning ${files.length} sprites in ${SPRITES_DIR}\n`);
  }

  const reports: SpriteReport[] = [];
  const flagged: SpriteReport[] = [];

  for (const file of files) {
    const report = await verifySpritesheet(join(SPRITES_DIR, file));
    reports.push(report);

    if (report.issues.length > 0) {
      flagged.push(report);
      if (!jsonOutput) {
        const icon = report.pass ? '⚠' : '✗';
        console.log(`${icon}  ${report.file}`);
        for (const issue of report.issues) {
          const sev = issue.severity === 'error' ? 'ERR' : 'WRN';
          console.log(`   [${sev}] ${issue.type}: ${issue.detail}`);
        }
      }
    }
  }

  const errors = reports.filter((r) => !r.pass);
  const warnings = flagged.filter((r) => r.pass);
  const clean = reports.filter((r) => r.issues.length === 0);

  if (jsonOutput) {
    console.log(JSON.stringify({ total: reports.length, clean: clean.length, warnings: warnings.length, errors: errors.length, reports: flagged }, null, 2));
  } else {
    console.log(`\n--- Summary ---`);
    console.log(`Total:    ${reports.length}`);
    console.log(`Clean:    ${clean.length}`);
    console.log(`Warnings: ${warnings.length}`);
    console.log(`Errors:   ${errors.length}`);

    if (doFix && flagged.length > 0) {
      mkdirSync(QUARANTINE_DIR, { recursive: true });
      for (const report of flagged) {
        const src = join(SPRITES_DIR, report.file);
        const dst = join(QUARANTINE_DIR, report.file);
        renameSync(src, dst);
        console.log(`  Quarantined: ${report.file}`);
      }
      console.log(`\nMoved ${flagged.length} sprites to ${QUARANTINE_DIR}`);
    }
  }

  // Exit with error code if any hard failures
  if (errors.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
