/**
 * Mnemonic Realms — Theme Provider
 *
 * Wraps Gluestack UI provider with game-specific theme context.
 * Components access tokens via useGameTheme() hook.
 */

import type React from 'react';
import { createContext, useContext } from 'react';
import { type GameTheme, gameTheme } from './game-theme.js';

const ThemeContext = createContext<GameTheme>(gameTheme);

/**
 * Access game theme tokens from any component.
 *
 * @example
 * const { colors, radii } = useGameTheme();
 * <View style={{ backgroundColor: colors.background.deep }} />
 */
export function useGameTheme(): GameTheme {
  return useContext(ThemeContext);
}

/**
 * Game theme provider — wraps the app with theme context.
 * Place at the root layout to make tokens available everywhere.
 */
export function GameThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={gameTheme}>{children}</ThemeContext.Provider>;
}
