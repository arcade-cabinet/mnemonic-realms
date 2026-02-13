/**
 * Spritesheet Generation Schemas
 *
 * Defines character and enemy sprite sheets for RPG-JS.
 * RPG Maker format: 96×128 sheet = 3 columns × 4 rows of 32×32 frames
 *   - 4 rows = down, left, right, up directions
 *   - 3 columns = walk cycle (left step, standing, right step)
 *
 * Larger sprites (bosses) use 64×64 or 96×96 with the same grid layout
 * but scaled proportionally (192×256 or 288×384 sheets).
 *
 * Cross-references: docs/design/visual-direction.md#sprite-style
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
// SPRITE CATEGORIES
// ============================================================================

export const SpriteCategorySchema = z.enum([
  'player',       // Player character classes (Warrior, Mage, Rogue, Cleric)
  'companion',    // Party companions (Lira, Callum, Petra)
  'npc',          // Named and generic NPCs
  'enemy',        // Overworld and dungeon enemies
  'boss',         // Large boss sprites (64x64 or 96x96)
  'preserver',    // Preserver faction agents
]);
export type SpriteCategory = z.infer<typeof SpriteCategorySchema>;

// ============================================================================
// SPRITE SIZE PRESETS
// ============================================================================

/**
 * Standard sprite sizes. RPG-JS uses RPG Maker format sheets.
 */
export const SpriteSizeSchema = z.enum([
  '32x32',    // Standard characters, NPCs, small enemies
  '64x64',    // Mid-size bosses, large enemies
  '96x96',    // Final bosses, multi-part sprites
]);
export type SpriteSize = z.infer<typeof SpriteSizeSchema>;

// ============================================================================
// ANIMATION SET
// ============================================================================

/**
 * Animation configuration for a sprite.
 * Standard RPG Maker walk cycle: 3 frames × 4 directions.
 * Additional animations (attack, cast, hit) are separate sheets.
 */
export const AnimationSetSchema = z.object({
  walk: z.boolean().default(true).describe('3-frame walk cycle × 4 directions (standard)'),
  idle: z.boolean().default(false).describe('Separate idle animation'),
  attack: z.boolean().default(false).describe('Attack animation frames'),
  cast: z.boolean().default(false).describe('Spell cast animation'),
  hit: z.boolean().default(false).describe('Damage taken animation'),
  death: z.boolean().default(false).describe('Death animation'),
});
export type AnimationSet = z.infer<typeof AnimationSetSchema>;

// ============================================================================
// SPRITESHEET ASSET
// ============================================================================

export const SpritesheetAssetSchema = z.object({
  id: z.string().describe('Unique ID, e.g., "sprite-warrior", "sprite-enemy-wisp"'),
  name: z.string().describe('Display name, e.g., "Warrior", "Memory Wisp"'),
  category: SpriteCategorySchema,

  // Visual description
  appearance: z.string().describe('Detailed visual description of the character/creature'),
  colorAccent: z.string().optional().describe('Primary color accent for class/faction identification'),
  silhouetteNote: z.string().optional().describe('What makes this sprite readable at 32x32'),

  // Size and layout
  spriteSize: SpriteSizeSchema.default('32x32'),
  animations: AnimationSetSchema,
  dimensions: AssetDimensionsSchema.describe('Full sheet dimensions'),

  // Prompt assembly
  prompt: z.string().describe('Base generation prompt'),
  negativePrompt: z.string().optional(),
  docRefs: z.array(DocRefSchema).describe('Bible sections describing this character/enemy'),

  // Output
  filename: z.string().describe('Output filename, e.g., "warrior-walk.png"'),
  format: OutputFormatSchema.default('png'),

  // Generation tracking
  status: GenerationStatusSchema.default('pending'),
  metadata: GenerationMetadataSchema.optional(),
  lastError: z.string().optional(),
});
export type SpritesheetAsset = z.infer<typeof SpritesheetAssetSchema>;

// ============================================================================
// SPRITESHEET MANIFEST
// ============================================================================

export const SpritesheetManifestSchema = z.object({
  $schema: z.string().optional(),
  schemaVersion: z.string().default('1.0.0'),
  description: z.string().default('Character and enemy spritesheet generation manifest'),
  updatedAt: z.string(),

  styleGuide: z.string().describe('Global sprite art style rules'),
  styleDocRefs: z.array(DocRefSchema),

  assets: z.array(SpritesheetAssetSchema),
});
export type SpritesheetManifest = z.infer<typeof SpritesheetManifestSchema>;
