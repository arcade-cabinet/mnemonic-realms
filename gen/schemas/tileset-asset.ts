/** Tileset asset and manifest schemas. */

import { z } from 'zod/v4';
import {
  AssetDimensionsSchema,
  DocRefSchema,
  GenerationMetadataSchema,
  GenerationStatusSchema,
  OutputFormatSchema,
} from './common';
import { BiomeTypeSchema, TileTypeSchema, VibrancyTierSchema } from './tileset-enums';

export const TilesetAssetSchema = z.object({
  id: z.string(),
  biome: BiomeTypeSchema,
  tier: VibrancyTierSchema,
  zones: z.array(z.string()),
  tiles: z.array(TileTypeSchema),
  gridCols: z.number().int().positive(),
  gridRows: z.number().int().positive(),
  tileSize: z.number().int().positive().default(32),
  dimensions: AssetDimensionsSchema,
  prompt: z.string(),
  negativePrompt: z.string().optional(),
  docRefs: z.array(DocRefSchema),
  filename: z.string(),
  format: OutputFormatSchema.default('png'),
  status: GenerationStatusSchema.default('pending'),
  metadata: GenerationMetadataSchema.optional(),
  lastError: z.string().optional(),
});
export type TilesetAsset = z.infer<typeof TilesetAssetSchema>;

export const TilesetManifestSchema = z.object({
  $schema: z.string().optional(),
  schemaVersion: z.string().default('1.0.0'),
  description: z.string().default('Tileset generation manifest'),
  updatedAt: z.string(),
  styleGuide: z.string(),
  styleDocRefs: z.array(DocRefSchema),
  assets: z.array(TilesetAssetSchema),
});
export type TilesetManifest = z.infer<typeof TilesetManifestSchema>;
