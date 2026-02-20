import { describe, expect, it } from 'vitest';
import {
  DISSOLVE_OUT_MS,
  DRIFT_IN_MS,
  HOLD_MS,
  TOTAL_PLACARD_MS,
} from '../../../../ui/hud/placard-timing';

// ---------------------------------------------------------------------------
// Zone placard timing constants
// ---------------------------------------------------------------------------

describe('zone placard timing', () => {
  it('has a 400ms drift-in duration', () => {
    expect(DRIFT_IN_MS).toBe(400);
  });

  it('has a 3000ms hold duration', () => {
    expect(HOLD_MS).toBe(3000);
  });

  it('has a 500ms dissolve-out duration', () => {
    expect(DISSOLVE_OUT_MS).toBe(500);
  });

  it('total lifecycle equals sum of drift-in + hold + dissolve-out', () => {
    expect(TOTAL_PLACARD_MS).toBe(DRIFT_IN_MS + HOLD_MS + DISSOLVE_OUT_MS);
  });

  it('total lifecycle is 3900ms', () => {
    expect(TOTAL_PLACARD_MS).toBe(3900);
  });

  it('drift-in is shorter than hold', () => {
    expect(DRIFT_IN_MS).toBeLessThan(HOLD_MS);
  });

  it('dissolve-out is shorter than hold', () => {
    expect(DISSOLVE_OUT_MS).toBeLessThan(HOLD_MS);
  });

  it('all durations are positive', () => {
    expect(DRIFT_IN_MS).toBeGreaterThan(0);
    expect(HOLD_MS).toBeGreaterThan(0);
    expect(DISSOLVE_OUT_MS).toBeGreaterThan(0);
  });
});

