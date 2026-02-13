#!/usr/bin/env npx tsx
/**
 * Manifest Builder
 *
 * Reads the game bible markdown docs and generates manifest JSON files
 * for the GenAI asset pipeline. This script is the bridge between
 * authored content (docs/) and the generation system (gen/manifests/).
 *
 * Usage:
 *   pnpm exec tsx gen/scripts/build-manifests.ts              # Build all manifests
 *   pnpm exec tsx gen/scripts/build-manifests.ts tilesets      # Build tileset manifest only
 *   pnpm exec tsx gen/scripts/build-manifests.ts sprites       # Build sprite manifest only
 *   pnpm exec tsx gen/scripts/build-manifests.ts portraits     # Build portrait manifest only
 *   pnpm exec tsx gen/scripts/build-manifests.ts items         # Build item icon manifest only
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { extractSection } from './markdown-loader';
import {
  MASTER_STYLE_PROMPT,
  MASTER_NEGATIVE_PROMPT,
  TIER_STYLE,
  SPRITE_STYLE,
  PALETTE,
  DIMENSIONS,
  DEFAULT_DOC_REFS,
} from '../style-context';
import type {
  GenerationMetadata,
  TilesetAsset,
  TilesetManifest,
  TileType,
  BiomeType,
  VibrancyTier,
  SpritesheetAsset,
  SpritesheetManifest,
  PortraitAsset,
  PortraitManifest,
  ItemIconAsset,
  ItemIconManifest,
} from '../schemas/index';

const PROJECT_ROOT = resolve(import.meta.dirname ?? process.cwd(), import.meta.dirname ? '../..' : '.');
const MANIFESTS_DIR = resolve(PROJECT_ROOT, 'gen/manifests');

function timestamp(): string {
  return new Date().toISOString();
}

/**
 * Merge new manifest with existing one, preserving generation status/metadata
 * for assets whose IDs haven't changed. This ensures idempotent rebuilds:
 * - New assets get status: 'pending'
 * - Existing assets keep their status/metadata/lastError
 * - Removed assets are dropped
 */
function mergeManifestAssets<T extends { id: string; status: string; metadata?: GenerationMetadata; lastError?: string }>(
  newAssets: T[],
  existingAssets: T[],
): T[] {
  const existingMap = new Map(existingAssets.map((a) => [a.id, a]));
  let preserved = 0;
  let reset = 0;

  const merged = newAssets.map((newAsset) => {
    const existing = existingMap.get(newAsset.id);
    if (existing?.metadata) {
      // Preserve generation state from previous run
      preserved++;
      return {
        ...newAsset,
        status: existing.status,
        metadata: existing.metadata,
        ...(existing.lastError ? { lastError: existing.lastError } : {}),
      };
    }
    reset++;
    return newAsset;
  });

  const removed = existingAssets.filter((a) => !newAssets.some((n) => n.id === a.id));
  if (removed.length > 0) {
    console.log(`    Removed ${removed.length} stale assets: ${removed.map((a) => a.id).join(', ')}`);
  }
  console.log(`    Merged: ${preserved} preserved, ${reset} new/reset`);

  return merged;
}

function writeManifest(subdir: string, manifest: { assets: { id: string; status: string; metadata?: GenerationMetadata }[] } & Record<string, unknown>): void {
  const dir = resolve(MANIFESTS_DIR, subdir);
  mkdirSync(dir, { recursive: true });
  const path = resolve(dir, 'manifest.json');

  // Load existing manifest for merge if it exists
  if (existsSync(path)) {
    try {
      const existing = JSON.parse(readFileSync(path, 'utf-8'));
      if (existing.assets?.length) {
        manifest.assets = mergeManifestAssets(manifest.assets as any[], existing.assets);
      }
    } catch {
      console.log(`    Warning: could not parse existing ${path}, overwriting`);
    }
  }

  writeFileSync(path, JSON.stringify(manifest, null, 2));
  console.log(`  Wrote ${path}`);
}

// ============================================================================
// TILESET MANIFEST BUILDER
// ============================================================================

interface BiomeConfig {
  biome: BiomeType;
  heading: string;
  zones: string[];
  gridCols: number;
  gridRows: number;
}

/**
 * Biome configurations sourced from docs/design/tileset-spec.md.
 * Sheet dimensions: 16 columns (512px) with variable row heights per biome.
 */
const BIOME_CONFIGS: BiomeConfig[] = [
  { biome: 'village', heading: 'Biome 1: Village', zones: ['Village Hub'], gridCols: 16, gridRows: 14 },
  { biome: 'grassland', heading: 'Biome 2: Grassland/Farmland', zones: ['Heartfield', 'Sunridge'], gridCols: 16, gridRows: 16 },
  { biome: 'forest', heading: 'Biome 3: Forest', zones: ['Ambergrove', 'Flickerveil', 'Half-Drawn Forest'], gridCols: 16, gridRows: 18 },
  { biome: 'mountain', heading: 'Biome 4: Mountain/Highland', zones: ['Hollow Ridge', 'Undrawn Peaks'], gridCols: 16, gridRows: 16 },
  { biome: 'riverside', heading: 'Biome 5: Riverside/Water', zones: ['Millbrook'], gridCols: 16, gridRows: 16 },
  { biome: 'wetland', heading: 'Biome 6: Wetland/Marsh', zones: ['Shimmer Marsh'], gridCols: 16, gridRows: 16 },
  { biome: 'plains', heading: 'Biome 7: Plains', zones: ['Resonance Fields'], gridCols: 16, gridRows: 14 },
  { biome: 'dungeon', heading: 'Biome 8: Dungeon/Underground', zones: ['Depths Level 1', 'Depths Level 2', 'Depths Level 3', 'Depths Level 4', 'Depths Level 5'], gridCols: 16, gridRows: 16 },
  { biome: 'sketch', heading: 'Biome 9: Sketch', zones: ['Luminous Wastes', 'Undrawn Peaks', 'Half-Drawn Forest'], gridCols: 16, gridRows: 16 },
];

/**
 * Tier column headers used in the v2 tileset-spec.md tables.
 * These match the table columns in each biome's per-tile tables.
 */
const TIER_COLUMN_MAP: Record<VibrancyTier, string> = {
  muted: 'Muted',
  normal: 'Normal',
  vivid: 'Vivid',
};

/**
 * Sketch biome uses different column names for the three tiers.
 */
const SKETCH_TIER_COLUMN_MAP: Record<VibrancyTier, string> = {
  muted: 'Muted (Outline)',
  normal: 'Normal (Partial Fill)',
  vivid: 'Vivid (Nearly Complete)',
};

/**
 * Transition tileset definitions from tileset-spec.md.
 * Each transition uses 16x6 tiles (512x192 per tier).
 */
const TRANSITION_CONFIGS: { from: string; to: string; usedAt: string }[] = [
  { from: 'village', to: 'grassland', usedAt: 'Village Hub -> Heartfield' },
  { from: 'village', to: 'forest', usedAt: 'Village Hub -> Ambergrove' },
  { from: 'village', to: 'riverside', usedAt: 'Village Hub -> Millbrook' },
  { from: 'grassland', to: 'forest', usedAt: 'Heartfield -> Ambergrove' },
  { from: 'grassland', to: 'mountain', usedAt: 'Sunridge -> Hollow Ridge' },
  { from: 'grassland', to: 'marsh', usedAt: 'Heartfield -> Shimmer Marsh' },
  { from: 'forest', to: 'marsh', usedAt: 'Flickerveil -> Shimmer Marsh' },
  { from: 'forest', to: 'mountain', usedAt: 'Flickerveil -> Hollow Ridge' },
  { from: 'forest', to: 'sketch', usedAt: 'Flickerveil -> Half-Drawn Forest' },
  { from: 'mountain', to: 'sketch', usedAt: 'Hollow Ridge -> Undrawn Peaks' },
  { from: 'marsh', to: 'sketch', usedAt: 'Shimmer Marsh -> Luminous Wastes' },
  { from: 'grassland', to: 'plains', usedAt: 'Sunridge -> Resonance Fields' },
  { from: 'plains', to: 'marsh', usedAt: 'Resonance Fields -> Shimmer Marsh' },
  { from: 'surface', to: 'dungeon', usedAt: 'All Depths entrances' },
  { from: 'sketch', to: 'dungeon', usedAt: 'Sketch Passage -> Depths L5' },
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Compute generation dimensions at 4x target, capped at 2048 per dimension.
 */
function genDims(width: number, height: number): { width: number; height: number; genWidth: number; genHeight: number } {
  return {
    width,
    height,
    genWidth: Math.min(width * 4, 2048),
    genHeight: Math.min(height * 4, 2048),
  };
}

/**
 * Collect all tile rows from all sub-tables within a biome section.
 * The v2 tileset-spec.md has multiple sub-sections (Ground, Path, Decoration, etc.)
 * each with their own table. We read the entire biome section and extract all tables.
 */
function collectBiomeTileRows(biomeSection: string): Record<string, string>[] {
  // Split into lines, find all table regions, parse each
  const lines = biomeSection.split('\n');
  const allRows: Record<string, string>[] = [];
  let tableLines: string[] = [];
  let inTable = false;

  for (const line of lines) {
    const isTableLine = line.trim().startsWith('|');
    if (isTableLine) {
      tableLines.push(line);
      inTable = true;
    } else if (inTable) {
      // End of a table block — parse it
      if (tableLines.length >= 3) {
        const parseRow = (l: string): string[] =>
          l.split('|').slice(1, -1).map((cell) => cell.trim());
        const headers = parseRow(tableLines[0]);
        // Skip separator line (tableLines[1])
        for (let r = 2; r < tableLines.length; r++) {
          const cells = parseRow(tableLines[r]);
          const obj: Record<string, string> = {};
          headers.forEach((header, i) => {
            obj[header] = cells[i] || '';
          });
          // Only include rows that have an ID column (skip non-tile tables like color palettes)
          if (obj['ID']) {
            allRows.push(obj);
          }
        }
      }
      tableLines = [];
      inTable = false;
    }
  }
  // Handle table at end of section
  if (inTable && tableLines.length >= 3) {
    const parseRow = (l: string): string[] =>
      l.split('|').slice(1, -1).map((cell) => cell.trim());
    const headers = parseRow(tableLines[0]);
    for (let r = 2; r < tableLines.length; r++) {
      const cells = parseRow(tableLines[r]);
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header] = cells[i] || '';
      });
      if (obj['ID']) {
        allRows.push(obj);
      }
    }
  }

  return allRows;
}

function buildTilesetAsset(config: BiomeConfig, tier: VibrancyTier, tileRows: Record<string, string>[]): TilesetAsset {
  const columnMap = config.biome === 'sketch' ? SKETCH_TIER_COLUMN_MAP : TIER_COLUMN_MAP;
  const tierColumn = columnMap[tier];

  const tiles: TileType[] = tileRows.map((row, i) => {
    const tileId = row['ID'] || `tile-${i}`;
    const tileName = row['Name'] || row['Description'] || `tile-${i}`;
    // For standard biomes, use the tier column; for animated-only tables use Description
    const description = row[tierColumn] || row['Description'] || '';
    const isAnimated = !!row['Frames'] || tileName.toLowerCase().includes('water') || tileName.toLowerCase().includes('torch');
    const frameCount = row['Frames'] ? parseInt(row['Frames'], 10) : (isAnimated ? 3 : 1);

    return {
      id: slugify(tileId),
      name: tileName,
      description,
      gridPosition: {
        col: i % config.gridCols,
        row: Math.floor(i / config.gridCols),
        spanCols: 1,
        spanRows: 1,
      },
      variants: 1,
      animated: isAnimated,
      animFrames: isAnimated ? frameCount : 1,
    };
  });

  const tileDescriptions = tiles.map((t) => `- ${t.name}: ${t.description}`).join('\n');

  const sheetWidth = config.gridCols * 32;
  const sheetHeight = config.gridRows * 32;

  const prompt = `${MASTER_STYLE_PROMPT}\n\n${TIER_STYLE[tier]}\n\n` +
    `Generate a pixel art tileset sheet for the "${config.biome}" biome at ${tier} vibrancy. ` +
    `The image should be a grid of distinct 16-bit RPG tiles, ${config.gridCols} columns × ${config.gridRows} rows. ` +
    `Each tile is a separate game element, clearly separated with consistent 32×32 size. ` +
    `Row order: Ground → Path → Autotile → Decoration → Obstacle → Animated → Special. ` +
    `Include multiple variants of common tiles (ground, paths) to avoid repetition in-game:\n${tileDescriptions}\n\n` +
    `Zones using this tileset: ${config.zones.join(', ')}. ` +
    `All ground/path tiles must be seamlessly tileable. ` +
    `Maintain consistent lighting direction (top-left) and consistent color palette across all tiles.`;

  return {
    id: `tileset-${config.biome}-${tier}`,
    biome: config.biome,
    tier,
    zones: config.zones,
    tiles,
    gridCols: config.gridCols,
    gridRows: config.gridRows,
    tileSize: 32,
    dimensions: genDims(sheetWidth, sheetHeight),
    prompt,
    negativePrompt: MASTER_NEGATIVE_PROMPT,
    docRefs: [
      { path: 'docs/design/tileset-spec.md', heading: config.heading, purpose: 'content' as const },
      { path: 'docs/design/visual-direction.md', heading: 'Environment Tiles', purpose: 'style' as const },
      ...DEFAULT_DOC_REFS.tileRules,
    ],
    filename: `tiles_${config.biome}_${tier}.png`,
    format: 'png',
    status: 'pending',
  };
}

function buildTilesetManifest(): TilesetManifest {
  console.log('Building tileset manifest...');
  const assets: TilesetAsset[] = [];
  const tilesetSpecPath = 'docs/design/tileset-spec.md';

  // Read the full tileset spec once
  const tilesetSpecContent = (() => {
    try { return readFileSync(resolve(PROJECT_ROOT, tilesetSpecPath), 'utf-8'); }
    catch { return null; }
  })();

  if (!tilesetSpecContent) {
    console.error('  ERROR: Could not read docs/design/tileset-spec.md');
    return { schemaVersion: '1.0.0', description: '', updatedAt: timestamp(), styleGuide: MASTER_STYLE_PROMPT, styleDocRefs: DEFAULT_DOC_REFS.globalStyle, assets: [] };
  }

  // Build standard biome tilesets (9 biomes × 3 tiers)
  for (const config of BIOME_CONFIGS) {
    const section = extractSection(tilesetSpecContent, config.heading);
    if (!section) {
      console.warn(`  Warning: heading "${config.heading}" not found in tileset-spec.md`);
      continue;
    }

    const tileRows = collectBiomeTileRows(section);
    if (tileRows.length === 0) {
      console.warn(`  Warning: no tile rows found for ${config.heading}`);
      continue;
    }

    console.log(`  ${config.biome}: ${tileRows.length} tile types`);

    for (const tier of ['muted', 'normal', 'vivid'] as VibrancyTier[]) {
      assets.push(buildTilesetAsset(config, tier, tileRows));
    }
  }

  // Stagnation overlay — single variant (16×10 tiles = 512×320)
  const stagnationSection = extractSection(tilesetSpecContent, 'Overlay: Stagnation/Crystal');
  if (stagnationSection) {
    const stagnationRows = collectBiomeTileRows(stagnationSection);
    const stgGridCols = 16;
    const stgGridRows = 10;

    const tiles: TileType[] = stagnationRows.map((row, i) => ({
      id: slugify(row['ID'] || `stagnation-${i}`),
      name: row['Name'] || `Stagnation tile ${i}`,
      description: row['Description'] || '',
      gridPosition: { col: i % stgGridCols, row: Math.floor(i / stgGridCols), spanCols: 1, spanRows: 1 },
      variants: 1,
      animated: !!row['Frames'],
      animFrames: row['Frames'] ? parseInt(row['Frames'], 10) : 1,
    }));

    const tileDescriptions = tiles.map((t) => `- ${t.name}: ${t.description}`).join('\n');
    const sheetWidth = stgGridCols * 32;
    const sheetHeight = stgGridRows * 32;

    assets.push({
      id: 'tileset-stagnation-overlay',
      biome: 'stagnation',
      tier: 'normal',
      zones: ['Preserver Fortress', 'Stagnation Zones'],
      tiles,
      gridCols: stgGridCols,
      gridRows: stgGridRows,
      tileSize: 32,
      dimensions: genDims(sheetWidth, sheetHeight),
      prompt: `${MASTER_STYLE_PROMPT}\n\nGenerate a stagnation/crystal overlay tileset for a 16-bit RPG. ` +
        `These are semi-transparent overlay tiles applied on top of other biomes to show crystallization/freezing. ` +
        `${stgGridCols} columns × ${stgGridRows} rows of 32x32 pixel tiles, blue-white crystalline aesthetic. ` +
        `Used for Preserver zones where everything is frozen in crystal:\n${tileDescriptions}\n\n` +
        `Color palette: crystal blue-white (${PALETTE.stagnation}), fading to (${PALETTE.stagnationFade}). ` +
        `Single variant — stagnation appearance does not change with vibrancy tier.`,
      negativePrompt: MASTER_NEGATIVE_PROMPT,
      docRefs: [
        { path: 'docs/design/tileset-spec.md', heading: 'Overlay: Stagnation/Crystal', purpose: 'content' },
        ...DEFAULT_DOC_REFS.stagnation,
      ],
      filename: 'overlay_stagnation_crystal.png',
      format: 'png',
      status: 'pending',
    });

    console.log(`  stagnation: ${tiles.length} overlay tile types`);
  }

  // Transition tilesets — 15 transitions × 3 tiers (16×6 tiles = 512×192 each)
  const transGridCols = 16;
  const transGridRows = 6;
  const transWidth = transGridCols * 32;
  const transHeight = transGridRows * 32;

  for (const trans of TRANSITION_CONFIGS) {
    for (const tier of ['muted', 'normal', 'vivid'] as VibrancyTier[]) {
      const transId = `tileset-transition-${trans.from}-${trans.to}-${tier}`;

      assets.push({
        id: transId,
        biome: 'village', // Transitions span biomes; use first biome as category
        tier,
        zones: [trans.usedAt],
        tiles: [{
          id: `transition-${trans.from}-${trans.to}`,
          name: `${trans.from} to ${trans.to} transition`,
          description: `47-tile autotile blob set for smooth blending between ${trans.from} and ${trans.to} biomes at ${tier} vibrancy. 4-pixel gradient blend at edges.`,
          gridPosition: { col: 0, row: 0, spanCols: transGridCols, spanRows: transGridRows },
          variants: 1,
          animated: false,
          animFrames: 1,
        }],
        gridCols: transGridCols,
        gridRows: transGridRows,
        tileSize: 32,
        dimensions: genDims(transWidth, transHeight),
        prompt: `${MASTER_STYLE_PROMPT}\n\n${TIER_STYLE[tier]}\n\n` +
          `Generate a biome transition autotile set for a 16-bit RPG. ` +
          `This tileset blends the "${trans.from}" biome into the "${trans.to}" biome at ${tier} vibrancy. ` +
          `${transGridCols} columns × ${transGridRows} rows of 32x32 tiles. ` +
          `Contains a 47-tile blob autotile set for smooth edge transitions. ` +
          `Inner tiles: ${trans.to} biome ground tile. Outer tiles: ${trans.from} biome ground tile. ` +
          `Edge pixels: 4-pixel gradient blend between biome palettes. ` +
          `No hard lines — every transition must be visually smooth at the tile boundary. ` +
          `Used at: ${trans.usedAt}.`,
        negativePrompt: MASTER_NEGATIVE_PROMPT,
        docRefs: [
          { path: 'docs/design/tileset-spec.md', heading: 'Transition Tiles Between Biomes', purpose: 'content' },
          { path: 'docs/design/visual-direction.md', heading: 'Environment Tiles', purpose: 'style' },
        ],
        filename: `overlay_transition_${trans.from}_${trans.to}.png`,
        format: 'png',
        status: 'pending',
      });
    }
  }

  console.log(`  transitions: ${TRANSITION_CONFIGS.length} transition sets × 3 tiers = ${TRANSITION_CONFIGS.length * 3} assets`);

  const manifest: TilesetManifest = {
    schemaVersion: '1.0.0',
    description: 'Tileset generation manifest — 9 biomes × 3 tiers + stagnation overlay + 15 transition sets × 3 tiers',
    updatedAt: timestamp(),
    styleGuide: MASTER_STYLE_PROMPT,
    styleDocRefs: DEFAULT_DOC_REFS.globalStyle,
    assets,
  };

  console.log(`  Total tileset assets: ${assets.length}`);
  return manifest;
}

// ============================================================================
// SPRITESHEET MANIFEST BUILDER
// ============================================================================

function buildSpritesheetManifest(): SpritesheetManifest {
  console.log('Building spritesheet manifest...');

  const assets: SpritesheetAsset[] = [];

  // Player classes — from spritesheet-spec.md Player Character Sprites section
  const classes = [
    { id: 'knight', name: 'Knight', heading: 'PC-KNIGHT: Knight Oathweave', color: 'Steel blue-gray (#6B7B8B) and warm brown (#8B4513)', accent: 'Broad shoulders, heavy armor, cape, sword at side' },
    { id: 'mage', name: 'Mage', heading: 'PC-MAGE: Mage Inspired Casting', color: 'Dark slate teal (#2F4F4F) and river blue (#4A8CB8)', accent: 'Slim, angular, wide-brimmed hat, no staff — hands glow with elemental energy' },
    { id: 'rogue', name: 'Rogue', heading: 'PC-ROGUE: Rogue Foreshadow Strike', color: 'Dark charcoal (#3C3C3C) and deep forest green (#2E5C4C)', accent: 'Lean, agile, scarf, dual daggers, slightly crouched stance' },
    { id: 'cleric', name: 'Cleric', heading: 'PC-CLERIC: Cleric Euphoric Recall', color: 'Warm cream/ivory (#F5F0E6) and twilight purple (#7B68EE)', accent: 'Medium build, flowing robes, hood or circlet, staff in one hand' },
  ];

  for (const cls of classes) {
    assets.push({
      id: `sprite-player-${cls.id}`,
      name: cls.name,
      category: 'player',
      appearance: `${cls.name} class hero. ${cls.accent}. Color accent: ${cls.color}.`,
      colorAccent: cls.color,
      silhouetteNote: cls.accent,
      spriteSize: '32x32',
      animations: { walk: true, idle: true, attack: true, cast: true, hit: true, death: true },
      dimensions: DIMENSIONS.spriteWalk,
      prompt: `${SPRITE_STYLE.player}\n\nGenerate a 16-bit RPG ${cls.name} character spritesheet. ` +
        `Sheet size: 96×256 pixels (3 columns × 8 rows of 32×32 frames). ` +
        `Rows 1-4: walk cycle (down, left, right, up), 3 frames each (left step, standing, right step). ` +
        `Row 5: idle (2 frames). Row 6: attack (4 frames). Row 7: cast (4 frames). Row 8: hit/death combined. ` +
        `${cls.accent}. Color palette: ${cls.color}. Chibi proportions (2.5 heads tall). ` +
        `1-pixel dark outline (warm shadow, not black). Elliptical shadow at feet.`,
      negativePrompt: MASTER_NEGATIVE_PROMPT,
      docRefs: [
        { path: 'docs/design/spritesheet-spec.md', heading: cls.heading, purpose: 'content' },
        { path: 'docs/design/spritesheet-spec.md', heading: 'Player Character Sprites (4 Classes)', purpose: 'style' },
        { path: 'docs/design/visual-direction.md', heading: 'Player Characters', purpose: 'style' },
      ],
      filename: `sprite_player_${cls.id}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  // Named NPC sprites — from spritesheet-spec.md Named NPC Sprites section
  const namedNpcs = [
    { id: 'lira', name: 'Lira', heading: 'NPC-LIRA: Lira (Mentor)', desc: 'Mid-30s woman, practical sage green traveler\'s clothes, satchel, hair tied back. Walks with purpose.' },
    { id: 'callum', name: 'Callum', heading: 'NPC-CALLUM: Callum (Village Elder)', desc: 'Elderly man, tall and thin. Long dark warm brown coat, walking stick, white hair, spectacles.' },
    { id: 'curator', name: 'The Curator', heading: 'NPC-CURATOR: The Curator (Antagonist)', desc: 'Tall, elegant. Flowing crystalline near-white robes, high collar, hands clasped. Too perfect, slightly uncanny.' },
    { id: 'maren', name: 'Maren', heading: 'NPC-MAREN: Maren (Shopkeeper)', desc: 'Round, cheerful. Warm rust red apron, short curly chestnut hair. Animated walk with slight bounce.' },
    { id: 'torvan', name: 'Torvan', heading: 'NPC-TORVAN: Torvan (Blacksmith)', desc: 'Broad, muscular. Dark leather apron, thick arms, close-cropped dark hair, hammer at belt.' },
  ];

  for (const npc of namedNpcs) {
    assets.push({
      id: `sprite-npc-${npc.id}`,
      name: npc.name,
      category: 'npc',
      appearance: npc.desc,
      spriteSize: '32x32',
      animations: { walk: true, idle: true, attack: false, cast: false, hit: false, death: false },
      dimensions: DIMENSIONS.spriteWalk,
      prompt: `${SPRITE_STYLE.npc}\n\nGenerate a 16-bit RPG named NPC spritesheet. ` +
        `Sheet size: 96×160 pixels (3 columns × 5 rows of 32×32 frames). ` +
        `Rows 1-4: walk cycle (down, left, right, up), 3 frames each. ` +
        `Row 5: idle (2 frames). ` +
        `${npc.desc} Chibi proportions (2.5 heads tall).`,
      negativePrompt: MASTER_NEGATIVE_PROMPT,
      docRefs: [
        { path: 'docs/design/spritesheet-spec.md', heading: npc.heading, purpose: 'content' },
        { path: 'docs/design/spritesheet-spec.md', heading: 'Named NPC Sprites (5 Characters)', purpose: 'style' },
      ],
      filename: `sprite_npc_${npc.id}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  // NPC template sprites — from spritesheet-spec.md NPC Template Sprites section
  const npcTemplates = [
    { id: 'villager', name: 'Villager', heading: 'NPT-01: Villager (Generic)', desc: 'Average build, simple tunic and trousers. Earth tones.' },
    { id: 'merchant', name: 'Merchant', heading: 'NPT-02: Merchant', desc: 'Round body, large hat, traveling pack. Rich brown coat, gold trim. Bustling walk.' },
    { id: 'farmer', name: 'Farmer', heading: 'NPT-03: Farmer', desc: 'Sturdy build, straw hat, tool over shoulder. Tan overalls, green shirt. Slower walk.' },
    { id: 'scholar', name: 'Scholar', heading: 'NPT-04: Scholar', desc: 'Thin, hunched over book. Glasses. Dark blue robe. Quick, distracted walk.' },
    { id: 'guard', name: 'Guard', heading: 'NPT-05: Guard/Warrior', desc: 'Broad shoulders, simple armor, spear or sword. Chain mail gray, leather brown. Measured walk.' },
    { id: 'child', name: 'Child', heading: 'NPT-06: Child', desc: 'Small (1.5 heads tall). Quick, bouncy walk. Bright tunic, short pants.' },
  ];

  for (const npt of npcTemplates) {
    assets.push({
      id: `sprite-npt-${npt.id}`,
      name: npt.name,
      category: 'npc',
      appearance: npt.desc,
      spriteSize: '32x32',
      animations: { walk: true, idle: true, attack: false, cast: false, hit: false, death: false },
      dimensions: DIMENSIONS.spriteWalk,
      prompt: `${SPRITE_STYLE.npc}\n\nGenerate a 16-bit RPG NPC template spritesheet. ` +
        `Sheet size: 96×160 pixels (3 columns × 5 rows of 32×32 frames). ` +
        `Rows 1-4: walk cycle (down, left, right, up), 3 frames each. ` +
        `Row 5: idle (2 frames). ` +
        `${npt.desc} Base palette for palette-swap variants. Chibi proportions.`,
      negativePrompt: MASTER_NEGATIVE_PROMPT,
      docRefs: [
        { path: 'docs/design/spritesheet-spec.md', heading: npt.heading, purpose: 'content' },
        { path: 'docs/design/spritesheet-spec.md', heading: 'NPC Template Sprites (6 Types)', purpose: 'style' },
      ],
      filename: `sprite_npc_${npt.id}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  // Auto-extract enemies from enemies-catalog.md if it exists
  const enemiesCatalogPath = 'docs/design/enemies-catalog.md';
  const enemiesCatalog = (() => {
    try { return readFileSync(resolve(PROJECT_ROOT, enemiesCatalogPath), 'utf-8'); }
    catch { return null; }
  })();

  const playerNpcCount = assets.length;

  if (enemiesCatalog) {
    const enemyPattern = /^### (E-\w+-\d+): (.+)$/gm;
    const flavorPattern = /\*\*Flavor\*\*: (.+)/;
    const spawnPattern = /\*\*Spawn zone\*\*: (.+)/;

    let match: RegExpExecArray | null;
    while ((match = enemyPattern.exec(enemiesCatalog)) !== null) {
      const enemyId = match[1];
      const enemyName = match[2];
      const sectionStart = match.index;
      const nextSection = enemiesCatalog.indexOf('\n### ', sectionStart + 1);
      const section = nextSection === -1
        ? enemiesCatalog.slice(sectionStart)
        : enemiesCatalog.slice(sectionStart, nextSection);

      const flavor = section.match(flavorPattern)?.[1] || '';
      const spawnZone = section.match(spawnPattern)?.[1] || '';
      const isPreserver = enemyId.startsWith('E-PR') || enemyId.startsWith('E-PA') || enemyId.startsWith('E-PV');

      assets.push({
        id: `sprite-enemy-${slugify(enemyId)}`,
        name: enemyName,
        category: isPreserver ? 'preserver' : 'enemy',
        appearance: flavor,
        spriteSize: '32x32',
        animations: { walk: false, idle: true, attack: true, cast: false, hit: true, death: true },
        dimensions: DIMENSIONS.spriteWalk,
        prompt: `${SPRITE_STYLE.enemy}\n\nGenerate a 16-bit RPG enemy combat spritesheet. ` +
          `Sheet size: 96×128 pixels (3 columns × 4 rows of 32×32 frames). ` +
          `Row 1: idle (2 frames). Row 2: attack (3 frames). Row 3: hit (2 frames). Row 4: death (3 frames). ` +
          `Single facing direction (toward camera). ` +
          `Enemy: "${enemyName}". ${flavor} ` +
          `Spawn zone: ${spawnZone}. ` +
          `1-pixel outline using warm shadow tones (not black).`,
        negativePrompt: MASTER_NEGATIVE_PROMPT,
        docRefs: [
          { path: enemiesCatalogPath, heading: `${enemyId}: ${enemyName}`, purpose: 'content' },
          { path: 'docs/design/spritesheet-spec.md', heading: 'Enemy Sprites (34 Types)', purpose: 'style' },
          { path: 'docs/design/visual-direction.md', heading: 'Enemies', purpose: 'style' },
        ],
        filename: `sprite_enemy_${slugify(enemyId)}.png`,
        format: 'png',
        status: 'pending',
      });
    }

    const bossPattern = /^### (B-\d+): (.+)$/gm;
    while ((match = bossPattern.exec(enemiesCatalog)) !== null) {
      const bossId = match[1];
      const bossName = match[2];
      const sectionStart = match.index;
      const nextSection = enemiesCatalog.indexOf('\n### ', sectionStart + 1);
      const section = nextSection === -1
        ? enemiesCatalog.slice(sectionStart)
        : enemiesCatalog.slice(sectionStart, nextSection);

      const flavor = section.match(flavorPattern)?.[1] || '';

      assets.push({
        id: `sprite-boss-${slugify(bossId)}`,
        name: bossName,
        category: 'boss',
        appearance: flavor,
        spriteSize: '64x64',
        animations: { walk: false, idle: true, attack: true, cast: false, hit: true, death: true },
        dimensions: DIMENSIONS.spriteBoss,
        prompt: `${SPRITE_STYLE.boss}\n\nGenerate a 16-bit RPG boss sprite sheet. ` +
          `Sheet size: 192×448 pixels (3 columns × 7 rows of 64×64 frames). ` +
          `Row 1: idle (3 frames). Rows 2-3: attack 1 & 2 (4 frames each). ` +
          `Row 4: special (4 frames). Row 5: hit (2 frames). ` +
          `Row 6: phase transition (4 frames). Row 7: death (4 frames). ` +
          `Boss: "${bossName}". ${flavor} ` +
          `Large, imposing, dramatic silhouette. Single facing direction.`,
        negativePrompt: MASTER_NEGATIVE_PROMPT,
        docRefs: [
          { path: enemiesCatalogPath, heading: `${bossId}: ${bossName}`, purpose: 'content' },
          { path: 'docs/design/spritesheet-spec.md', heading: 'Boss Sprites (10 Encounters)', purpose: 'style' },
          { path: 'docs/design/visual-direction.md', heading: 'Enemies', purpose: 'style' },
        ],
        filename: `sprite_boss_${slugify(bossId)}.png`,
        format: 'png',
        status: 'pending',
      });
    }

    console.log(`  Auto-extracted ${assets.length - playerNpcCount} enemies/bosses from enemies-catalog.md`);
  }

  const manifest: SpritesheetManifest = {
    schemaVersion: '1.0.0',
    description: 'Character and enemy spritesheet generation manifest — v2 spritesheet-spec.md',
    updatedAt: timestamp(),
    styleGuide: SPRITE_STYLE.player,
    styleDocRefs: [
      ...DEFAULT_DOC_REFS.globalStyle,
      { path: 'docs/design/spritesheet-spec.md', heading: 'Overview', purpose: 'style' },
    ],
    assets,
  };

  console.log(`  Total sprite assets: ${assets.length}`);
  return manifest;
}

// ============================================================================
// PORTRAIT MANIFEST BUILDER
// ============================================================================

function buildPortraitManifest(): PortraitManifest {
  console.log('Building portrait manifest...');

  const assets: PortraitAsset[] = [];

  // Named characters from characters.md and act1-script.md
  const characters = [
    {
      id: 'protagonist', name: 'Protagonist', heading: 'Player Character',
      appearance: 'Young adventurer, determined expression. Customizable by class but default has warm brown hair, bright eyes full of wonder.',
      type: 'named' as const,
    },
    {
      id: 'lira', name: 'Lira', heading: 'Lira (Mentor Figure)',
      appearance: 'Young woman, early 20s. Warm smile, auburn hair in a loose braid, freckles. Amber-accented Cleric vestments. Gentle but resolute eyes.',
      type: 'named' as const,
    },
    {
      id: 'callum', name: 'Callum', heading: 'Callum (Village Elder)',
      appearance: 'Young man, mid 20s. Messy dark hair, round wire spectacles, ink-stained fingers. Deep blue Mage robes. Curious, slightly anxious expression.',
      type: 'named' as const,
    },
    {
      id: 'petra', name: 'Petra', heading: 'Petra',
      appearance: 'Woman, late 20s. Short-cropped silver hair, strong jaw, weathered armor with dents. Stoic expression with kind eyes. Broad shoulders.',
      type: 'named' as const,
    },
    {
      id: 'elder-torin', name: 'Elder Torin', heading: 'Elder Torin',
      appearance: 'Elderly man, tall and thin. Long white beard, warm brown robes, wooden walking stick. Deep-set wise eyes, gentle wrinkles.',
      type: 'named' as const,
    },
  ];

  const expressions = ['neutral', 'happy', 'sad', 'determined'] as const;

  for (const char of characters) {
    for (const expr of expressions) {
      assets.push({
        id: `portrait-${char.id}-${expr}`,
        characterId: char.id,
        name: char.name,
        type: char.type,
        expression: expr,
        appearance: char.appearance,
        dimensions: DIMENSIONS.portrait,
        prompt: `${MASTER_STYLE_PROMPT}\n\n16-bit JRPG character portrait for a dialogue box. ` +
          `Head and shoulders view, ${expr} expression. ` +
          `${char.appearance} ` +
          `Style: SNES-era RPG portrait (like Chrono Trigger dialogue portraits). ` +
          `128×128 pixels, clean pixel art, limited color palette.`,
        negativePrompt: `${MASTER_NEGATIVE_PROMPT}, full body, action pose`,
        docRefs: [
          { path: 'docs/story/characters.md', heading: char.heading, purpose: 'content' },
          { path: 'docs/design/visual-direction.md', heading: 'Sprite Style', purpose: 'style' },
        ],
        filename: `${char.id}-${expr}.png`,
        format: 'png',
        status: 'pending',
      });
    }
  }

  // God portraits (one per god form — these can expand when dormant-gods.md has visual specs)
  const gods = [
    { id: 'resonance', name: 'Resonance', appearance: 'Ancient being of sound and vibration. Ethereal form of shimmering sound waves, no fixed shape.' },
    { id: 'verdance', name: 'Verdance', appearance: 'Ancient being of growth. Living plant matter forming a humanoid shape, flowers and vines.' },
    { id: 'luminos', name: 'Luminos', appearance: 'Ancient being of light. Radiant crystalline form, faceted like a prism, warm golden glow.' },
    { id: 'kinesis', name: 'Kinesis', appearance: 'Ancient being of motion. Blur of perpetual movement, streaks of color suggesting speed.' },
  ];

  for (const god of gods) {
    assets.push({
      id: `portrait-god-${god.id}`,
      characterId: god.id,
      name: god.name,
      type: 'god',
      expression: 'neutral',
      appearance: god.appearance,
      dimensions: DIMENSIONS.portrait,
      prompt: `${MASTER_STYLE_PROMPT}\n\n16-bit JRPG dormant god portrait. ` +
        `Ethereal, larger-than-life presence. ${god.appearance} ` +
        `Style: mythic and awe-inspiring, luminous quality, memory-amber (${PALETTE.memoryEnergy}) accents.`,
      negativePrompt: `${MASTER_NEGATIVE_PROMPT}, human face, realistic`,
      docRefs: [
        { path: 'docs/world/dormant-gods.md', heading: god.name, purpose: 'content' },
      ],
      filename: `god-${god.id}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  const manifest: PortraitManifest = {
    schemaVersion: '1.0.0',
    description: 'Character portrait generation manifest',
    updatedAt: timestamp(),
    styleGuide: `${MASTER_STYLE_PROMPT} Portraits are 16-bit JRPG style, head and shoulders, for dialogue boxes.`,
    styleDocRefs: DEFAULT_DOC_REFS.globalStyle,
    assets,
  };

  console.log(`  Total portrait assets: ${assets.length}`);
  return manifest;
}

// ============================================================================
// ITEM ICON MANIFEST BUILDER
// ============================================================================

function buildItemIconManifest(): ItemIconManifest {
  console.log('Building item icon manifest...');

  const assets: ItemIconAsset[] = [];

  // Starter weapons (one per class, the rest will be populated from items-catalog.md)
  const starterWeapons = [
    { id: 'W-SW-01', name: 'Iron Sword', cat: 'weapon-sword' as const, desc: 'Simple iron sword with leather-wrapped grip. Basic starter weapon.' },
    { id: 'W-ST-01', name: 'Oak Staff', cat: 'weapon-staff' as const, desc: 'Wooden staff topped with a small amber crystal. Mage starter weapon.' },
    { id: 'W-WD-01', name: 'Willow Wand', cat: 'weapon-wand' as const, desc: 'Slender willow wand with a glowing amber tip. Cleric starter weapon.' },
    { id: 'W-DG-01', name: 'Iron Dagger', cat: 'weapon-dagger' as const, desc: 'Short iron dagger, slightly curved. Rogue starter weapon.' },
  ];

  for (const wpn of starterWeapons) {
    assets.push({
      id: wpn.id,
      name: wpn.name,
      category: wpn.cat,
      appearance: wpn.desc,
      dimensions: DIMENSIONS.itemIcon,
      prompt: `${MASTER_STYLE_PROMPT}\n\n16-bit RPG item icon, 32×32 pixels. ` +
        `${wpn.desc} Top-down perspective, clean silhouette on transparent background. ` +
        `Style: SNES inventory icon.`,
      negativePrompt: `${MASTER_NEGATIVE_PROMPT}, text, hand holding weapon`,
      docRefs: [
        { path: 'docs/design/items-catalog.md', heading: 'Weapons', purpose: 'content' },
      ],
      filename: `${wpn.id.toLowerCase()}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  // Consumables
  const consumables = [
    { id: 'C-01', name: 'Healing Herb', desc: 'Small green herb with golden shimmer. Basic HP restoration.' },
    { id: 'C-02', name: 'Memory Tonic', desc: 'Small vial of amber liquid, glowing softly. SP restoration.' },
    { id: 'C-03', name: 'Antidote', desc: 'Clear glass bottle with green liquid. Cures poison.' },
  ];

  for (const item of consumables) {
    assets.push({
      id: item.id,
      name: item.name,
      category: 'consumable',
      appearance: item.desc,
      dimensions: DIMENSIONS.itemIcon,
      prompt: `${MASTER_STYLE_PROMPT}\n\n16-bit RPG item icon, 32×32 pixels. ` +
        `${item.desc} Clean silhouette on transparent background.`,
      negativePrompt: `${MASTER_NEGATIVE_PROMPT}, text, hand`,
      docRefs: [
        { path: 'docs/design/items-catalog.md', heading: 'Consumables', purpose: 'content' },
      ],
      filename: `${item.id.toLowerCase()}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  // Memory fragments
  const fragments = [
    { id: 'MF-GENERIC', name: 'Memory Fragment', desc: 'Glowing amber crystal shard, warm golden light radiating outward. The core collectible of the game.' },
    { id: 'MF-JOY', name: 'Fragment of Joy', desc: 'Bright golden crystal shard with sunlight yellow glow and warm sparkles.' },
    { id: 'MF-FURY', name: 'Fragment of Fury', desc: 'Deep red crystal shard with forge-fire glow, small flame particles.' },
    { id: 'MF-SORROW', name: 'Fragment of Sorrow', desc: 'Twilight purple crystal shard with soft luminous tears of light.' },
    { id: 'MF-AWE', name: 'Fragment of Awe', desc: 'Aurora green crystal shard with prismatic sparkle, shifting colors at edges.' },
    { id: 'MF-CALM', name: 'Fragment of Calm', desc: 'Sky blue crystal shard with gentle steady glow, no sparkle, peaceful.' },
  ];

  for (const frag of fragments) {
    assets.push({
      id: frag.id,
      name: frag.name,
      category: 'memory-fragment',
      appearance: frag.desc,
      glowEffect: true,
      dimensions: DIMENSIONS.itemIcon,
      prompt: `${MASTER_STYLE_PROMPT}\n\n16-bit RPG item icon, 32×32 pixels. ` +
        `${frag.desc} Distinct glowing effect, readable at small size. Transparent background.`,
      negativePrompt: `${MASTER_NEGATIVE_PROMPT}, text, realistic crystal`,
      docRefs: [
        { path: 'docs/design/memory-system.md', heading: 'Memory Fragments', purpose: 'content' },
        { path: 'docs/design/visual-direction.md', heading: 'Particle Effects', purpose: 'style' },
      ],
      filename: `${frag.id.toLowerCase()}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  const manifest: ItemIconManifest = {
    schemaVersion: '1.0.0',
    description: 'Item icon generation manifest',
    updatedAt: timestamp(),
    styleGuide: `${MASTER_STYLE_PROMPT} Icons are 32×32, SNES-style inventory icons on transparent backgrounds.`,
    styleDocRefs: DEFAULT_DOC_REFS.globalStyle,
    assets,
  };

  console.log(`  Total item icon assets: ${assets.length}`);
  return manifest;
}

// ============================================================================
// MAIN
// ============================================================================

const targets = process.argv.slice(2);
const buildAll = targets.length === 0 || targets.includes('all');

console.log('Mnemonic Realms — Manifest Builder\n');

if (buildAll || targets.includes('tilesets')) {
  writeManifest('tilesets', buildTilesetManifest());
}
if (buildAll || targets.includes('sprites')) {
  writeManifest('sprites', buildSpritesheetManifest());
}
if (buildAll || targets.includes('portraits')) {
  writeManifest('portraits', buildPortraitManifest());
}
if (buildAll || targets.includes('items')) {
  writeManifest('items', buildItemIconManifest());
}

console.log('\nDone.');
