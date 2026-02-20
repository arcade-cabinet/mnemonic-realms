/**
 * Mnemonic Realms — HP Bar Pure Utilities
 *
 * Pure calculation helpers for HP bar rendering.
 * No React/Reanimated imports — safe for unit testing.
 */

/** Low-HP threshold — flash when below this ratio. */
export const LOW_HP_THRESHOLD = 0.25;

/** Compute HP as a 0–100 percentage, clamped. */
export function computeHpPercent(current: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, (current / max) * 100));
}

/** Check if HP is critically low (below LOW_HP_THRESHOLD). */
export function isLowHp(current: number, max: number): boolean {
  if (max <= 0) return false;
  return current / max < LOW_HP_THRESHOLD;
}
