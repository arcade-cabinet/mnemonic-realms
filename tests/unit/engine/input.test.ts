import { describe, expect, it } from 'vitest';
import {
  directionsToIntent,
  keyToDirection,
} from '../../../engine/input.js';

describe('keyToDirection', () => {
  it('maps arrow keys to directions', () => {
    expect(keyToDirection('ArrowUp')).toBe('up');
    expect(keyToDirection('ArrowDown')).toBe('down');
    expect(keyToDirection('ArrowLeft')).toBe('left');
    expect(keyToDirection('ArrowRight')).toBe('right');
  });

  it('maps WASD keys to directions (lowercase)', () => {
    expect(keyToDirection('w')).toBe('up');
    expect(keyToDirection('a')).toBe('left');
    expect(keyToDirection('s')).toBe('down');
    expect(keyToDirection('d')).toBe('right');
  });

  it('maps WASD keys to directions (uppercase)', () => {
    expect(keyToDirection('W')).toBe('up');
    expect(keyToDirection('A')).toBe('left');
    expect(keyToDirection('S')).toBe('down');
    expect(keyToDirection('D')).toBe('right');
  });

  it('returns null for non-movement keys', () => {
    expect(keyToDirection('Enter')).toBeNull();
    expect(keyToDirection('Space')).toBeNull();
    expect(keyToDirection('e')).toBeNull();
    expect(keyToDirection('Escape')).toBeNull();
    expect(keyToDirection('1')).toBeNull();
  });
});

describe('directionsToIntent', () => {
  it('returns zero intent when no directions pressed', () => {
    const result = directionsToIntent(new Set());
    expect(result).toEqual({ dx: 0, dy: 0 });
  });

  it('returns correct intent for single direction', () => {
    expect(directionsToIntent(new Set(['up']))).toEqual({ dx: 0, dy: -1 });
    expect(directionsToIntent(new Set(['down']))).toEqual({ dx: 0, dy: 1 });
    expect(directionsToIntent(new Set(['left']))).toEqual({ dx: -1, dy: 0 });
    expect(directionsToIntent(new Set(['right']))).toEqual({ dx: 1, dy: 0 });
  });

  it('cancels opposing horizontal directions', () => {
    const result = directionsToIntent(new Set(['left', 'right']));
    expect(result).toEqual({ dx: 0, dy: 0 });
  });

  it('cancels opposing vertical directions', () => {
    const result = directionsToIntent(new Set(['up', 'down']));
    expect(result).toEqual({ dx: 0, dy: 0 });
  });

  it('resolves diagonal to vertical (JRPG convention)', () => {
    // When both axes have input, prefer vertical (dx zeroed)
    const upRight = directionsToIntent(new Set(['up', 'right']));
    expect(upRight).toEqual({ dx: 0, dy: -1 });

    const downLeft = directionsToIntent(new Set(['down', 'left']));
    expect(downLeft).toEqual({ dx: 0, dy: 1 });
  });

  it('allows horizontal when no vertical input', () => {
    const result = directionsToIntent(new Set(['right']));
    expect(result).toEqual({ dx: 1, dy: 0 });
  });
});

