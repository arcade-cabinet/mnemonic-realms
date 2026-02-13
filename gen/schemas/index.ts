/**
 * GenAI Pipeline Schemas — Barrel Export
 *
 * All Zod schemas for the Mnemonic Realms asset generation pipeline.
 * Each asset type includes DocRef fields linking to specific markdown headings
 * in the game bible, enabling the generation script to auto-load context.
 */

// Common types used across all manifests
export {
  AssetCategorySchema,
  AssetDimensionsSchema,
  DocRefPurposeSchema,
  DocRefSchema,
  GenerationMetadataSchema,
  GenerationStatusSchema,
  OutputFormatSchema,
  hashPrompt,
  needsRegeneration,
} from './common';
export type {
  AssetCategory,
  AssetDimensions,
  DocRef,
  DocRefPurpose,
  GenerationMetadata,
  GenerationStatus,
  OutputFormat,
} from './common';

// Tileset schemas (biome × vibrancy tier matrix)
export {
  BiomeTypeSchema,
  TilesetAssetSchema,
  TilesetManifestSchema,
  TileTypeSchema,
  VibrancyTierSchema,
} from './tileset';
export type {
  BiomeType,
  TilesetAsset,
  TilesetManifest,
  TileType,
  VibrancyTier,
} from './tileset';

// Spritesheet schemas (characters, enemies, NPCs)
export {
  AnimationSetSchema,
  SpriteCategorySchema,
  SpritesheetAssetSchema,
  SpritesheetManifestSchema,
  SpriteSizeSchema,
} from './spritesheet';
export type {
  AnimationSet,
  SpriteCategory,
  SpriteSize,
  SpritesheetAsset,
  SpritesheetManifest,
} from './spritesheet';

// Portrait schemas (dialogue, menus, story scenes)
export {
  ExpressionSchema,
  PortraitAssetSchema,
  PortraitManifestSchema,
  PortraitTypeSchema,
} from './portrait';
export type {
  Expression,
  PortraitAsset,
  PortraitManifest,
  PortraitType,
} from './portrait';

// Item icon schemas (weapons, armor, consumables, fragments)
export {
  ItemCategorySchema,
  ItemIconAssetSchema,
  ItemIconManifestSchema,
} from './item-icon';
export type {
  ItemCategory,
  ItemIconAsset,
  ItemIconManifest,
} from './item-icon';

// UI element schemas (dialogue frames, battle UI, menus)
export {
  UIElementAssetSchema,
  UIElementManifestSchema,
  UIElementTypeSchema,
} from './ui-element';
export type {
  UIElementAsset,
  UIElementManifest,
  UIElementType,
} from './ui-element';
