import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createElement, type FC } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  useTypewriter,
  type UseTypewriterResult,
} from '../../../ui/hooks/use-typewriter';

// ---------------------------------------------------------------------------
// Minimal renderHook helper (avoids @testing-library dependency)
// ---------------------------------------------------------------------------

function renderHook<T>(hookFn: () => T) {
  const result = { current: null as T };
  let container: HTMLDivElement;
  let root: Root;

  const Wrapper: FC = () => {
    result.current = hookFn();
    return null;
  };

  act(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    root.render(createElement(Wrapper));
  });

  return {
    result,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      document.body.removeChild(container);
    },
  };
}

// ---------------------------------------------------------------------------
// Setup — fake timers for deterministic interval control
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// Letter-by-letter reveal
// ---------------------------------------------------------------------------

describe('useTypewriter', () => {
  it('starts with empty displayed text', () => {
    const { result, unmount } = renderHook(() => useTypewriter('Hello'));
    expect(result.current.displayedText).toBe('');
    expect(result.current.isComplete).toBe(false);
    unmount();
  });

  it('reveals text one character at a time at default speed', () => {
    const { result, unmount } = renderHook(() => useTypewriter('Hi'));

    // After one tick (30ms default)
    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(result.current.displayedText).toBe('H');
    expect(result.current.isComplete).toBe(false);

    // After second tick
    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(result.current.displayedText).toBe('Hi');
    expect(result.current.isComplete).toBe(true);
    unmount();
  });

  it('respects custom speed', () => {
    const { result, unmount } = renderHook(() => useTypewriter('AB', 100));

    // Not yet at 100ms
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayedText).toBe('');

    // At 100ms — first char
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayedText).toBe('A');

    // At 200ms — second char
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.displayedText).toBe('AB');
    expect(result.current.isComplete).toBe(true);
    unmount();
  });

  it('handles empty string', () => {
    const { result, unmount } = renderHook(() => useTypewriter(''));
    expect(result.current.displayedText).toBe('');
    expect(result.current.isComplete).toBe(true);
    unmount();
  });

  // ---------------------------------------------------------------------------
  // complete()
  // ---------------------------------------------------------------------------

  describe('complete()', () => {
    it('instantly reveals the full text', () => {
      const { result, unmount } = renderHook(() =>
        useTypewriter('Hello World'),
      );

      act(() => {
        vi.advanceTimersByTime(30);
      });
      expect(result.current.displayedText).toBe('H');

      act(() => {
        result.current.complete();
      });
      expect(result.current.displayedText).toBe('Hello World');
      expect(result.current.isComplete).toBe(true);
      unmount();
    });

    it('is a no-op when already complete', () => {
      const { result, unmount } = renderHook(() => useTypewriter('Hi'));

      act(() => {
        vi.advanceTimersByTime(60);
      });
      expect(result.current.isComplete).toBe(true);

      act(() => {
        result.current.complete();
      });
      expect(result.current.displayedText).toBe('Hi');
      expect(result.current.isComplete).toBe(true);
      unmount();
    });
  });

  // ---------------------------------------------------------------------------
  // reset()
  // ---------------------------------------------------------------------------

  describe('reset()', () => {
    it('resets displayed text to empty', () => {
      const { result, unmount } = renderHook(() => useTypewriter('Hello'));

      act(() => {
        vi.advanceTimersByTime(90);
      });
      expect(result.current.displayedText).toBe('Hel');

      act(() => {
        result.current.reset();
      });
      expect(result.current.displayedText).toBe('');
      expect(result.current.isComplete).toBe(false);
      unmount();
    });

    it('restarts the typewriter after reset', () => {
      const { result, unmount } = renderHook(() => useTypewriter('AB'));

      act(() => {
        result.current.complete();
      });
      expect(result.current.isComplete).toBe(true);

      act(() => {
        result.current.reset();
      });
      expect(result.current.displayedText).toBe('');

      act(() => {
        vi.advanceTimersByTime(30);
      });
      expect(result.current.displayedText).toBe('A');
      unmount();
    });
  });
});

