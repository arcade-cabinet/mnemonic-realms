/**
 * Item Icon Generation Schemas
 *
 * Icons for weapons, armor, consumables, key items, accessories, and memory fragments.
 * Standard size: 32×32 for inventory grid, with 48×48 upscale for detail views.
 *
 * Cross-references: docs/design/items-catalog.md
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
// ITEM CATEGORIES
// ============================================================================

export const ItemCategorySchema = z.enum([
  'weapon-sword',
  'weapon-staff',
  'weapon-wand',
  'weapon-dagger',
  'armor-head',
  'armor-body',
  'armor-accessory',
  'consumable',
  'key-item',
  'memory-fragment',
]);
export type ItemCategory = z.infer<typeof ItemCategorySchema>;

// ============================================================================
// ITEM ICON ASSET
// ============================================================================

export const ItemIconAssetSchema = z.object({
  id: z.string().describe('Unique ID matching items-catalog, e.g., "W-SW-01", "MF-03"'),
  name: z.string().describe('Item name from catalog'),
  category: ItemCategorySchema,

  // Visual description
  appearance: z.string().describe('What the icon should depict'),
  colorPrimary: z.string().optional().describe('Dominant color'),
  glowEffect: z.boolean().default(false).describe('Whether the icon has a magical glow'),

  // Dimensions
  dimensions: AssetDimensionsSchema,

  // Prompt assembly
  prompt: z.string(),
  negativePrompt: z.string().optional(),
  docRefs: z.array(DocRefSchema),

  // Output
  filename: z.string(),
  format: OutputFormatSchema.default('png'),

  // Generation tracking
  status: GenerationStatusSchema.default('pending'),
  metadata: GenerationMetadataSchema.optional(),
  lastError: z.string().optional(),
});
export type ItemIconAsset = z.infer<typeof ItemIconAssetSchema>;

// ============================================================================
// ITEM ICON MANIFEST
// ============================================================================

export const ItemIconManifestSchema = z.object({
  $schema: z.string().optional(),
  schemaVersion: z.string().default('1.0.0'),
  description: z.string().default('Item icon generation manifest'),
  updatedAt: z.string(),

  styleGuide: z.string(),
  styleDocRefs: z.array(DocRefSchema),

  assets: z.array(ItemIconAssetSchema),
});
export type ItemIconManifest = z.infer<typeof ItemIconManifestSchema>;
