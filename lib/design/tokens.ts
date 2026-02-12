/**
 * Design Tokens for Mnemonic Realms
 * 
 * 16-bit aesthetic inspired by:
 * - Final Fantasy 7 (dark fantasy, mysterious)
 * - Diablo 1 (gothic, dungeon crawler)
 * - Chrono Trigger (vibrant colors, adventure)
 */

export const designTokens = {
  // Brand Colors
  colors: {
    // Primary - Deep mystical purple
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6', // Main brand color
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    // Secondary - Ancient gold
    secondary: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
    },
    // Alignment Colors
    alignment: {
      light: '#fbbf24', // Gold/yellow
      dark: '#7c3aed',  // Deep purple
      neutral: '#6b7280', // Gray
    },
    // Terrain Colors (8 biomes)
    terrain: {
      plains: '#84cc16',    // Green
      forest: '#22c55e',    // Dark green
      mountain: '#78716c',  // Gray-brown
      desert: '#f59e0b',    // Orange
      swamp: '#065f46',     // Dark teal
      tundra: '#bfdbfe',    // Light blue
      volcano: '#dc2626',   // Red
      ocean: '#3b82f6',     // Blue
    },
    // UI States
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    // Background gradient
    background: {
      from: '#1e1b4b', // Dark indigo
      to: '#312e81',   // Indigo
    },
  },

  // Typography
  typography: {
    fonts: {
      display: '"Press Start 2P", monospace', // 16-bit pixel font
      body: '"Inter", sans-serif',
      mono: '"Fira Code", monospace',
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing (8px grid)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Border Radius
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 20px rgb(139 92 246 / 0.5)', // Purple glow
  },

  // Z-Index Layers
  zIndex: {
    background: 0,
    base: 1,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Game-specific
  game: {
    // HUD dimensions
    hud: {
      hamburgerMenuWidth: '280px',
      healthBarHeight: '24px',
      minimapSize: '200px',
      inventorySlotSize: '48px',
    },
    // Rarity colors
    rarity: {
      common: '#9ca3af',
      uncommon: '#10b981',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b',
    },
    // Class colors
    classColors: {
      warrior: '#ef4444',
      mage: '#3b82f6',
      rogue: '#10b981',
      cleric: '#fbbf24',
      ranger: '#059669',
      paladin: '#f59e0b',
      necromancer: '#7c3aed',
      bard: '#ec4899',
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
