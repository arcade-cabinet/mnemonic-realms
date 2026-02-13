/** Builds stagnation overlay tileset asset from DDL config. */

import {
  DEFAULT_DOC_REFS,
  MASTER_NEGATIVE_PROMPT,
  MASTER_STYLE_PROMPT,
  PALETTE,
} from '../config/index';
import type { StagnationMeta } from '../schemas/ddl';
import type { TilesetAsset, TileType } from '../schemas/index';
import { genDims, slugify } from './manifest-io';

export function buildStagnationAsset(
  rows: Record<string, string>[],
  ddl: StagnationMeta,
): TilesetAsset {
  const tiles: TileType[] = rows.map((row, i) => ({
    id: slugify(row.ID || `stagnation-${i}`),
    name: row.Name || `Stagnation tile ${i}`,
    description: row.Description || '',
    gridPosition: {
      col: i % ddl.gridCols,
      row: Math.floor(i / ddl.gridCols),
      spanCols: 1,
      spanRows: 1,
    },
    variants: 1,
    animated: !!row.Frames,
    animFrames: row.Frames ? parseInt(row.Frames, 10) : 1,
  }));

  const desc = tiles.map((t) => `- ${t.name}: ${t.description}`).join('\n');

  return {
    id: 'tileset-stagnation-overlay',
    biome: 'stagnation',
    tier: 'normal',
    zones: ddl.zones,
    tiles,
    gridCols: ddl.gridCols,
    gridRows: ddl.gridRows,
    tileSize: 32,
    dimensions: genDims(ddl.gridCols * 32, ddl.gridRows * 32),
    prompt:
      `${MASTER_STYLE_PROMPT}\n\nStagnation overlay tileset, ` +
      `${ddl.gridCols}x${ddl.gridRows}, 32x32.\n${desc}\n` +
      `Palette: ${PALETTE.stagnation} fading to ${PALETTE.stagnationFade}.`,
    negativePrompt: MASTER_NEGATIVE_PROMPT,
    docRefs: [
      {
        path: 'docs/design/tileset-spec.md',
        heading: 'Overlay: Stagnation/Crystal',
        purpose: 'content',
      },
      ...DEFAULT_DOC_REFS.stagnation,
    ],
    filename: 'overlay_stagnation_crystal.png',
    format: 'png',
    status: 'pending',
  };
}
