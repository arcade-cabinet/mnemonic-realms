/**
 * Named Color Palette
 *
 * Hex references from visual-direction.md used in prompts and post-processing.
 */

export const PALETTE = {
  // Thematic colors
  memoryEnergy: '#DAA520', // Warm amber/gold — particles, UI accents, fragments
  stagnation: '#B0C4DE', // Cold crystal blue-white — Preserver zones
  stagnationFade: '#E8E8E8', // Stagnation edge color

  // Emotion colors
  joy: '#FFD700', // Sunlight yellow — healing, warmth
  sorrow: '#7B68EE', // Twilight purple — cleansing, reflection
  awe: '#66CDAA', // Aurora green — shields, sacred spaces
  fury: '#CD5C5C', // Forge red — attack buffs, volcanic
  calm: '#87CEEB', // Sky blue — neutral, water

  // UI colors
  uiBackground: '#2A1810', // Dark parchment — combat UI, menus
  uiText: '#D4C4A0', // Warm text on dark backgrounds
  uiAccent: '#DAA520', // Amber accent — speaker names, highlights
} as const;
