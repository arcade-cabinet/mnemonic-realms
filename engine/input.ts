/**
 * Input Handler — Platform-agnostic input mapping.
 *
 * Maps keyboard keys (WASD + arrow keys) to direction intent.
 * Returns tile offsets (-1, 0, 1) consumed by the movement system.
 *
 * This is a module with hooks, not a component.
 * Touch input hooks can be added later for mobile.
 */

import { useCallback, useEffect, useRef } from 'react';

// ── Direction types ─────────────────────────────────────────────────────────

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface DirectionIntent {
  /** Tile offset X: -1 (left), 0 (none), 1 (right) */
  dx: number;
  /** Tile offset Y: -1 (up), 0 (none), 1 (down) */
  dy: number;
}

// ── Key mapping ─────────────────────────────────────────────────────────────

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  a: 'left',
  A: 'left',
  s: 'down',
  S: 'down',
  d: 'right',
  D: 'right',
};

/**
 * Convert a key string to a Direction, or null if not a movement key.
 */
export function keyToDirection(key: string): Direction | null {
  return KEY_TO_DIRECTION[key] ?? null;
}

/**
 * Convert a set of currently pressed directions to a movement intent.
 *
 * Priority: last pressed direction wins when opposing keys are held.
 * For simplicity, we resolve conflicts by checking each axis independently.
 */
export function directionsToIntent(pressed: ReadonlySet<Direction>): DirectionIntent {
  let dx = 0;
  let dy = 0;

  if (pressed.has('left')) dx -= 1;
  if (pressed.has('right')) dx += 1;
  if (pressed.has('up')) dy -= 1;
  if (pressed.has('down')) dy += 1;

  // Opposing directions cancel out (dx/dy will be 0)
  // Diagonal movement: clamp to single axis (prefer vertical)
  if (dx !== 0 && dy !== 0) {
    // For grid-based movement, allow only one axis at a time.
    // Prefer the most recently pressed, but since we don't track order,
    // prefer vertical (common JRPG convention).
    dx = 0;
  }

  return { dx, dy };
}

// ── React hook for keyboard input ───────────────────────────────────────────

/**
 * Hook that tracks keyboard state and returns current movement intent.
 *
 * Usage:
 * ```ts
 * const getIntent = useKeyboardInput();
 * // In game loop:
 * const { dx, dy } = getIntent();
 * ```
 */
export function useKeyboardInput(): () => DirectionIntent {
  const pressedRef = useRef<Set<Direction>>(new Set());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const dir = keyToDirection(e.key);
    if (dir) {
      e.preventDefault();
      pressedRef.current.add(dir);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const dir = keyToDirection(e.key);
    if (dir) {
      pressedRef.current.delete(dir);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const getIntent = useCallback((): DirectionIntent => {
    return directionsToIntent(pressedRef.current);
  }, []);

  return getIntent;
}
