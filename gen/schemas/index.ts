/** GenAI Pipeline Schemas — Barrel Export. */

// Audio schemas
export type { AmbientAsset, AmbientBiome, AmbientManifest } from './audio-ambient';
export { AmbientAssetSchema, AmbientBiomeSchema, AmbientManifestSchema } from './audio-ambient';
export type { BgmAsset, BgmManifest, BgmMood, BgmStem, BgmType } from './audio-bgm';
export {
  BgmAssetSchema,
  BgmManifestSchema,
  BgmMoodSchema,
  BgmStemSchema,
  BgmTypeSchema,
} from './audio-bgm';
export type { SfxAsset, SfxCategory, SfxManifest } from './audio-sfx';
export { SfxAssetSchema, SfxCategorySchema, SfxManifestSchema } from './audio-sfx';
// Code generation schemas
export type { CodeCategory, CodeGenEntry, CodeGenManifest } from './codegen';
export { CodeCategorySchema, CodeGenEntrySchema, CodeGenManifestSchema } from './codegen';
export * from './codegen-ddl';
// Common types
export type {
  AssetCategory,
  AssetDimensions,
  DocRef,
  DocRefPurpose,
  GenerationMetadata,
  GenerationStatus,
  OutputFormat,
} from './common';
export {
  AssetCategorySchema,
  AssetDimensionsSchema,
  DocRefPurposeSchema,
  DocRefSchema,
  GenerationMetadataSchema,
  GenerationStatusSchema,
  hashPrompt,
  needsRegeneration,
  OutputFormatSchema,
} from './common';
