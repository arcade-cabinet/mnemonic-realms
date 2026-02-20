/**
 * Pure direction-to-intent helpers for touch controls.
 *
 * Extracted into its own module so unit tests can import
 * without pulling in react-native (which Vitest cannot parse).
 */

import type { DirectionIntent } from '../engine/input.js';

// ── Types ──────────────────────────────────────────────────────────────────

export type DPadDir = 'up' | 'down' | 'left' | 'right';

// ── Constants ──────────────────────────────────────────────────────────────

export const DIR_INTENT: Record<DPadDir, DirectionIntent> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

export const ZERO_INTENT: DirectionIntent = { dx: 0, dy: 0 };

// ── Helpers ────────────────────────────────────────────────────────────────

/** Map a d-pad direction to a DirectionIntent. */
export function dpadToIntent(dir: DPadDir): DirectionIntent {
  return DIR_INTENT[dir];
}
