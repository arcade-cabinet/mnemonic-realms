/**
 * Global Style Context
 *
 * Constants derived from docs/design/visual-direction.md that are injected
 * into every generation prompt for consistency. These encode the art direction
 * so Gemini produces cohesive assets across all categories.
 *
 * Source: docs/design/visual-direction.md
 */

import type { DocRef } from './schemas/index';

// ============================================================================
// ART STYLE
// ============================================================================

/**
 * The master style prompt prepended to every generation request.
 * This ensures all assets share the same visual language.
 */
export const MASTER_STYLE_PROMPT = `16-bit JRPG pixel art style. Clean, readable sprites with limited color palette per tile. \
Warm, inviting aesthetic inspired by SNES-era RPGs (Chrono Trigger, Secret of Mana, Final Fantasy VI). \
2-3 head-tall chibi proportions for characters. 32x32 pixel tile grid. \
Subtle shading with 2-3 tone depth per surface. No outlines on tiles, clean edges on sprites. \
Bright, hopeful color philosophy — the world gets MORE vivid as it progresses, never darker. \
Think: watercolor sketch evolving into illuminated manuscript evolving into stained-glass cathedral light.`;

/**
 * Elements explicitly excluded from all generation.
 */
export const MASTER_NEGATIVE_PROMPT = `3D rendering, photorealistic, anime style, neon colors, grimdark, \
desaturated post-apocalyptic, dark souls brown, chibi with huge heads, \
modern technology, sci-fi elements, cyberpunk, blurry, low quality, \
text, watermark, signature, UI elements in the image, \
thick black outlines on tiles, gradient shading on sprites`;

// ============================================================================
// COLOR PALETTE
// ============================================================================

/**
 * Named colors from visual-direction.md.
 * Used as hex references in prompts and post-processing.
 */
export const PALETTE = {
  // Thematic colors
  memoryEnergy: '#DAA520',      // Warm amber/gold — particles, UI accents, fragments
  stagnation: '#B0C4DE',        // Cold crystal blue-white — Preserver zones
  stagnationFade: '#E8E8E8',    // Stagnation edge color

  // Emotion colors
  joy: '#FFD700',               // Sunlight yellow — healing, warmth
  sorrow: '#7B68EE',            // Twilight purple — cleansing, reflection
  awe: '#66CDAA',               // Aurora green — shields, sacred spaces
  fury: '#CD5C5C',              // Forge red — attack buffs, volcanic
  calm: '#87CEEB',              // Sky blue — neutral, water

  // UI colors
  uiBackground: '#2A1810',      // Dark parchment — combat UI, menus
  uiText: '#D4C4A0',            // Warm text on dark backgrounds
  uiAccent: '#DAA520',          // Amber accent — speaker names, highlights
} as const;

// ============================================================================
// VIBRANCY TIER STYLE DESCRIPTIONS
// ============================================================================

/**
 * Per-tier style prompts that modify the base style.
 * These describe the overall color philosophy for each vibrancy level.
 */
export const TIER_STYLE = {
  muted: `Muted vibrancy tier (0-33). Soft pastels, gentle saturation. \
Warm cream backgrounds, muted greens and blues. \
Think: watercolor sketch, morning mist, early spring. \
Colors are present but subdued — the world is young and unfinished, not dead. \
Sparse environmental detail, minimal decorative elements.`,

  normal: `Normal vibrancy tier (34-66). Full natural color palette. \
Rich greens, warm golds, deep sky blues. \
Think: golden hour meadow, illuminated manuscript. \
Clear detail in textures, visible patterns, natural world at its most comfortable. \
Moderate environmental detail, some decorative elements.`,

  vivid: `Vivid vibrancy tier (67-100). Saturated, luminous, almost stained-glass quality. \
Pastel auroras in the sky, crystalline accents. \
Blooming crystal groves, iridescent water. \
Think: cathedral light through colored glass, Studio Ghibli backgrounds. \
Abundant environmental detail, rich decoration, particle effects suggested through bright spots.`,
} as const;

// ============================================================================
// SPRITE STYLE NOTES
// ============================================================================

export const SPRITE_STYLE = {
  player: `16-bit JRPG chibi (2-3 head-tall). Distinct silhouette readable at 32x32. \
Each class has a unique color accent visible even at small size. \
RPG Maker format: 3 columns (walk cycle) × 4 rows (down, left, right, up).`,

  npc: `Same chibi proportions as player. More varied body types — \
merchants rounder, elders taller, warriors broader. \
NPCs brightened by memory get subtle glow/particle accents.`,

  enemy: `Overworld enemies: natural creatures with slight memory-corruption (glowing eyes, luminous markings). \
Dungeon enemies: more abstract, formed from dense dissolved memories. \
Preserver agents: crystalline humanoids, beautiful but uncanny.`,

  boss: `Large sprites (64x64 or 96x96). Multi-part, with clear visual hierarchy. \
Dramatic silhouettes. Each boss should feel like a unique encounter.`,
} as const;

// ============================================================================
// DIMENSION PRESETS
// ============================================================================

/**
 * Standard dimensions for each asset type.
 * genWidth/genHeight are what we request from Gemini (4-8x target).
 * width/height are the final pixel-perfect output.
 */
/**
 * Dimension strategy:
 * - Individual tiles are generated at 256×256 then composited into sheets at 32×32
 * - Tileset sheets are per-biome (16 cols × variable rows × 32px) — dimensions in manifest builder
 * - Sprites use RPG Maker exact pixel format (framework reads the grid)
 * - Portraits/icons can be larger for display in dialogue boxes and menus
 *
 * genWidth/genHeight = what Gemini produces (always square for best results)
 * width/height = final pixel-perfect output after downscale + composite
 */
export const DIMENSIONS = {
  /** Single tile: generate at 256×256, downscale to 32×32 for compositing */
  tileIndividual: { width: 32, height: 32, genWidth: 256, genHeight: 256 },
  /** Standard walk sprite: 96×256 (3 cols × 8 rows: 4 walk + idle + attack + cast + hit/death), generate at 384×1024 */
  spriteWalk: { width: 96, height: 256, genWidth: 384, genHeight: 1024 },
  /** Large boss sprite: 192×256, generate at 768×1024 */
  spriteBoss: { width: 192, height: 256, genWidth: 768, genHeight: 1024 },
  /** Character portrait: 256×256 final (readable in dialogue), gen at 512×512 */
  portrait: { width: 256, height: 256, genWidth: 512, genHeight: 512 },
  /** Item icon: 64×64 final (readable in inventory), gen at 256×256 */
  itemIcon: { width: 64, height: 64, genWidth: 256, genHeight: 256 },
  /** Dialogue frame: 800×200, generate at 1600×400 */
  dialogueFrame: { width: 800, height: 200, genWidth: 1600, genHeight: 400 },
  /** Battle background: 800×480, generate at 1600×960 */
  battleFrame: { width: 800, height: 480, genWidth: 1600, genHeight: 960 },
} as const;

// ============================================================================
// DEFAULT DOC REFS
// ============================================================================

/**
 * Standard DocRef sets reused across many manifest entries.
 */
export const DEFAULT_DOC_REFS: Record<string, DocRef[]> = {
  /** Style context from visual-direction.md */
  globalStyle: [
    { path: 'docs/design/visual-direction.md', heading: 'Color Philosophy', purpose: 'style' },
    { path: 'docs/design/visual-direction.md', heading: 'Sprite Style', purpose: 'style' },
  ],
  /** Tile constraints from tileset-spec.md */
  tileRules: [
    { path: 'docs/design/tileset-spec.md', heading: 'Conventions', purpose: 'constraints' },
  ],
  /** Stagnation overlay reference */
  stagnation: [
    { path: 'docs/design/tileset-spec.md', heading: 'Overlay: Stagnation/Crystal', purpose: 'content' },
    { path: 'docs/design/visual-direction.md', heading: 'Color Philosophy', purpose: 'palette' },
  ],
};
