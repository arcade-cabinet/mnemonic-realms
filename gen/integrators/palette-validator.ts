/** Optional palette validation for generated images. */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { GEN_OUTPUT, type IntegrationAsset, MANIFESTS_DIR } from './shared';

function rgbSaturation(r: number, g: number, b: number): number {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  if (max === min) return 0;
  const l = (max + min) / 2,
    d = max - min;
  return (l > 0.5 ? d / (2 - max - min) : d / (max + min)) * 100;
}

const TIERS: Record<string, [number, number, string]> = {
  muted: [0, 40, '< 40%'],
  normal: [30, 70, '30-70%'],
  vivid: [50, 100, '> 50%'],
};
const AMBER_RE = /god|mf-|fragment/i;

/** Categories where alpha transparency is expected (sprites need transparent backgrounds). */
const ALPHA_EXPECTED = new Set(['sprites']);
/** Overlay tilesets need alpha for compositing over base tilesets. */
const OVERLAY_RE = /^overlay_/;

async function check(cat: string, asset: IntegrationAsset): Promise<string[]> {
  const p = resolve(GEN_OUTPUT, cat, asset.filename);
  if (!existsSync(p)) return [];
  const meta = await sharp(p).metadata();
  const warns: string[] = [];

  // Warn if alpha is expected but missing
  const needsAlpha = ALPHA_EXPECTED.has(cat) || OVERLAY_RE.test(asset.filename);
  if (needsAlpha && !meta.hasAlpha) {
    warns.push('missing alpha channel (transparent background expected)');
  }

  const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
  let totalSat = 0,
    amberPx = 0;
  const px = info.width * info.height,
    ch = info.channels;
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    if (ch === 4 && data[i + 3] < 128) continue;
    totalSat += rgbSaturation(r, g, b);
    if (Math.abs(r - 218) < 40 && Math.abs(g - 165) < 40 && b < 80) amberPx++;
  }
  const avg = totalSat / px;
  const t = asset.tier ? TIERS[asset.tier] : undefined;
  if (t && (avg < t[0] || avg > t[1]))
    warns.push(`avg saturation ${Math.round(avg * 10) / 10}% (expected ${t[2]})`);
  if (AMBER_RE.test(asset.id) && amberPx / px < 0.02)
    warns.push('memory-amber (#DAA520) not detected');
  return warns;
}

export async function validatePalette(): Promise<void> {
  let warnings = 0;
  for (const cat of ['tilesets', 'sprites', 'portraits', 'items']) {
    const mp = resolve(MANIFESTS_DIR, `${cat}/manifest.json`);
    if (!existsSync(mp)) continue;
    const gen = JSON.parse(readFileSync(mp, 'utf-8')).assets.filter(
      (a: IntegrationAsset) => a.status === 'generated',
    );
    console.log(`\n  ${cat}: ${gen.length} assets`);
    for (const asset of gen as IntegrationAsset[]) {
      const w = await check(cat, asset);
      for (const msg of w) {
        console.log(`    WARN ${asset.filename}: ${msg}`);
        warnings++;
      }
    }
  }
  console.log(`\n  Palette validation complete. ${warnings} warning(s).`);
}
