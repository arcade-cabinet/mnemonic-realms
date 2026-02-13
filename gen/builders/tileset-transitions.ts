/** Builds transition tileset assets from DDL config. */

import { MASTER_NEGATIVE_PROMPT, MASTER_STYLE_PROMPT, TIER_STYLE } from '../config/index';
import type { Transition, TransitionsMeta } from '../schemas/ddl';
import type { TilesetAsset, VibrancyTier } from '../schemas/index';
import { genDims } from './manifest-io';

const TIERS: VibrancyTier[] = ['muted', 'normal', 'vivid'];

export function buildTransitionAssets(
  transitions: Transition[],
  meta: TransitionsMeta,
): TilesetAsset[] {
  const assets: TilesetAsset[] = [];
  const { gridCols, gridRows } = meta;

  for (const trans of transitions) {
    for (const tier of TIERS) {
      assets.push({
        id: `tileset-transition-${trans.from}-${trans.to}-${tier}`,
        biome: 'village',
        tier,
        zones: [trans.usedAt],
        tiles: [
          {
            id: `transition-${trans.from}-${trans.to}`,
            name: `${trans.from} to ${trans.to}`,
            description: `47-tile autotile blob set at ${tier}.`,
            gridPosition: { col: 0, row: 0, spanCols: gridCols, spanRows: gridRows },
            variants: 1,
            animated: false,
            animFrames: 1,
          },
        ],
        gridCols,
        gridRows,
        tileSize: 32,
        dimensions: genDims(gridCols * 32, gridRows * 32),
        prompt:
          `${MASTER_STYLE_PROMPT}\n\n${TIER_STYLE[tier]}\n\n` +
          `Transition autotile: "${trans.from}" to "${trans.to}" at ${tier}. ` +
          `${gridCols}x${gridRows}, 32x32. 47-tile blob set. Used at: ${trans.usedAt}.`,
        negativePrompt: MASTER_NEGATIVE_PROMPT,
        docRefs: [
          {
            path: 'docs/design/tileset-spec.md',
            heading: 'Transition Tiles Between Biomes',
            purpose: 'content',
          },
          {
            path: 'docs/design/visual-direction.md',
            heading: 'Environment Tiles',
            purpose: 'style',
          },
        ],
        filename: `overlay_transition_${trans.from}_${trans.to}_${tier}.png`,
        format: 'png',
        status: 'pending',
      });
    }
  }

  return assets;
}
