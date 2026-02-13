/**
 * Tileset Generation Schemas
 *
 * Defines the biome × vibrancy tier matrix for tileset generation.
 * Each biome has 3 tileset variants (Muted, Normal, Vivid) with specific
 * tile type descriptions drawn from docs/world/vibrancy-system.md.
 *
 * RPG-JS uses 32x32 pixel tiles. Tilesets are PNG sheets arranged in grids.
 * The game loads the appropriate tier variant based on current zone vibrancy.
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
// BIOME & TIER ENUMS
// ============================================================================

/**
 * The 10 distinct biome types from vibrancy-system.md.
 * Each biome has its own tile swap table with Muted/Normal/Vivid descriptions.
 */
export const BiomeTypeSchema = z.enum([
  'village',          // Village Hub
  'grassland',        // Heartfield, Sunridge
  'forest',           // Ambergrove, Flickerveil, Half-Drawn Forest
  'riverside',        // Millbrook
  'mountain',         // Hollow Ridge, Undrawn Peaks
  'wetland',          // Shimmer Marsh
  'plains',           // Resonance Fields
  'sketch',           // Luminous Wastes, Undrawn Peaks, Half-Drawn Forest (low vibrancy)
  'dungeon',          // All Depths levels
  'stagnation',       // Preserver Fortress, overlay zones
]);
export type BiomeType = z.infer<typeof BiomeTypeSchema>;

/**
 * Vibrancy tiers that determine which tileset variant is displayed.
 * Thresholds: Muted 0-33, Normal 34-66, Vivid 67-100.
 */
export const VibrancyTierSchema = z.enum(['muted', 'normal', 'vivid']);
export type VibrancyTier = z.infer<typeof VibrancyTierSchema>;

// ============================================================================
// TILE TYPE DEFINITION
// ============================================================================

/**
 * A single tile type within a tileset (e.g., "Ground (cobblestone)", "Trees").
 * Contains the visual description for the target vibrancy tier — this becomes
 * part of the generation prompt.
 */
export const TileTypeSchema = z.object({
  id: z.string().describe('Tile type identifier, e.g., "ground-cobblestone", "trees-deciduous"'),
  name: z.string().describe('Human-readable name, e.g., "Ground (cobblestone)"'),
  description: z.string().describe('Visual description for this tile at the target vibrancy tier'),
  gridPosition: z.object({
    col: z.number().int().min(0).describe('Column in the tileset grid (0-indexed)'),
    row: z.number().int().min(0).describe('Row in the tileset grid (0-indexed)'),
    spanCols: z.number().int().min(1).default(1).describe('Number of columns this tile spans'),
    spanRows: z.number().int().min(1).default(1).describe('Number of rows this tile spans'),
  }).describe('Position in the output tileset sheet'),
  variants: z.number().int().min(1).default(1).describe('Number of visual variants for this tile type'),
  animated: z.boolean().default(false).describe('Whether this tile has animation frames'),
  animFrames: z.number().int().min(1).default(1).describe('Number of animation frames if animated'),
});
export type TileType = z.infer<typeof TileTypeSchema>;

// ============================================================================
// TILESET ASSET DEFINITION
// ============================================================================

/**
 * A single tileset asset = one biome at one vibrancy tier.
 * 10 biomes × 3 tiers = 30 tileset assets.
 *
 * Each tileset is a PNG sheet of 32x32 tiles arranged in a grid.
 * The generation script:
 * 1. Resolves DocRefs to load the tile swap table from vibrancy-system.md
 * 2. Resolves style DocRefs from visual-direction.md
 * 3. Assembles a prompt with all tile descriptions for the tier
 * 4. Generates a high-res image via Gemini
 * 5. Post-processes: downscale to exact pixel grid, palette quantize
 */
export const TilesetAssetSchema = z.object({
  id: z.string().describe('Unique ID, e.g., "tileset-village-muted"'),
  biome: BiomeTypeSchema,
  tier: VibrancyTierSchema,
  zones: z.array(z.string()).describe('Zone names that use this tileset, e.g., ["Village Hub"]'),

  // Tile layout
  tiles: z.array(TileTypeSchema).describe('All tile types in this sheet with grid positions'),
  gridCols: z.number().int().positive().describe('Number of columns in the tileset grid'),
  gridRows: z.number().int().positive().describe('Number of rows in the tileset grid'),

  // Dimensions
  tileSize: z.number().int().positive().default(32).describe('Individual tile size in pixels'),
  dimensions: AssetDimensionsSchema.describe('Full sheet dimensions (target and generation)'),

  // Prompt assembly
  prompt: z.string().describe('Base generation prompt (tile descriptions assembled from DocRefs)'),
  negativePrompt: z.string().optional().describe('Elements to exclude (e.g., "3D, photorealistic, neon")'),
  docRefs: z.array(DocRefSchema).describe('Markdown sections to load as additional context'),

  // Output
  filename: z.string().describe('Output filename relative to manifest dir, e.g., "village-muted.png"'),
  format: OutputFormatSchema.default('png'),

  // Generation tracking
  status: GenerationStatusSchema.default('pending'),
  metadata: GenerationMetadataSchema.optional(),
  lastError: z.string().optional(),
});
export type TilesetAsset = z.infer<typeof TilesetAssetSchema>;

// ============================================================================
// TILESET MANIFEST
// ============================================================================

/**
 * Top-level tileset manifest containing all biome × tier combinations.
 * Lives at gen/manifests/tilesets/manifest.json
 */
export const TilesetManifestSchema = z.object({
  $schema: z.string().optional(),
  schemaVersion: z.string().default('1.0.0'),
  description: z.string().default('Tileset generation manifest — 10 biomes × 3 vibrancy tiers'),
  updatedAt: z.string(),

  // Global tileset style context
  styleGuide: z.string().describe('Global art style rules applied to all tileset generation'),
  styleDocRefs: z.array(DocRefSchema).describe('Doc sections providing style context'),

  assets: z.array(TilesetAssetSchema),
});
export type TilesetManifest = z.infer<typeof TilesetManifestSchema>;
