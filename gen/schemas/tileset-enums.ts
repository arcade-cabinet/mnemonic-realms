/** Tileset biome and vibrancy tier enums. */

import { z } from 'zod/v4';

export const BiomeTypeSchema = z.enum([
  'village',
  'grassland',
  'forest',
  'riverside',
  'mountain',
  'wetland',
  'plains',
  'sketch',
  'dungeon',
  'stagnation',
]);
export type BiomeType = z.infer<typeof BiomeTypeSchema>;

export const VibrancyTierSchema = z.enum(['muted', 'normal', 'vivid']);
export type VibrancyTier = z.infer<typeof VibrancyTierSchema>;

export const TileTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  gridPosition: z.object({
    col: z.number().int().min(0),
    row: z.number().int().min(0),
    spanCols: z.number().int().min(1).default(1),
    spanRows: z.number().int().min(1).default(1),
  }),
  variants: z.number().int().min(1).default(1),
  animated: z.boolean().default(false),
  animFrames: z.number().int().min(1).default(1),
});
export type TileType = z.infer<typeof TileTypeSchema>;
