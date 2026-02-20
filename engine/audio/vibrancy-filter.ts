/**
 * Mnemonic Realms — Vibrancy Audio Filter (Pure Functions)
 *
 * Maps vibrancy state to BiquadFilterNode lowpass frequency.
 * Forgotten areas sound muffled (2000 Hz), remembered areas are vivid (20000 Hz).
 *
 * These values are fed to a BiquadFilterNode lowpass filter by the caller.
 * This module contains NO Web Audio API — pure computation only.
 */

import type { VibrancyState } from '../ecs/systems/vibrancy.js';

// ── Constants ────────────────────────────────────────────────────────────────

/** Lowpass frequency for forgotten areas — very muffled, distant. */
export const FREQUENCY_FORGOTTEN = 2000;

/** Lowpass frequency for partial areas — somewhat clear, inviting. */
export const FREQUENCY_PARTIAL = 8000;

/** Lowpass frequency for remembered areas — full clarity, vivid. */
export const FREQUENCY_REMEMBERED = 20000;

// ── Pure Functions ───────────────────────────────────────────────────────────

/**
 * Get the target BiquadFilterNode lowpass frequency for a vibrancy state.
 *
 * - 'forgotten' → 2000 Hz (very muffled, distant)
 * - 'partial'   → 8000 Hz (somewhat clear, inviting)
 * - 'remembered' → 20000 Hz (full clarity, vivid)
 */
export function getFilterFrequency(state: VibrancyState): number {
  switch (state) {
    case 'forgotten':
      return FREQUENCY_FORGOTTEN;
    case 'partial':
      return FREQUENCY_PARTIAL;
    case 'remembered':
      return FREQUENCY_REMEMBERED;
  }
}

/**
 * Smoothly interpolate between current and target frequency.
 * Factor is 0→1 where 0 = no change, 1 = jump to target.
 * Typically called each frame with a small factor (e.g., 0.05) for smooth transitions.
 */
export function lerpFrequency(current: number, target: number, factor: number): number {
  const clampedFactor = Math.min(1, Math.max(0, factor));
  return current + (target - current) * clampedFactor;
}
