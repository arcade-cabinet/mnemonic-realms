/**
 * Mnemonic Realms — Typewriter Text Hook
 *
 * Reveals text letter-by-letter at configurable speed.
 * Pure hook — no UI rendering. Used by dialogue-box.tsx.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/** Default milliseconds between each character reveal. */
const DEFAULT_SPEED_MS = 30;

export interface UseTypewriterResult {
  /** The portion of text revealed so far. */
  displayedText: string;
  /** Whether the full text has been revealed. */
  isComplete: boolean;
  /** Instantly reveal the full text. */
  complete: () => void;
  /** Reset to the beginning (empty string). */
  reset: () => void;
}

/**
 * Typewriter effect hook — reveals `text` one character at a time.
 *
 * @param text  The full string to reveal.
 * @param speed Milliseconds per character (default 30).
 */
export function useTypewriter(text: string, speed: number = DEFAULT_SPEED_MS): UseTypewriterResult {
  const [charIndex, setCharIndex] = useState(0);
  const textRef = useRef(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear any running interval.
  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reset when the source text changes.
  if (textRef.current !== text) {
    textRef.current = text;
    setCharIndex(0);
  }

  // Drive the reveal interval.
  useEffect(() => {
    clearTick();

    if (charIndex < text.length) {
      intervalRef.current = setInterval(() => {
        setCharIndex((prev) => {
          const next = prev + 1;
          if (next >= text.length) {
            clearTick();
          }
          return next;
        });
      }, speed);
    }

    return clearTick;
  }, [charIndex, text, speed, clearTick]);

  const complete = useCallback(() => {
    clearTick();
    setCharIndex(text.length);
  }, [text, clearTick]);

  const reset = useCallback(() => {
    clearTick();
    setCharIndex(0);
  }, [clearTick]);

  return {
    displayedText: text.slice(0, charIndex),
    isComplete: charIndex >= text.length,
    complete,
    reset,
  };
}
