/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './ui/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        /* Primary amber/gold — warmth of memory */
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
          DEFAULT: '#FFC107',
        },

        /* Cool slate backgrounds */
        surface: {
          deep: '#0F172A',
          dark: '#1E293B',
          DEFAULT: '#334155',
          light: '#475569',
          canvas: '#1A1A2E',
        },

        /* Warm text colors */
        warm: {
          white: '#FFF8E1',
          cream: '#FFE0B2',
          muted: '#A1887F',
        },

        /* Vibrancy states */
        forgotten: '#0A0A14',
        haze: '#6A3D7D',
        vivid: '#FFC107',

        /* UI accents */
        health: '#EF5350',
        mana: '#42A5F5',
        stamina: '#66BB6A',
        xp: '#AB47BC',
        gold: '#FFD54F',
      },
      borderRadius: {
        game: '8px',
        'game-lg': '12px',
        'game-xl': '16px',
      },
      boxShadow: {
        'amber-sm': '0 1px 2px rgba(255, 160, 0, 0.15)',
        'amber-md': '0 2px 4px rgba(255, 160, 0, 0.2)',
        'amber-lg': '0 4px 8px rgba(255, 160, 0, 0.25)',
      },
    },
  },
  plugins: [],
};

