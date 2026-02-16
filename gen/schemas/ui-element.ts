/**
 * UI Element Generation Schemas
 *
 * Backgrounds, frames, borders, and decorative elements for the game UI.
 * These are larger assets — dialogue boxes, battle frames, menu backgrounds.
 *
 * Cross-references: docs/design/visual-direction.md#ui-design
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
// UI ELEMENT TYPES
// ============================================================================

export const UIElementTypeSchema = z.enum([
  'dialogue-frame', // Bottom-panel dialogue box background
  'battle-frame', // Combat UI background/overlay
  'menu-background', // Inventory/equipment/status menu background
  'title-background', // Title screen background
  'window-border', // 9-slice window border for generic panels
  'button', // UI button backgrounds (normal, hover, pressed)
  'hud-element', // HP/SP bars, fragment counter
]);
export type UIElementType = z.infer<typeof UIElementTypeSchema>;

// ============================================================================
// UI ELEMENT ASSET
// ============================================================================

export const UIElementAssetSchema = z.object({
  id: z.string().describe('Unique ID, e.g., "ui-dialogue-frame"'),
  name: z.string(),
  type: UIElementTypeSchema,

  // Visual description
  appearance: z.string().describe('Visual description of the UI element'),
  nineSlice: z.boolean().default(false).describe('Whether this is a 9-slice tileable border'),
  nineSlicePadding: z.number().int().optional().describe('Border thickness in pixels for 9-slice'),

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
export type UIElementAsset = z.infer<typeof UIElementAssetSchema>;

// ============================================================================
// UI ELEMENT MANIFEST
// ============================================================================

export const UIElementManifestSchema = z.object({
  $schema: z.string().optional(),
  schemaVersion: z.string().default('1.0.0'),
  description: z.string().default('UI element generation manifest'),
  updatedAt: z.string(),

  styleGuide: z.string(),
  styleDocRefs: z.array(DocRefSchema),

  assets: z.array(UIElementAssetSchema),
});
export type UIElementManifest = z.infer<typeof UIElementManifestSchema>;
