/** Generation status, metadata, dimensions, format, and category schemas. */

import { z } from 'zod/v4';

export const GenerationStatusSchema = z.enum(['pending', 'generating', 'generated', 'failed']);
export type GenerationStatus = z.infer<typeof GenerationStatusSchema>;

export const GenerationMetadataSchema = z.object({
  promptHash: z.string().describe('SHA-256 hash of the assembled prompt'),
  outputHash: z.string().optional().describe('SHA-256 hash of the generated output file'),
  generatedAt: z.iso.datetime().describe('ISO timestamp of generation'),
  generationTimeMs: z.number().describe('Time taken in milliseconds'),
  fileSizeBytes: z.number().describe('Size of generated file in bytes'),
  model: z.string().describe('Model used for generation'),
  postProcessing: z.array(z.string()).optional().describe('Post-processing steps applied'),
});
export type GenerationMetadata = z.infer<typeof GenerationMetadataSchema>;

export const AssetDimensionsSchema = z.object({
  width: z.number().int().positive().describe('Target width in pixels'),
  height: z.number().int().positive().describe('Target height in pixels'),
  genWidth: z.number().int().positive().describe('Width to request from Gemini'),
  genHeight: z.number().int().positive().describe('Height to request from Gemini'),
});
export type AssetDimensions = z.infer<typeof AssetDimensionsSchema>;

export const OutputFormatSchema = z.enum(['png', 'webp']);
export type OutputFormat = z.infer<typeof OutputFormatSchema>;

export const AssetCategorySchema = z.enum([
  'tileset',
  'spritesheet',
  'portrait',
  'item-icon',
  'ui-element',
  'particle',
]);
export type AssetCategory = z.infer<typeof AssetCategorySchema>;
