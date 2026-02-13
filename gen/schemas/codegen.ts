/** Zod schemas for code generation manifests. */

import { z } from 'zod/v4';
import { DocRefSchema, GenerationMetadataSchema, GenerationStatusSchema } from './common';

/**
 * Code generation output categories.
 * Each maps to a manifest file, output directory, and target directory.
 */
export const CodeCategorySchema = z.enum([
  'database-weapons',
  'database-armor',
  'database-consumables',
  'database-skills',
  'database-enemies',
  'database-classes',
  'database-states',
  'database-maps',
  'event-scenes',
  'event-quests',
  'event-dialogue',
]);
export type CodeCategory = z.infer<typeof CodeCategorySchema>;

/**
 * A single code generation entry in a manifest.
 * Parallels the image AssetEntry but for TypeScript/Vue code output.
 */
export const CodeGenEntrySchema = z.object({
  id: z.string().describe('Unique identifier matching DDL entry'),
  name: z.string().describe('Human-readable name'),
  category: CodeCategorySchema,
  filename: z.string().describe('Output filename relative to output dir (e.g., training-sword.ts)'),
  targetPath: z.string().describe('Final integration path relative to project root'),
  prompt: z.string().describe('Base prompt for Gemini text generation'),
  docRefs: z.array(DocRefSchema).describe('Bible sections to inject as context'),
  status: GenerationStatusSchema,
  metadata: GenerationMetadataSchema.optional(),
});
export type CodeGenEntry = z.infer<typeof CodeGenEntrySchema>;

/**
 * A complete code generation manifest for one category.
 */
export const CodeGenManifestSchema = z.object({
  schemaVersion: z.string(),
  description: z.string(),
  updatedAt: z.string(),
  category: CodeCategorySchema,
  systemPrompt: z.string().describe('System-level instruction for Gemini text generation'),
  assets: z.array(CodeGenEntrySchema),
});
export type CodeGenManifest = z.infer<typeof CodeGenManifestSchema>;
