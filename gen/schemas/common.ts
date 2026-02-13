/**
 * Common GenAI Pipeline Schemas
 *
 * Shared types used across all asset generation manifests.
 * Follows the stellar-descent manifest-driven pattern with prompt hash idempotency.
 *
 * Key innovation: DocRef — links each asset to the exact markdown heading that
 * describes it, so the generation script can auto-load bible sections as context.
 */

import { z } from 'zod/v4';
import { createHash } from 'node:crypto';

// ============================================================================
// DOCUMENT REFERENCE (DocRef)
// ============================================================================

/**
 * Purpose describes how a referenced document section is used in prompt assembly:
 * - 'style': visual direction, color philosophy, art style constraints
 * - 'content': what the asset depicts (tile descriptions, character appearance)
 * - 'constraints': mechanical requirements (dimensions, animation frames, format)
 * - 'palette': specific color values or vibrancy-tier color rules
 */
export const DocRefPurposeSchema = z.enum(['style', 'content', 'constraints', 'palette']);
export type DocRefPurpose = z.infer<typeof DocRefPurposeSchema>;

/**
 * A reference to a specific section in a markdown document.
 *
 * The generation script resolves these by:
 * 1. Reading the file at `path` (relative to project root)
 * 2. Finding the heading matching `heading` (case-insensitive)
 * 3. Extracting all content until the next heading of same or higher level
 * 4. Injecting the extracted text into the prompt under a labeled section
 *
 * Example:
 *   { path: 'docs/world/vibrancy-system.md', heading: 'Biome: Village', purpose: 'content' }
 *   → extracts the Village tile swap table and injects it as content context
 */
export const DocRefSchema = z.object({
  path: z.string().describe('Relative path from project root, e.g., docs/world/vibrancy-system.md'),
  heading: z.string().describe('Markdown heading text to locate (case-insensitive, without # prefix)'),
  purpose: DocRefPurposeSchema,
});
export type DocRef = z.infer<typeof DocRefSchema>;

// ============================================================================
// GENERATION STATUS & METADATA
// ============================================================================

export const GenerationStatusSchema = z.enum(['pending', 'generating', 'generated', 'failed']);
export type GenerationStatus = z.infer<typeof GenerationStatusSchema>;

/**
 * Metadata attached after successful generation. Enables idempotent re-runs:
 * if the prompt hash hasn't changed and the file exists, skip regeneration.
 */
export const GenerationMetadataSchema = z.object({
  promptHash: z.string().describe('SHA-256 hash of the assembled prompt (including resolved DocRefs)'),
  outputHash: z.string().optional().describe('SHA-256 hash of the generated output file for integrity verification'),
  generatedAt: z.iso.datetime().describe('ISO timestamp of generation'),
  generationTimeMs: z.number().describe('Time taken to generate in milliseconds'),
  fileSizeBytes: z.number().describe('Size of generated file in bytes'),
  model: z.string().describe('Google Gemini/Imagen model used for generation'),
  postProcessing: z.array(z.string()).optional().describe('Post-processing steps applied (e.g., downscale, palette-quantize)'),
});
export type GenerationMetadata = z.infer<typeof GenerationMetadataSchema>;

// ============================================================================
// ASSET DIMENSIONS
// ============================================================================

/**
 * Pixel dimensions for generated assets.
 * Generation requests larger images, then post-processes down to target.
 */
export const AssetDimensionsSchema = z.object({
  width: z.number().int().positive().describe('Target width in pixels'),
  height: z.number().int().positive().describe('Target height in pixels'),
  genWidth: z.number().int().positive().describe('Width to request from Gemini (usually 4-8x target)'),
  genHeight: z.number().int().positive().describe('Height to request from Gemini (usually 4-8x target)'),
});
export type AssetDimensions = z.infer<typeof AssetDimensionsSchema>;

// ============================================================================
// OUTPUT FORMAT
// ============================================================================

export const OutputFormatSchema = z.enum(['png', 'webp']);
export type OutputFormat = z.infer<typeof OutputFormatSchema>;

// ============================================================================
// ASSET CATEGORY
// ============================================================================

/**
 * Top-level asset categories. Each maps to a manifest type and output directory.
 */
export const AssetCategorySchema = z.enum([
  'tileset',       // Biome tile sheets (32x32 tiles arranged in grids)
  'spritesheet',   // Character/enemy sprite sheets (32x48 frames in RPG Maker layout)
  'portrait',      // Character portrait images (for dialogue boxes, menus)
  'item-icon',     // Item/weapon/accessory icons (32x32 or 48x48)
  'ui-element',    // UI backgrounds, frames, borders
  'particle',      // Particle effect sprites
]);
export type AssetCategory = z.infer<typeof AssetCategorySchema>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Hash a prompt string for cache invalidation.
 * Uses SHA-256 truncated to 16 hex chars for reliable collision avoidance.
 */
export function hashPrompt(prompt: string): string {
  return createHash('sha256').update(prompt).digest('hex').slice(0, 16);
}

/**
 * Hash a file's contents for integrity verification.
 * Full SHA-256 hex digest.
 */
export function hashFile(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

/** Minimum valid file size in bytes. Any generated image (PNG/WebP) will exceed this. */
const MIN_VALID_FILE_BYTES = 1024;

/**
 * Check if an asset needs regeneration.
 *
 * Checks in order:
 * 1. Status is pending/failed or no metadata → needs gen
 * 2. Output file missing → needs gen
 * 3. Output file empty or too small (< 1KB) → needs gen (failed/corrupt write)
 * 4. Prompt hash changed → needs gen (content/style changed)
 * 5. Output file hash mismatch → needs gen (file corrupted or replaced)
 */
export function needsRegeneration(
  status: GenerationStatus,
  metadata: GenerationMetadata | undefined,
  currentPromptHash: string,
  fileExists: boolean,
  fileData?: Buffer,
): boolean {
  if (status === 'pending' || status === 'failed' || !metadata) return true;
  if (!fileExists) return true;
  if (fileData && fileData.length < MIN_VALID_FILE_BYTES) return true;
  if (metadata.promptHash !== currentPromptHash) return true;
  if (fileData && metadata.outputHash) {
    const currentFileHash = hashFile(fileData);
    if (currentFileHash !== metadata.outputHash) return true;
  }
  return false;
}
