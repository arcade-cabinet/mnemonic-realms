import { beforeAll, describe, expect, it } from 'vitest';
import {
  vibrancyStateVisual,
  type VibrancyState,
  type VibrancyVisual,
} from '../../../../ui/hud/vibrancy-utils';

// ---------------------------------------------------------------------------
// vibrancyStateVisual — state-to-visual mapping
// ---------------------------------------------------------------------------

describe('vibrancyStateVisual', () => {
  describe('forgotten state', () => {
    let visual: VibrancyVisual;
    beforeAll(() => {
      visual = vibrancyStateVisual('forgotten');
    });

    it('returns a dark color', () => {
      expect(visual.color).toBe('#0A0A14');
    });

    it('has low opacity', () => {
      expect(visual.opacity).toBeLessThanOrEqual(0.5);
      expect(visual.opacity).toBeGreaterThan(0);
    });

    it('does not pulse', () => {
      expect(visual.pulses).toBe(false);
    });

    it('has "Forgotten" label', () => {
      expect(visual.label).toBe('Forgotten');
    });
  });

  describe('partial state', () => {
    let visual: VibrancyVisual;
    beforeAll(() => {
      visual = vibrancyStateVisual('partial');
    });

    it('returns a purple/haze color', () => {
      expect(visual.color).toBe('#6A3D7D');
    });

    it('has medium opacity', () => {
      expect(visual.opacity).toBeGreaterThan(0.5);
      expect(visual.opacity).toBeLessThan(1.0);
    });

    it('pulses (glow effect)', () => {
      expect(visual.pulses).toBe(true);
    });

    it('has "Partial Memory" label', () => {
      expect(visual.label).toBe('Partial Memory');
    });
  });

  describe('remembered state', () => {
    let visual: VibrancyVisual;
    beforeAll(() => {
      visual = vibrancyStateVisual('remembered');
    });

    it('returns a bright amber/gold color', () => {
      expect(visual.color).toBe('#FFC107');
    });

    it('has full opacity', () => {
      expect(visual.opacity).toBe(1.0);
    });

    it('does not pulse (steady bright)', () => {
      expect(visual.pulses).toBe(false);
    });

    it('has "Remembered" label', () => {
      expect(visual.label).toBe('Remembered');
    });
  });

  // ---------------------------------------------------------------------------
  // Cross-state invariants
  // ---------------------------------------------------------------------------

  describe('cross-state invariants', () => {
    const states: VibrancyState[] = ['forgotten', 'partial', 'remembered'];

    it('all states return a non-empty color string', () => {
      for (const state of states) {
        const visual = vibrancyStateVisual(state);
        expect(visual.color).toBeTruthy();
        expect(typeof visual.color).toBe('string');
      }
    });

    it('opacity increases from forgotten to partial to remembered', () => {
      const forgotten = vibrancyStateVisual('forgotten');
      const partial = vibrancyStateVisual('partial');
      const remembered = vibrancyStateVisual('remembered');

      expect(forgotten.opacity).toBeLessThan(partial.opacity);
      expect(partial.opacity).toBeLessThan(remembered.opacity);
    });

    it('all states return a non-empty label', () => {
      for (const state of states) {
        const visual = vibrancyStateVisual(state);
        expect(visual.label.length).toBeGreaterThan(0);
      }
    });

    it('only partial state pulses', () => {
      expect(vibrancyStateVisual('forgotten').pulses).toBe(false);
      expect(vibrancyStateVisual('partial').pulses).toBe(true);
      expect(vibrancyStateVisual('remembered').pulses).toBe(false);
    });
  });
});

