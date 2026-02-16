/**
 * Vibrancy Tier Style Descriptions
 *
 * Per-tier prompts that modify the base style for each vibrancy level.
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
