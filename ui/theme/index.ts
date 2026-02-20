/**
 * Mnemonic Realms — Theme Provider & Hook
 *
 * React Context-based theme provider wrapping Gluestack UI.
 * All UI overlay components consume tokens via useGameTheme().
 */

export type { GameTheme } from './game-theme.js';
export { colors, gameTheme, radii, shadows, spacing, typography } from './game-theme.js';
export { GameThemeProvider, useGameTheme } from './provider.js';
