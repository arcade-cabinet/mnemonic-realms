/**
 * Audio BGM Schemas
 *
 * Multi-layer BGM stems for zone themes, combat, and event music.
 * Cross-references: docs/design/audio-direction.md#bgm-catalog
 */

import { z } from 'zod';

export const BgmTypeSchema = z.enum(['zone', 'combat', 'event']);
export type BgmType = z.infer<typeof BgmTypeSchema>;

export const BgmMoodSchema = z.enum([
  'warm',
  'pastoral',
  'mysterious',
  'lively',
  'expansive',
  'reflective',
  'determined',
  'ethereal',
  'sacred',
  'stark',
  'austere',
  'tender',
  'ancient',
  'joyful',
  'primordial',
  'cold',
  'energetic',
  'epic',
  'tense',
  'gentle',
  'melancholic',
  'triumphant',
  'transcendent',
  'nostalgic',
]);
export type BgmMood = z.infer<typeof BgmMoodSchema>;

export const BgmStemSchema = z.object({
  layer: z.number().int().min(1).max(4),
  instruments: z.string(),
  description: z.string(),
  filename: z.string(),
});
export type BgmStem = z.infer<typeof BgmStemSchema>;

export const BgmAssetSchema = z.object({
  id: z.string().describe('Unique ID, e.g., "BGM-VH"'),
  name: z.string(),
  type: BgmTypeSchema,
  zone: z.string().optional().describe('Zone code for zone BGM'),
  tempo: z.number().int().positive(),
  key: z.string(),
  timeSignature: z.string(),
  mood: BgmMoodSchema,
  durationSec: z.number().positive(),
  stems: z.array(BgmStemSchema).min(1).max(4),
  status: z.enum(['pending', 'generated', 'approved']).default('pending'),
});
export type BgmAsset = z.infer<typeof BgmAssetSchema>;

export const BgmManifestSchema = z.object({
  schemaVersion: z.string().default('1.0.0'),
  description: z.string().default('BGM generation manifest'),
  updatedAt: z.string(),
  assets: z.array(BgmAssetSchema),
});
export type BgmManifest = z.infer<typeof BgmManifestSchema>;
