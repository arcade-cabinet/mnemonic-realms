/**
 * Portrait Generation Schemas
 *
 * Character portraits for dialogue boxes, menus, and story scenes.
 * Larger images than sprites — typically 128×128 or 256×256.
 *
 * Named characters get unique portraits with multiple expressions.
 * Generic NPCs (merchant, elder, etc.) get archetype portraits.
 *
 * Cross-references: docs/story/characters.md, docs/story/act1-script.md
 */

import { z } from 'zod/v4';
import {
  AssetDimensionsSchema,
  DocRefSchema,
  GenerationMetadataSchema,
  GenerationStatusSchema,
  OutputFormatSchema,
} from './common';

// ============================================================================
// PORTRAIT TYPES
// ============================================================================

export const PortraitTypeSchema = z.enum([
  'named',       // Major characters (player, companions, key NPCs)
  'archetype',   // Generic NPC types (merchant, elder, guard)
  'enemy',       // Enemy portraits for bestiary/combat UI
  'god',         // Dormant god portraits for recall cinematics
]);
export type PortraitType = z.infer<typeof PortraitTypeSchema>;

export const ExpressionSchema = z.enum([
  'neutral',
  'happy',
  'sad',
  'angry',
  'surprised',
  'determined',
  'afraid',
  'thoughtful',
]);
export type Expression = z.infer<typeof ExpressionSchema>;

// ============================================================================
// PORTRAIT ASSET
// ============================================================================

export const PortraitAssetSchema = z.object({
  id: z.string().describe('Unique ID, e.g., "portrait-lira-neutral"'),
  characterId: z.string().describe('Character identifier, e.g., "lira", "callum", "merchant"'),
  name: z.string().describe('Display name, e.g., "Lira"'),
  type: PortraitTypeSchema,
  expression: ExpressionSchema.default('neutral'),

  // Visual description
  appearance: z.string().describe('Character appearance (face, hair, clothing, distinguishing features)'),
  age: z.string().optional().describe('Approximate age range'),
  distinguishingFeatures: z.string().optional().describe('What makes this character visually unique'),

  // Dimensions
  dimensions: AssetDimensionsSchema,

  // Prompt assembly
  prompt: z.string().describe('Base generation prompt'),
  negativePrompt: z.string().optional(),
  docRefs: z.array(DocRefSchema).describe('Character description sections'),

  // Output
  filename: z.string(),
  format: OutputFormatSchema.default('png'),

  // Generation tracking
  status: GenerationStatusSchema.default('pending'),
  metadata: GenerationMetadataSchema.optional(),
  lastError: z.string().optional(),
});
export type PortraitAsset = z.infer<typeof PortraitAssetSchema>;

// ============================================================================
// PORTRAIT MANIFEST
// ============================================================================

export const PortraitManifestSchema = z.object({
  $schema: z.string().optional(),
  schemaVersion: z.string().default('1.0.0'),
  description: z.string().default('Character portrait generation manifest'),
  updatedAt: z.string(),

  styleGuide: z.string().describe('Portrait art style rules (16-bit JRPG, NOT anime, NOT photorealistic)'),
  styleDocRefs: z.array(DocRefSchema),

  assets: z.array(PortraitAssetSchema),
});
export type PortraitManifest = z.infer<typeof PortraitManifestSchema>;
