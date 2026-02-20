import { describe, it, expect } from 'vitest';
import {
  gameTheme,
  colors,
  radii,
  shadows,
  spacing,
  typography,
} from '../../../ui/theme/game-theme';
import type { GameTheme } from '../../../ui/theme/game-theme';

// ---------------------------------------------------------------------------
// Theme token structure
// ---------------------------------------------------------------------------

describe('gameTheme', () => {
  it('exports a complete theme object', () => {
    expect(gameTheme).toBeDefined();
    expect(gameTheme.colors).toBe(colors);
    expect(gameTheme.radii).toBe(radii);
    expect(gameTheme.shadows).toBe(shadows);
    expect(gameTheme.spacing).toBe(spacing);
    expect(gameTheme.typography).toBe(typography);
  });

  it('satisfies the GameTheme type', () => {
    const theme: GameTheme = gameTheme;
    expect(theme).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------

describe('colors', () => {
  it('has a 10-step primary amber palette', () => {
    const steps = Object.keys(colors.primary);
    expect(steps).toHaveLength(10);
    expect(colors.primary[500]).toBe('#FFC107');
    expect(colors.primary[900]).toBe('#FF6F00');
  });

  it('has background tokens', () => {
    expect(colors.background.deep).toBe('#0F172A');
    expect(colors.background.dark).toBe('#1E293B');
    expect(colors.background.surface).toBe('#1A1A2E');
    expect(typeof colors.background.overlay).toBe('string');
  });

  it('has text tokens with warm whites', () => {
    expect(colors.text.primary).toBe('#FFF8E1');
    expect(colors.text.secondary).toBe('#FFE0B2');
    expect(colors.text.muted).toBe('#A1887F');
    expect(colors.text.inverse).toBe('#1E293B');
  });

  describe('vibrancy states', () => {
    it('defines forgotten state (dark/opaque)', () => {
      expect(colors.vibrancy.forgotten.fog).toContain('rgba');
      expect(colors.vibrancy.forgotten.tint).toBe('#0A0A14');
    });

    it('defines partial state (colored haze)', () => {
      expect(colors.vibrancy.partial.fog).toContain('rgba');
      expect(colors.vibrancy.partial.tint).toBe('#6A3D7D');
    });

    it('defines remembered state (vivid/clear)', () => {
      expect(colors.vibrancy.remembered.glow).toContain('rgba');
      expect(colors.vibrancy.remembered.tint).toBe('#FFC107');
    });
  });

  it('has UI accent colors for game stats', () => {
    expect(colors.accent.health).toBe('#EF5350');
    expect(colors.accent.mana).toBe('#42A5F5');
    expect(colors.accent.stamina).toBe('#66BB6A');
    expect(colors.accent.xp).toBe('#AB47BC');
    expect(colors.accent.gold).toBe('#FFD54F');
  });
});

// ---------------------------------------------------------------------------
// Radii, shadows, spacing, typography
// ---------------------------------------------------------------------------

describe('radii', () => {
  it('has a scale from none to full', () => {
    expect(radii.none).toBe(0);
    expect(radii.md).toBe(8);
    expect(radii.full).toBe(9999);
  });
});

describe('shadows', () => {
  it('has sm/md/lg with amber shadowColor', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const s = shadows[size];
      expect(s.shadowColor).toBe('#FFA000');
      expect(s.shadowOffset).toBeDefined();
      expect(typeof s.shadowOpacity).toBe('number');
      expect(typeof s.shadowRadius).toBe('number');
      expect(typeof s.elevation).toBe('number');
    }
    expect(shadows.sm.shadowRadius).toBeLessThan(shadows.md.shadowRadius);
    expect(shadows.md.shadowRadius).toBeLessThan(shadows.lg.shadowRadius);
  });
});

describe('spacing', () => {
  it('uses a 4px base scale', () => {
    expect(spacing[0]).toBe(0);
    expect(spacing[1]).toBe(4);
    expect(spacing[2]).toBe(8);
    expect(spacing[4]).toBe(16);
  });
});

describe('typography', () => {
  it('defines font families', () => {
    expect(typography.fonts.body).toBe('System');
    expect(typography.fonts.heading).toBe('System');
    expect(typography.fonts.mono).toBe('monospace');
  });

  it('defines a font size scale', () => {
    expect(typography.fontSizes.xs).toBeLessThan(typography.fontSizes.sm);
    expect(typography.fontSizes.sm).toBeLessThan(typography.fontSizes.md);
    expect(typography.fontSizes.md).toBeLessThan(typography.fontSizes.lg);
  });
});

