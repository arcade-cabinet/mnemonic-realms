/** Orchestrates tileset manifest building from DDL configs. */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEFAULT_DOC_REFS, MASTER_STYLE_PROMPT } from '../config/index';
import type { TilesetAsset, TilesetManifest, VibrancyTier } from '../schemas/index';
import { extractSection } from '../utils/index';
import {
  loadBiomes,
  loadBiomesMeta,
  loadStagnation,
  loadTransitions,
  loadTransitionsMeta,
} from './ddl-loader';
import { PROJECT_ROOT, timestamp } from './manifest-io';
import { buildBiomeAsset } from './tileset-biome';
import { collectBiomeTileRows } from './tileset-parser';
import { buildStagnationAsset } from './tileset-stagnation';
import { buildTransitionAssets } from './tileset-transitions';

const TIERS: VibrancyTier[] = ['muted', 'normal', 'vivid'];

export function buildTilesetManifest(): TilesetManifest {
  console.log('Building tileset manifest...');
  const assets: TilesetAsset[] = [];
  const biomes = loadBiomes();
  const meta = loadBiomesMeta();

  const specContent = (() => {
    try {
      return readFileSync(resolve(PROJECT_ROOT, 'docs/design/tileset-spec.md'), 'utf-8');
    } catch {
      return null;
    }
  })();

  if (!specContent) {
    console.error('  ERROR: Could not read docs/design/tileset-spec.md');
    return {
      schemaVersion: '1.0.0',
      description: '',
      updatedAt: timestamp(),
      styleGuide: MASTER_STYLE_PROMPT,
      styleDocRefs: DEFAULT_DOC_REFS.globalStyle,
      assets: [],
    };
  }

  for (const biome of biomes) {
    const section = extractSection(specContent, biome.heading);
    if (!section) {
      console.warn(`  Warning: "${biome.heading}" not found`);
      continue;
    }
    const rows = collectBiomeTileRows(section);
    if (rows.length === 0) {
      console.warn(`  Warning: no tiles for ${biome.heading}`);
      continue;
    }
    console.log(`  ${biome.biome}: ${rows.length} tile types`);
    const colMap = biome.biome === 'sketch' ? meta.sketchTierColumnMap : meta.tierColumnMap;
    for (const tier of TIERS) {
      assets.push(buildBiomeAsset(biome, tier, rows, colMap[tier]));
    }
  }

  const stgSection = extractSection(specContent, 'Overlay: Stagnation/Crystal');
  if (stgSection) {
    const stgRows = collectBiomeTileRows(stgSection);
    assets.push(buildStagnationAsset(stgRows, loadStagnation()));
    console.log('  stagnation: overlay tile types');
  }

  const transAssets = buildTransitionAssets(loadTransitions(), loadTransitionsMeta());
  assets.push(...transAssets);
  console.log(`  transitions: ${transAssets.length} assets`);
  console.log(`  Total tileset assets: ${assets.length}`);

  return {
    schemaVersion: '1.0.0',
    description: 'Tileset manifest — biomes x tiers + stagnation + transitions',
    updatedAt: timestamp(),
    styleGuide: MASTER_STYLE_PROMPT,
    styleDocRefs: DEFAULT_DOC_REFS.globalStyle,
    assets,
  };
}
