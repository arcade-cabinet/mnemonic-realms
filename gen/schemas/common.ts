/** Common GenAI Pipeline Schemas — re-exports from decomposed modules. */

export type { DocRef, DocRefPurpose } from './common-docref';
export { DocRefPurposeSchema, DocRefSchema } from './common-docref';
export type {
  AssetCategory,
  AssetDimensions,
  GenerationMetadata,
  GenerationStatus,
  OutputFormat,
} from './common-generation';
export {
  AssetCategorySchema,
  AssetDimensionsSchema,
  GenerationMetadataSchema,
  GenerationStatusSchema,
  OutputFormatSchema,
} from './common-generation';

export { hashFile, hashPrompt, isCodeTruncated, needsRegeneration } from './common-hash';
