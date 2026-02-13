/**
 * Asset processing pipeline for Mnemonic Realms
 *
 * Processes Kenney asset packs into RPG-JS compatible formats:
 * 1. Upscales Tiny Town/Dungeon tilesets 2x → 32x32 tiles
 * 2. Composites roguelike character layers → assembled characters
 * 3. Applies HSV hue rotation for class color variants
 * 4. Creates RPG Maker format spritesheets (96x128, 3×4 grid of 32x32)
 *
 * Usage: pnpm run assets
 */

import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

// ─── Paths ────────────────────────────────────────────────────────────────────

const KENNEY_BASE = '/Volumes/home/assets/Kenney/2D assets';
const PROJECT_ROOT = resolve(import.meta.dirname, '..');
const CHAR_DIR = join(PROJECT_ROOT, 'main/client/characters');
const TMX_DIR = join(PROJECT_ROOT, 'main/server/maps/tmx');

const SOURCES = {
  tinyTown: join(KENNEY_BASE, 'Tiny Town/Tilemap/tilemap_packed.png'),
  tinyDungeon: join(KENNEY_BASE, 'Tiny Dungeon/Tilemap/tilemap_packed.png'),
  rogueChars: join(
    KENNEY_BASE,
    'Roguelike Characters Pack/Spritesheet/roguelikeChar_transparent.png',
  ),
  scribbleChest: join(KENNEY_BASE, 'Scribble Dungeons/PNG/Default (64px)/chest.png'),
};

// ─── Color Variant System ─────────────────────────────────────────────────────

/**
 * HSV hue rotation + value shift config for class variants.
 * Hue is in degrees (0-360). Value shift multiplies brightness.
 * Saturation multiplier adjusts color intensity.
 */
interface ColorVariant {
  name: string;
  hueShift: number; // degrees to rotate hue
  satMul: number; // saturation multiplier (1.0 = no change)
  valMul: number; // value/brightness multiplier
}

const CLASS_VARIANTS: Record<string, ColorVariant[]> = {
  warrior: [
    { name: 'warrior', hueShift: 0, satMul: 1.2, valMul: 1.0 }, // warm red/brown (base)
    { name: 'warrior-dark', hueShift: 0, satMul: 1.0, valMul: 0.65 }, // dark knight
  ],
  mage: [
    { name: 'mage', hueShift: 220, satMul: 1.3, valMul: 1.05 }, // blue/purple
    { name: 'mage-dark', hueShift: 270, satMul: 1.1, valMul: 0.6 }, // dark mage
  ],
  rogue: [
    { name: 'rogue', hueShift: 120, satMul: 1.1, valMul: 0.9 }, // green/forest
    { name: 'rogue-dark', hueShift: 150, satMul: 0.8, valMul: 0.55 }, // shadow
  ],
  cleric: [
    { name: 'cleric', hueShift: 45, satMul: 0.6, valMul: 1.2 }, // gold/white
    { name: 'cleric-dark', hueShift: 280, satMul: 0.9, valMul: 0.7 }, // dark priest
  ],
};

// NPC and enemy color sets
const NPC_VARIANTS: ColorVariant[] = [
  { name: 'npc-villager', hueShift: 30, satMul: 0.7, valMul: 1.1 }, // warm tan
  { name: 'npc-merchant', hueShift: 55, satMul: 1.0, valMul: 1.0 }, // golden
  { name: 'npc-elder', hueShift: 200, satMul: 0.5, valMul: 0.9 }, // muted blue
];

const ENEMY_VARIANTS: ColorVariant[] = [
  { name: 'enemy', hueShift: 340, satMul: 1.4, valMul: 0.8 }, // red tint
  { name: 'enemy-strong', hueShift: 280, satMul: 1.3, valMul: 0.7 }, // purple
  { name: 'boss', hueShift: 310, satMul: 1.5, valMul: 0.5 }, // dark magenta
];

// ─── Character Layer Definitions ──────────────────────────────────────────────

/**
 * Roguelike Characters Pack layout (16x16 tiles, 1px margin):
 * Cols 0-1:   Bodies (front, arms-out)
 * Cols 3-4:   Hair styles
 * Cols 6-9:   Outfit set A (sleeveless, short, full, armored)
 * Cols 10-13: Outfit set B
 * Cols 14-17: Outfit set C
 * Cols 19-22: Headgear set A
 * Cols 23-26: Headgear set B
 * Cols 28-31: Shields
 * Cols 33-36: Weapons set A
 * Cols 37-40: Weapons set B
 * Cols 42-53: Accessories
 *
 * Rows 0-2:   Three skin tones (light, medium, dark)
 * Rows 3+:    Additional variants (animal/monster bodies, etc.)
 */

interface CharacterRecipe {
  bodyCol: number;
  bodyRow: number;
  outfitCol: number;
  hairCol: number;
  hatCol?: number;
  weaponCol?: number;
  shieldCol?: number;
}

const RECIPES: Record<string, CharacterRecipe> = {
  // Hero/player classes
  heroBase: { bodyCol: 0, bodyRow: 0, outfitCol: 9, hairCol: 3 },
  // NPC types
  npcVillager: { bodyCol: 0, bodyRow: 1, outfitCol: 6, hairCol: 3 },
  npcMerchant: { bodyCol: 0, bodyRow: 0, outfitCol: 13, hairCol: 4, hatCol: 20 },
  npcElder: { bodyCol: 0, bodyRow: 0, outfitCol: 14, hairCol: 4 },
  // Enemy types
  enemyBase: { bodyCol: 0, bodyRow: 2, outfitCol: 8, hairCol: 3, weaponCol: 33 },
  bossBase: { bodyCol: 0, bodyRow: 2, outfitCol: 17, hairCol: 3, hatCol: 22, weaponCol: 36, shieldCol: 29 },
};

// ─── Image Processing Utilities ───────────────────────────────────────────────

/** Extract a 16x16 tile from the roguelike spritesheet (1px margin grid) */
async function extractTile(
  sheet: sharp.Sharp,
  sheetWidth: number,
  col: number,
  row: number,
): Promise<Buffer> {
  const x = 1 + col * 17;
  const y = 1 + row * 17;
  return sheet
    .clone()
    .extract({ left: x, top: y, width: 16, height: 16 })
    .png()
    .toBuffer();
}

/** Composite multiple RGBA layers (bottom to top) */
async function compositeLayers(layers: Buffer[]): Promise<Buffer> {
  if (layers.length === 0) throw new Error('No layers');
  if (layers.length === 1) return layers[0];

  let result = sharp(layers[0]).ensureAlpha();
  const overlays = layers.slice(1).map((buf) => ({ input: buf }));
  return result.composite(overlays).png().toBuffer();
}

/** Apply HSV color transformation to an RGBA image buffer */
async function applyColorVariant(buf: Buffer, variant: ColorVariant): Promise<Buffer> {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = new Uint8Array(data);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a === 0) continue; // skip transparent

    // RGB → HSV
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const d = max - min;

    let h = 0;
    if (d > 0) {
      if (max === rn) h = ((gn - bn) / d + 6) % 6;
      else if (max === gn) h = (bn - rn) / d + 2;
      else h = (rn - gn) / d + 4;
      h *= 60;
    }
    let s = max === 0 ? 0 : d / max;
    let v = max;

    // Apply transforms
    h = (h + variant.hueShift) % 360;
    if (h < 0) h += 360;
    s = Math.min(1, Math.max(0, s * variant.satMul));
    v = Math.min(1, Math.max(0, v * variant.valMul));

    // HSV → RGB
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r1: number, g1: number, b1: number;

    if (h < 60) [r1, g1, b1] = [c, x, 0];
    else if (h < 120) [r1, g1, b1] = [x, c, 0];
    else if (h < 180) [r1, g1, b1] = [0, c, x];
    else if (h < 240) [r1, g1, b1] = [0, x, c];
    else if (h < 300) [r1, g1, b1] = [x, 0, c];
    else [r1, g1, b1] = [c, 0, x];

    pixels[i] = Math.round((r1 + m) * 255);
    pixels[i + 1] = Math.round((g1 + m) * 255);
    pixels[i + 2] = Math.round((b1 + m) * 255);
  }

  return sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

/** Upscale an image 2x with nearest-neighbor interpolation */
async function upscale2x(buf: Buffer): Promise<Buffer> {
  const meta = await sharp(buf).metadata();
  return sharp(buf)
    .resize(meta.width! * 2, meta.height! * 2, { kernel: 'nearest' })
    .png()
    .toBuffer();
}

/**
 * Create an RPG Maker format spritesheet (96x128) from a single 16x16 tile.
 * 3 columns (walk-left, stand, walk-right) × 4 rows (down, left, right, up).
 * The 16x16 source is upscaled 2x to 32x32 per cell.
 */
async function createRpgMakerSheet(tile16: Buffer): Promise<Buffer> {
  const upscaled = await upscale2x(tile16);
  const mirrored = await sharp(upscaled).flop().png().toBuffer();
  // Darken slightly for "back" view
  const backView = await applyColorVariant(tile16, {
    name: 'back',
    hueShift: 0,
    satMul: 0.85,
    valMul: 0.8,
  });
  const backUpscaled = await upscale2x(backView);

  // Walk frames: shift 1px
  const shiftRight = await sharp({
    create: { width: 32, height: 32, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: upscaled, left: 1, top: 0 }])
    .png()
    .toBuffer();

  const shiftLeft = await sharp({
    create: { width: 32, height: 32, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: upscaled, left: -1, top: 0 }])
    .png()
    .toBuffer();

  const mirShiftRight = await sharp({
    create: { width: 32, height: 32, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: mirrored, left: 1, top: 0 }])
    .png()
    .toBuffer();

  const mirShiftLeft = await sharp({
    create: { width: 32, height: 32, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: mirrored, left: -1, top: 0 }])
    .png()
    .toBuffer();

  const backShiftR = await sharp({
    create: { width: 32, height: 32, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: backUpscaled, left: 1, top: 0 }])
    .png()
    .toBuffer();

  const backShiftL = await sharp({
    create: { width: 32, height: 32, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: backUpscaled, left: -1, top: 0 }])
    .png()
    .toBuffer();

  // Assemble 96x128 grid:
  // Row 0 (down):  walk-L, stand, walk-R
  // Row 1 (left):  walk-L, stand, walk-R (mirrored)
  // Row 2 (right): walk-L, stand, walk-R (original)
  // Row 3 (up):    walk-L, stand, walk-R (back)
  return sharp({
    create: { width: 96, height: 128, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      // Row 0 — Down
      { input: shiftLeft, left: 0, top: 0 },
      { input: upscaled, left: 32, top: 0 },
      { input: shiftRight, left: 64, top: 0 },
      // Row 1 — Left (mirrored)
      { input: mirShiftLeft, left: 0, top: 32 },
      { input: mirrored, left: 32, top: 32 },
      { input: mirShiftRight, left: 64, top: 32 },
      // Row 2 — Right
      { input: shiftLeft, left: 0, top: 64 },
      { input: upscaled, left: 32, top: 64 },
      { input: shiftRight, left: 64, top: 64 },
      // Row 3 — Up (back)
      { input: backShiftL, left: 0, top: 96 },
      { input: backUpscaled, left: 32, top: 96 },
      { input: backShiftR, left: 64, top: 96 },
    ])
    .png()
    .toBuffer();
}

// ─── Pipeline Steps ───────────────────────────────────────────────────────────

async function processTilesets() {
  console.log('── Tilesets ──────────────────────────────────');

  // Upscale Tiny Town 2x for overworld
  const townBuf = await sharp(SOURCES.tinyTown)
    .ensureAlpha()
    .resize(192 * 2, 176 * 2, { kernel: 'nearest' })
    .png()
    .toFile(join(TMX_DIR, 'overworld-tiles.png'));
  console.log(`  ✓ overworld-tiles.png (384×352, ${townBuf.size} bytes)`);

  // Upscale Tiny Dungeon 2x for dungeon
  const dungBuf = await sharp(SOURCES.tinyDungeon)
    .ensureAlpha()
    .resize(192 * 2, 176 * 2, { kernel: 'nearest' })
    .png()
    .toFile(join(TMX_DIR, 'dungeon-tiles.png'));
  console.log(`  ✓ dungeon-tiles.png (384×352, ${dungBuf.size} bytes)`);
}

async function processCharacters() {
  console.log('\n── Characters ───────────────────────────────');

  const sheetBuf = await sharp(SOURCES.rogueChars).ensureAlpha().png().toBuffer();
  const sheetMeta = await sharp(sheetBuf).metadata();
  const sheet = sharp(sheetBuf);

  async function assembleCharacter(recipe: CharacterRecipe): Promise<Buffer> {
    const layers: Buffer[] = [];

    // Body layer
    layers.push(await extractTile(sheet, sheetMeta.width!, recipe.bodyCol, recipe.bodyRow));
    // Outfit layer
    layers.push(await extractTile(sheet, sheetMeta.width!, recipe.outfitCol, recipe.bodyRow));
    // Hair layer
    layers.push(await extractTile(sheet, sheetMeta.width!, recipe.hairCol, recipe.bodyRow));
    // Optional layers
    if (recipe.hatCol !== undefined) {
      layers.push(await extractTile(sheet, sheetMeta.width!, recipe.hatCol, recipe.bodyRow));
    }
    if (recipe.weaponCol !== undefined) {
      layers.push(await extractTile(sheet, sheetMeta.width!, recipe.weaponCol, recipe.bodyRow));
    }
    if (recipe.shieldCol !== undefined) {
      layers.push(await extractTile(sheet, sheetMeta.width!, recipe.shieldCol, recipe.bodyRow));
    }

    return compositeLayers(layers);
  }

  // ── Hero class variants ──
  const heroTile = await assembleCharacter(RECIPES.heroBase);

  for (const [className, variants] of Object.entries(CLASS_VARIANTS)) {
    for (const variant of variants) {
      const colored = await applyColorVariant(heroTile, variant);
      const rpgSheet = await createRpgMakerSheet(colored);
      await sharp(rpgSheet).toFile(join(CHAR_DIR, `${variant.name}.png`));
      console.log(`  ✓ ${variant.name}.png (hero ${className} variant)`);
    }
  }

  // ── NPC variants ──
  for (const [recipeName, recipe] of Object.entries(RECIPES)) {
    if (!recipeName.startsWith('npc')) continue;
    const baseTile = await assembleCharacter(recipe);
    const matchingVariant = NPC_VARIANTS.find(
      (v) => v.name === recipeName.replace('npc', 'npc-').toLowerCase(),
    );

    if (matchingVariant) {
      const colored = await applyColorVariant(baseTile, matchingVariant);
      const rpgSheet = await createRpgMakerSheet(colored);
      await sharp(rpgSheet).toFile(join(CHAR_DIR, `${matchingVariant.name}.png`));
      console.log(`  ✓ ${matchingVariant.name}.png`);
    } else {
      // Use base colors
      const rpgSheet = await createRpgMakerSheet(baseTile);
      const name = recipeName.replace(/([A-Z])/g, '-$1').toLowerCase();
      await sharp(rpgSheet).toFile(join(CHAR_DIR, `${name}.png`));
      console.log(`  ✓ ${name}.png`);
    }
  }

  // Also generate NPC variants from villager base for variety
  const villagerTile = await assembleCharacter(RECIPES.npcVillager);
  for (const variant of NPC_VARIANTS) {
    const colored = await applyColorVariant(villagerTile, variant);
    const rpgSheet = await createRpgMakerSheet(colored);
    await sharp(rpgSheet).toFile(join(CHAR_DIR, `${variant.name}.png`));
    console.log(`  ✓ ${variant.name}.png`);
  }

  // ── Enemy variants ──
  const enemyTile = await assembleCharacter(RECIPES.enemyBase);
  for (const variant of ENEMY_VARIANTS) {
    if (variant.name === 'boss') continue; // Boss has its own recipe
    const colored = await applyColorVariant(enemyTile, variant);
    const rpgSheet = await createRpgMakerSheet(colored);
    await sharp(rpgSheet).toFile(join(CHAR_DIR, `${variant.name}.png`));
    console.log(`  ✓ ${variant.name}.png`);
  }

  // Boss: fully armored with weapon+shield, dark palette
  const bossTile = await assembleCharacter(RECIPES.bossBase);
  const bossVariant = ENEMY_VARIANTS.find((v) => v.name === 'boss')!;
  const bossColored = await applyColorVariant(bossTile, bossVariant);
  const bossSheet = await createRpgMakerSheet(bossColored);
  await sharp(bossSheet).toFile(join(CHAR_DIR, 'boss.png'));
  console.log('  ✓ boss.png');

  // ── Chest sprite ──
  // Scribble Dungeons chest is 64x64 — downscale to 16x16, then create RPG sheet
  if (existsSync(SOURCES.scribbleChest)) {
    const chestSmall = await sharp(SOURCES.scribbleChest)
      .resize(16, 16, { kernel: 'nearest' })
      .ensureAlpha()
      .png()
      .toBuffer();
    const chestSheet = await createRpgMakerSheet(chestSmall);
    await sharp(chestSheet).toFile(join(CHAR_DIR, 'chest.png'));
    console.log('  ✓ chest.png (from Scribble Dungeons)');
  }

  // ── Default hero (backward-compatible name) ──
  // Use warrior as the default hero.png
  const heroColored = await applyColorVariant(heroTile, CLASS_VARIANTS.warrior[0]);
  const heroSheet = await createRpgMakerSheet(heroColored);
  await sharp(heroSheet).toFile(join(CHAR_DIR, 'hero.png'));
  console.log('  ✓ hero.png (default = warrior)');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Mnemonic Realms — Asset Processing Pipeline\n');

  // Validate sources
  for (const [name, path] of Object.entries(SOURCES)) {
    if (!existsSync(path)) {
      console.error(`✗ Missing source: ${name} at ${path}`);
      console.error('  Make sure /Volumes/home/assets/ is mounted');
      process.exit(1);
    }
  }

  // Ensure output dirs exist
  mkdirSync(CHAR_DIR, { recursive: true });
  mkdirSync(TMX_DIR, { recursive: true });

  await processTilesets();
  await processCharacters();

  console.log('\n── Done! ────────────────────────────────────');
  console.log('Run `pnpm build` to verify assets are bundled correctly.');
}

main().catch((err) => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
