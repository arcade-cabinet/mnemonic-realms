/**
 * Input Handler — Platform-agnostic input mapping.
 *
 * Maps keyboard keys (WASD + arrow keys) to direction intent,
 * and action/cancel keys (Space/Enter/Z, Escape/X/Backspace) to button state.
 * Returns tile offsets (-1, 0, 1) consumed by the movement system.
 *
 * This is a module with hooks, not a component.
 * Touch input is handled by ui/touch-controls.tsx and unified via usePlatformInput().
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ── Direction types ─────────────────────────────────────────────────────────

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface DirectionIntent {
  /** Tile offset X: -1 (left), 0 (none), 1 (right) */
  dx: number;
  /** Tile offset Y: -1 (up), 0 (none), 1 (down) */
  dy: number;
}

/** Unified input state returned by keyboard and platform hooks. */
export interface InputState {
  /** Current movement intent (tile offsets). */
  getIntent: () => DirectionIntent;
  /** Whether an action key is currently held down. */
  isActionPressed: () => boolean;
  /** Whether a cancel key is currently held down. */
  isCancelPressed: () => boolean;
  /** Returns true once per action press, then false until released and pressed again. */
  consumeAction: () => boolean;
  /** Returns true once per cancel press, then false until released and pressed again. */
  consumeCancel: () => boolean;
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

/** Keys that trigger the 'action' button (confirm, interact). */
const ACTION_KEYS: ReadonlySet<string> = new Set([
  ' ', // Space (KeyboardEvent.key for spacebar)
  'Enter',
  'z',
  'Z',
]);

/** Keys that trigger the 'cancel' button (back, menu). */
const CANCEL_KEYS: ReadonlySet<string> = new Set(['Escape', 'x', 'X', 'Backspace']);

/**
 * Convert a key string to a Direction, or null if not a movement key.
 */
export function keyToDirection(key: string): Direction | null {
  return KEY_TO_DIRECTION[key] ?? null;
}

/**
 * Convert a key string to 'action', 'cancel', or null.
 */
export function keyToAction(key: string): 'action' | 'cancel' | null {
  if (ACTION_KEYS.has(key)) return 'action';
  if (CANCEL_KEYS.has(key)) return 'cancel';
  return null;
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
 * Hook that tracks keyboard state and returns movement + action/cancel state.
 *
 * Usage:
 * ```ts
 * const input = useKeyboardInput();
 * // In game loop:
 * const intent = input.getIntent();
 * if (input.consumeAction()) handleInteract();
 * ```
 */
export function useKeyboardInput(): InputState {
  const pressedRef = useRef<Set<Direction>>(new Set());
  const actionDownRef = useRef(false);
  const cancelDownRef = useRef(false);
  const actionConsumedRef = useRef(false);
  const cancelConsumedRef = useRef(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const dir = keyToDirection(e.key);
    if (dir) {
      e.preventDefault();
      pressedRef.current.add(dir);
      return;
    }
    const action = keyToAction(e.key);
    if (action === 'action') {
      e.preventDefault();
      actionDownRef.current = true;
    } else if (action === 'cancel') {
      e.preventDefault();
      cancelDownRef.current = true;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const dir = keyToDirection(e.key);
    if (dir) {
      pressedRef.current.delete(dir);
      return;
    }
    const action = keyToAction(e.key);
    if (action === 'action') {
      actionDownRef.current = false;
      actionConsumedRef.current = false;
    } else if (action === 'cancel') {
      cancelDownRef.current = false;
      cancelConsumedRef.current = false;
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

  const isActionPressed = useCallback((): boolean => {
    return actionDownRef.current;
  }, []);

  const isCancelPressed = useCallback((): boolean => {
    return cancelDownRef.current;
  }, []);

  const consumeAction = useCallback((): boolean => {
    if (actionDownRef.current && !actionConsumedRef.current) {
      actionConsumedRef.current = true;
      return true;
    }
    return false;
  }, []);

  const consumeCancel = useCallback((): boolean => {
    if (cancelDownRef.current && !cancelConsumedRef.current) {
      cancelConsumedRef.current = true;
      return true;
    }
    return false;
  }, []);

  return { getIntent, isActionPressed, isCancelPressed, consumeAction, consumeCancel };
}

// ── Platform detection ──────────────────────────────────────────────────────

/**
 * Detect if the current device supports touch input.
 */
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Hook that combines keyboard and touch input into a unified interface.
 *
 * On web: keyboard always active, touch controls shown when touch is detected.
 * Returns: InputState + touchVisible flag for rendering touch overlay.
 */
export function usePlatformInput(): InputState & { touchVisible: boolean } {
  const keyboard = useKeyboardInput();
  const [touchVisible, setTouchVisible] = useState(false);

  // Touch intent refs (updated by touch controls via callbacks)
  const touchIntentRef = useRef<DirectionIntent>({ dx: 0, dy: 0 });
  const touchActionRef = useRef(false);
  const touchActionConsumedRef = useRef(false);
  const touchCancelRef = useRef(false);
  const touchCancelConsumedRef = useRef(false);

  useEffect(() => {
    setTouchVisible(isTouchDevice());
  }, []);

  const getIntent = useCallback((): DirectionIntent => {
    const kb = keyboard.getIntent();
    // If keyboard has input, prefer it; otherwise use touch
    if (kb.dx !== 0 || kb.dy !== 0) return kb;
    return touchIntentRef.current;
  }, [keyboard]);

  const isActionPressed = useCallback((): boolean => {
    return keyboard.isActionPressed() || touchActionRef.current;
  }, [keyboard]);

  const isCancelPressed = useCallback((): boolean => {
    return keyboard.isCancelPressed() || touchCancelRef.current;
  }, [keyboard]);

  const consumeAction = useCallback((): boolean => {
    // Try keyboard first
    if (keyboard.consumeAction()) return true;
    // Then try touch
    if (touchActionRef.current && !touchActionConsumedRef.current) {
      touchActionConsumedRef.current = true;
      return true;
    }
    return false;
  }, [keyboard]);

  const consumeCancel = useCallback((): boolean => {
    if (keyboard.consumeCancel()) return true;
    if (touchCancelRef.current && !touchCancelConsumedRef.current) {
      touchCancelConsumedRef.current = true;
      return true;
    }
    return false;
  }, [keyboard]);

  /** Callback for touch controls to set direction intent. */
  const onDirectionChange = useCallback((intent: DirectionIntent) => {
    touchIntentRef.current = intent;
  }, []);

  /** Callback for touch controls action press. */
  const onAction = useCallback(() => {
    touchActionRef.current = true;
    touchActionConsumedRef.current = false;
    // Auto-release after a frame (touch is tap, not hold)
    setTimeout(() => {
      touchActionRef.current = false;
    }, 100);
  }, []);

  /** Callback for touch controls cancel press. */
  const onCancel = useCallback(() => {
    touchCancelRef.current = true;
    touchCancelConsumedRef.current = false;
    setTimeout(() => {
      touchCancelRef.current = false;
    }, 100);
  }, []);

  return {
    getIntent,
    isActionPressed,
    isCancelPressed,
    consumeAction,
    consumeCancel,
    touchVisible,
    /** Exposed for touch-controls component to wire into. */
    onDirectionChange,
    onAction,
    onCancel,
  } as InputState & {
    touchVisible: boolean;
    onDirectionChange: (intent: DirectionIntent) => void;
    onAction: () => void;
    onCancel: () => void;
  };
}
