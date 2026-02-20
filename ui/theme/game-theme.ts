/**
 * Mnemonic Realms — Game Theme Tokens
 *
 * Warm amber palette for a 16-bit JRPG about memory as creative vitality.
 * Vibrancy states: forgotten (dark), partial (haze), remembered (vivid/clear).
 */

/** Primary amber/gold palette — the warmth of memory */
export const colors = {
  /** Core amber/gold tones */
  primary: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC107',
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },

  /** Cool slate backgrounds — parchment and stone */
  background: {
    deep: '#0F172A',
    dark: '#1E293B',
    DEFAULT: '#334155',
    light: '#475569',
    surface: '#1A1A2E',
    overlay: 'rgba(15, 23, 42, 0.85)',
  },

  /** Warm whites for text — candlelight legibility */
  text: {
    primary: '#FFF8E1',
    secondary: '#FFE0B2',
    muted: '#A1887F',
    inverse: '#1E293B',
  },

  /** Vibrancy state colors — spatial fog-of-war */
  vibrancy: {
    /** Forgotten: opaque darkness, player warned + damage */
    forgotten: {
      fog: 'rgba(10, 10, 20, 0.95)',
      edge: 'rgba(30, 20, 40, 0.7)',
      tint: '#0A0A14',
    },
    /** Partial: colored haze, invitation to explore */
    partial: {
      fog: 'rgba(100, 60, 120, 0.45)',
      edge: 'rgba(140, 90, 160, 0.3)',
      tint: '#6A3D7D',
    },
    /** Remembered: crystal clear, full gorgeous art */
    remembered: {
      glow: 'rgba(255, 193, 7, 0.15)',
      edge: 'rgba(255, 215, 64, 0.1)',
      tint: '#FFC107',
    },
  },

  /** UI accent colors */
  accent: {
    health: '#EF5350',
    mana: '#42A5F5',
    stamina: '#66BB6A',
    xp: '#AB47BC',
    gold: '#FFD54F',
    danger: '#FF5252',
    success: '#69F0AE',
    warning: '#FFD740',
    info: '#40C4FF',
  },
} as const;

/** Border radii — rounded parchment edges */
export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

/** Shadows — warm amber glow for elevated surfaces */
export const shadows = {
  sm: {
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

/** Spacing scale (4px base) */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/** Typography scale */
export const typography = {
  fonts: {
    body: 'System',
    heading: 'System',
    mono: 'monospace',
  },
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
} as const;

/** Complete game theme — single import for all tokens */
export const gameTheme = {
  colors,
  radii,
  shadows,
  spacing,
  typography,
} as const;

export type GameTheme = typeof gameTheme;
