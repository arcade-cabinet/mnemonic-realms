/**
 * Sprite-Specific Style Notes
 *
 * Per-category sprite style prompts for character and enemy generation.
 */

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
