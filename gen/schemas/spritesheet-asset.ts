/** Spritesheet asset and manifest schemas. */

import { z } from 'zod/v4';
import {
  AssetDimensionsSchema,
  DocRefSchema,
  GenerationMetadataSchema,
  GenerationStatusSchema,
  OutputFormatSchema,
} from './common';
import { AnimationSetSchema, SpriteCategorySchema, SpriteSizeSchema } from './spritesheet-enums';

export const SpritesheetAssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: SpriteCategorySchema,
  appearance: z.string(),
  colorAccent: z.string().optional(),
  silhouetteNote: z.string().optional(),
  spriteSize: SpriteSizeSchema.default('32x32'),
  animations: AnimationSetSchema,
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
export type SpritesheetAsset = z.infer<typeof SpritesheetAssetSchema>;

export const SpritesheetManifestSchema = z.object({
  $schema: z.string().optional(),
  schemaVersion: z.string().default('1.0.0'),
  description: z.string().default('Spritesheet generation manifest'),
  updatedAt: z.string(),
  styleGuide: z.string(),
  styleDocRefs: z.array(DocRefSchema),
  assets: z.array(SpritesheetAssetSchema),
});
export type SpritesheetManifest = z.infer<typeof SpritesheetManifestSchema>;
