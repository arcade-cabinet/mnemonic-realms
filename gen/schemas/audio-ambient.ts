/**
 * Audio Ambient Loop Schemas
 *
 * Looping ambient soundscapes per biome.
 * Cross-references: docs/design/audio-direction.md#ambient-sound-layers
 */

import { z } from 'zod';

export const AmbientBiomeSchema = z.enum([
  'village',
  'grassland',
  'forest',
  'mountain',
  'riverside',
  'wetland',
  'plains',
  'dungeon',
  'sketch',
  'stagnation',
]);
export type AmbientBiome = z.infer<typeof AmbientBiomeSchema>;

export const AmbientAssetSchema = z.object({
  id: z.string().describe('Unique ID, e.g., "AMB-VILLAGE"'),
  name: z.string(),
  biome: AmbientBiomeSchema,
  description: z.string(),
  sourceQuery: z.string().describe('Search query for Freesound.org or similar'),
  defaultVolume: z.number().min(0).max(1),
  mutedDesc: z.string().describe('What plays at muted vibrancy'),
  vividDesc: z.string().describe('What plays at vivid vibrancy'),
  filename: z.string(),
  status: z.enum(['pending', 'generated', 'approved']).default('pending'),
});
export type AmbientAsset = z.infer<typeof AmbientAssetSchema>;

export const AmbientManifestSchema = z.object({
  schemaVersion: z.string().default('1.0.0'),
  description: z.string().default('Ambient loop manifest'),
  updatedAt: z.string(),
  assets: z.array(AmbientAssetSchema),
});
export type AmbientManifest = z.infer<typeof AmbientManifestSchema>;
