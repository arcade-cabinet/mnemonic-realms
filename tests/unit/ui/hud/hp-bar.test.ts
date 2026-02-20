import { describe, expect, it } from 'vitest';
import {
  LOW_HP_THRESHOLD,
  computeHpPercent,
  isLowHp,
} from '../../../../ui/hud/hp-utils';

// ---------------------------------------------------------------------------
// computeHpPercent
// ---------------------------------------------------------------------------

describe('computeHpPercent', () => {
  it('returns 100 when current equals max', () => {
    expect(computeHpPercent(100, 100)).toBe(100);
  });

  it('returns 50 for half HP', () => {
    expect(computeHpPercent(50, 100)).toBe(50);
  });

  it('returns 0 when current is 0', () => {
    expect(computeHpPercent(0, 100)).toBe(0);
  });

  it('clamps to 0 when current is negative', () => {
    expect(computeHpPercent(-10, 100)).toBe(0);
  });

  it('clamps to 100 when current exceeds max', () => {
    expect(computeHpPercent(150, 100)).toBe(100);
  });

  it('returns 0 when max is 0', () => {
    expect(computeHpPercent(50, 0)).toBe(0);
  });

  it('returns 0 when max is negative', () => {
    expect(computeHpPercent(50, -10)).toBe(0);
  });

  it('handles fractional values', () => {
    const result = computeHpPercent(1, 3);
    expect(result).toBeCloseTo(33.33, 1);
  });
});

// ---------------------------------------------------------------------------
// isLowHp
// ---------------------------------------------------------------------------

describe('isLowHp', () => {
  it('returns true when HP ratio is below threshold', () => {
    // 20/100 = 0.2, below 0.25
    expect(isLowHp(20, 100)).toBe(true);
  });

  it('returns false when HP ratio is above threshold', () => {
    // 50/100 = 0.5, above 0.25
    expect(isLowHp(50, 100)).toBe(false);
  });

  it('returns true at exactly 1 HP below threshold', () => {
    // 24/100 = 0.24, just below 0.25
    expect(isLowHp(24, 100)).toBe(true);
  });

  it('returns false at exactly the threshold', () => {
    // 25/100 = 0.25, NOT below 0.25 (strictly less than)
    expect(isLowHp(25, 100)).toBe(false);
  });

  it('returns true at 0 HP', () => {
    expect(isLowHp(0, 100)).toBe(true);
  });

  it('returns false when max is 0', () => {
    expect(isLowHp(0, 0)).toBe(false);
  });

  it('returns false when max is negative', () => {
    expect(isLowHp(10, -5)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// LOW_HP_THRESHOLD constant
// ---------------------------------------------------------------------------

describe('LOW_HP_THRESHOLD', () => {
  it('is 0.25 (25%)', () => {
    expect(LOW_HP_THRESHOLD).toBe(0.25);
  });
});

