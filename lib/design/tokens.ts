/**
 * Design Tokens for Mnemonic Realms
 * 
 * Sword & Sorcery / High Fantasy aesthetic inspired by:
 * - Conan the Barbarian (raw, gritty, ancient)
 * - Dungeons & Dragons (classic fantasy, medieval)
 * - Lord of the Rings (epic fantasy, mystical)
 * - Baldur's Gate (isometric RPG, dark fantasy)
 */

export const designTokens = {
  // Brand Colors
  colors: {
    // Primary - Deep burgundy/blood red for sword & sorcery
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#8b1f1f', // Deep blood red
      600: '#7c1a1a',
      700: '#6d1717',
      800: '#5e1414',
      900: '#4f1212',
    },
    // Secondary - Aged bronze/copper for ancient metalwork
    secondary: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#b8860b', // Dark goldenrod/bronze
      600: '#a67508',
      700: '#946407',
      800: '#825407',
      900: '#704506',
    },
    // Tertiary - Deep forest green for nature/wilderness
    tertiary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#1f4d2a', // Deep forest green
      600: '#1a4023',
      700: '#16331c',
      800: '#122716',
      900: '#0e1a11',
    },
    // Alignment Colors
    alignment: {
      light: '#d4af37', // Bright gold - heroic, divine
      dark: '#4a0e0e',  // Dark blood - sinister, evil
      neutral: '#6b5d4f', // Earth brown - balanced
    },
    // Terrain Colors (8 biomes) - more earthy/realistic
    terrain: {
      plains: '#8b9f6a',    // Muted green
      forest: '#2d5016',    // Dark forest green
      mountain: '#5a524c',  // Stone gray
      desert: '#d4a574',    // Sand beige
      swamp: '#4a5640',     // Murky green-brown
      tundra: '#d9e4f5',    // Ice blue-white
      volcano: '#8b2500',   // Dark volcanic red
      ocean: '#1e3a5f',     // Deep ocean blue
    },
    // UI States
    success: '#2d5016',  // Forest green
    warning: '#d4a574',  // Bronze/sand
    error: '#8b1f1f',    // Blood red
    info: '#4a5260',     // Slate blue
    // Background gradient - leather and stone tones
    background: {
      from: '#1a1410', // Deep leather brown
      to: '#2d2520',   // Lighter leather
      parchment: '#f5f1e8', // Aged parchment
      stone: '#4a4540',     // Stone gray
    },
  },

  // Typography - Medieval/Fantasy fonts
  typography: {
    fonts: {
      display: '"Cinzel Decorative", "Crimson Text", serif', // Ornate medieval
      heading: '"Cinzel", "Crimson Text", serif',            // Clean medieval
      body: '"Merriweather", "Georgia", serif',              // Readable serif
      mono: '"Courier New", monospace',                      // Stats/code
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
      black: 900,
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

  // Border Radius - more squared/angular for medieval feel
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.625rem',   // 10px - less rounded than modern
    '2xl': '0.75rem', // 12px
    full: '9999px',
  },

  // Shadows - deeper, heavier shadows for dramatic effect
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    base: '0 2px 4px 0 rgb(0 0 0 / 0.4)',
    md: '0 4px 8px -1px rgb(0 0 0 / 0.5)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.6)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.7)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.8)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.4)',
    glow: '0 0 20px rgb(139 31 31 / 0.6)', // Red glow for magic
    bronze: '0 0 15px rgb(184 134 11 / 0.5)', // Bronze glow
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

  // Transitions - slightly slower for epic feel
  transitions: {
    fast: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '600ms cubic-bezier(0.4, 0, 0.2, 1)',
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
    // Rarity colors - more medieval/fantasy themed
    rarity: {
      common: '#6b5d4f',     // Earth brown
      uncommon: '#4a7052',   // Forest green
      rare: '#2b4a7c',       // Royal blue
      epic: '#6b2d8e',       // Royal purple
      legendary: '#d4af37',  // Bright gold
    },
    // Class colors - sword & sorcery themed
    classColors: {
      warrior: '#8b1f1f',    // Blood red
      mage: '#2b4a7c',       // Mystic blue
      rogue: '#2d2520',      // Shadow brown
      cleric: '#d4af37',     // Holy gold
      ranger: '#2d5016',     // Forest green
      paladin: '#c0c0c0',    // Silver/steel
      necromancer: '#4a0e0e', // Dark blood
      bard: '#b8860b',       // Bronze
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
