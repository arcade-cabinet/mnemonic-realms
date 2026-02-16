/**
 * Audio SFX Schemas
 *
 * Freesound-sourced sound effects for UI, combat, memory, and environment.
 * Cross-references: docs/design/audio-direction.md#sound-effects-catalog
 */

import { z } from 'zod';

export const SfxCategorySchema = z.enum(['ui', 'combat', 'memory', 'environment']);
export type SfxCategory = z.infer<typeof SfxCategorySchema>;

export const SfxAssetSchema = z.object({
  id: z.string().describe('Unique ID, e.g., "SFX-UI-01"'),
  name: z.string(),
  category: SfxCategorySchema,
  description: z.string(),
  durationSec: z.number().positive(),
  looping: z.boolean().default(false),
  filename: z.string(),
  freesoundId: z.number().optional().describe('Freesound.org asset ID if sourced'),
  status: z.enum(['pending', 'generated', 'approved']).default('pending'),
});
export type SfxAsset = z.infer<typeof SfxAssetSchema>;

export const SfxManifestSchema = z.object({
  schemaVersion: z.string().default('1.0.0'),
  description: z.string().default('SFX generation manifest'),
  updatedAt: z.string(),
  assets: z.array(SfxAssetSchema),
});
export type SfxManifest = z.infer<typeof SfxManifestSchema>;
