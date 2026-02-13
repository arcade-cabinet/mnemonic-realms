/** Builds a single biome tileset asset from DDL config and parsed tile rows. */

import {
  DEFAULT_DOC_REFS,
  MASTER_NEGATIVE_PROMPT,
  MASTER_STYLE_PROMPT,
  TIER_STYLE,
} from '../config/index';
import type { TilesetAsset, TileType, VibrancyTier } from '../schemas/index';
import { genDims, slugify } from './manifest-io';

function parseTiles(rows: Record<string, string>[], tierCol: string, cols: number): TileType[] {
  return rows.map((row, i) => {
    const name = row.Name || row.Description || `tile-${i}`;
    const isAnim = !!row.Frames || /water|torch/i.test(name);
    const frames = row.Frames ? parseInt(row.Frames, 10) : isAnim ? 3 : 1;
    return {
      id: slugify(row.ID || `tile-${i}`),
      name,
      description: row[tierCol] || row.Description || '',
      gridPosition: { col: i % cols, row: Math.floor(i / cols), spanCols: 1, spanRows: 1 },
      variants: 1,
      animated: isAnim,
      animFrames: isAnim ? frames : 1,
    };
  });
}

export function buildBiomeAsset(
  biome: { biome: string; heading: string; zones: string[]; gridCols: number; gridRows: number },
  tier: VibrancyTier,
  rows: Record<string, string>[],
  tierCol: string,
): TilesetAsset {
  const tiles = parseTiles(rows, tierCol, biome.gridCols);
  const desc = tiles.map((t) => `- ${t.name}: ${t.description}`).join('\n');
  const w = biome.gridCols * 32;
  const h = biome.gridRows * 32;

  return {
    id: `tileset-${biome.biome}-${tier}`,
    biome: biome.biome,
    tier,
    zones: biome.zones,
    tiles,
    gridCols: biome.gridCols,
    gridRows: biome.gridRows,
    tileSize: 32,
    dimensions: genDims(w, h),
    prompt:
      `${MASTER_STYLE_PROMPT}\n\n${TIER_STYLE[tier]}\n\n` +
      `Pixel art tileset for "${biome.biome}" at ${tier} vibrancy. ` +
      `${biome.gridCols}x${biome.gridRows}, 32x32.\n${desc}\n\n` +
      `Zones: ${biome.zones.join(', ')}. Seamlessly tileable.`,
    negativePrompt: MASTER_NEGATIVE_PROMPT,
    docRefs: [
      { path: 'docs/design/tileset-spec.md', heading: biome.heading, purpose: 'content' as const },
      {
        path: 'docs/design/visual-direction.md',
        heading: 'Environment Tiles',
        purpose: 'style' as const,
      },
      ...DEFAULT_DOC_REFS.tileRules,
    ],
    filename: `tiles_${biome.biome}_${tier}.png`,
    format: 'png',
    status: 'pending',
  };
}
