/** Portrait asset and manifest schemas. */

import { z } from 'zod/v4';
import {
  AssetDimensionsSchema,
  DocRefSchema,
  GenerationMetadataSchema,
  GenerationStatusSchema,
  OutputFormatSchema,
} from './common';
import { ExpressionSchema, PortraitTypeSchema } from './portrait-enums';

export const PortraitAssetSchema = z.object({
  id: z.string(),
  characterId: z.string(),
  name: z.string(),
  type: PortraitTypeSchema,
  expression: ExpressionSchema.default('neutral'),
  appearance: z.string(),
  age: z.string().optional(),
  distinguishingFeatures: z.string().optional(),
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
export type PortraitAsset = z.infer<typeof PortraitAssetSchema>;

export const PortraitManifestSchema = z.object({
  $schema: z.string().optional(),
  schemaVersion: z.string().default('1.0.0'),
  description: z.string().default('Character portrait generation manifest'),
  updatedAt: z.string(),
  styleGuide: z.string(),
  styleDocRefs: z.array(DocRefSchema),
  assets: z.array(PortraitAssetSchema),
});
export type PortraitManifest = z.infer<typeof PortraitManifestSchema>;
