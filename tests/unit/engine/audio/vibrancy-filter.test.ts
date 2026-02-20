import { describe, expect, it } from 'vitest';
import {
  FREQUENCY_FORGOTTEN,
  FREQUENCY_PARTIAL,
  FREQUENCY_REMEMBERED,
  getFilterFrequency,
  lerpFrequency,
} from '../../../../engine/audio/vibrancy-filter';

// ── getFilterFrequency ───────────────────────────────────────────────────────

describe('getFilterFrequency', () => {
  it('returns 2000 Hz for forgotten state (very muffled)', () => {
    expect(getFilterFrequency('forgotten')).toBe(2000);
    expect(getFilterFrequency('forgotten')).toBe(FREQUENCY_FORGOTTEN);
  });

  it('returns 8000 Hz for partial state (somewhat clear)', () => {
    expect(getFilterFrequency('partial')).toBe(8000);
    expect(getFilterFrequency('partial')).toBe(FREQUENCY_PARTIAL);
  });

  it('returns 20000 Hz for remembered state (full clarity)', () => {
    expect(getFilterFrequency('remembered')).toBe(20000);
    expect(getFilterFrequency('remembered')).toBe(FREQUENCY_REMEMBERED);
  });

  it('frequency increases with vibrancy: forgotten < partial < remembered', () => {
    const forgotten = getFilterFrequency('forgotten');
    const partial = getFilterFrequency('partial');
    const remembered = getFilterFrequency('remembered');
    expect(forgotten).toBeLessThan(partial);
    expect(partial).toBeLessThan(remembered);
  });
});

// ── lerpFrequency ────────────────────────────────────────────────────────────

describe('lerpFrequency', () => {
  it('returns current when factor is 0', () => {
    expect(lerpFrequency(2000, 20000, 0)).toBe(2000);
  });

  it('returns target when factor is 1', () => {
    expect(lerpFrequency(2000, 20000, 1)).toBe(20000);
  });

  it('returns midpoint when factor is 0.5', () => {
    expect(lerpFrequency(2000, 20000, 0.5)).toBe(11000);
  });

  it('interpolates correctly for small factor', () => {
    // 2000 + (8000 - 2000) * 0.1 = 2000 + 600 = 2600
    expect(lerpFrequency(2000, 8000, 0.1)).toBeCloseTo(2600);
  });

  it('clamps factor below 0 to 0', () => {
    expect(lerpFrequency(2000, 20000, -0.5)).toBe(2000);
  });

  it('clamps factor above 1 to 1', () => {
    expect(lerpFrequency(2000, 20000, 1.5)).toBe(20000);
  });

  it('works when current equals target', () => {
    expect(lerpFrequency(8000, 8000, 0.5)).toBe(8000);
  });

  it('works when interpolating downward', () => {
    // 20000 + (2000 - 20000) * 0.5 = 20000 - 9000 = 11000
    expect(lerpFrequency(20000, 2000, 0.5)).toBe(11000);
  });
});

