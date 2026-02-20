import { describe, expect, it } from 'vitest';
import {
  checkCollision,
  resolveMovement,
} from '../../../../../engine/ecs/systems/collision.js';

// Helper: create a collision grid from a 2D array
function makeGrid(rows: number[][]): { grid: Uint8Array; width: number } {
  const height = rows.length;
  const width = rows[0].length;
  const grid = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      grid[y * width + x] = rows[y][x];
    }
  }
  return { grid, width };
}

describe('checkCollision', () => {
  const { grid, width } = makeGrid([
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
  ]);

  it('returns false for passable tiles', () => {
    expect(checkCollision(grid, width, 0, 0)).toBe(false);
    expect(checkCollision(grid, width, 1, 0)).toBe(false);
    expect(checkCollision(grid, width, 3, 0)).toBe(false);
    expect(checkCollision(grid, width, 0, 1)).toBe(false);
  });

  it('returns true for blocked tiles', () => {
    expect(checkCollision(grid, width, 2, 0)).toBe(true);
    expect(checkCollision(grid, width, 1, 1)).toBe(true);
    expect(checkCollision(grid, width, 3, 2)).toBe(true);
  });

  it('returns true for out-of-bounds (negative)', () => {
    expect(checkCollision(grid, width, -1, 0)).toBe(true);
    expect(checkCollision(grid, width, 0, -1)).toBe(true);
    expect(checkCollision(grid, width, -1, -1)).toBe(true);
  });

  it('returns true for out-of-bounds (beyond map)', () => {
    expect(checkCollision(grid, width, 4, 0)).toBe(true); // x >= width
    expect(checkCollision(grid, width, 0, 3)).toBe(true); // y >= height
    expect(checkCollision(grid, width, 100, 100)).toBe(true);
  });

  it('handles edge tiles correctly', () => {
    // Bottom-right corner
    expect(checkCollision(grid, width, 3, 2)).toBe(true); // blocked
    // Top-left corner
    expect(checkCollision(grid, width, 0, 0)).toBe(false); // passable
  });
});

describe('resolveMovement', () => {
  const { grid, width } = makeGrid([
    [0, 0, 1],
    [0, 0, 0],
    [1, 0, 0],
  ]);

  it('allows movement to passable tiles', () => {
    const result = resolveMovement(grid, width, 0, 0, 1, 0);
    expect(result).toEqual({ x: 1, y: 0 });
  });

  it('blocks movement to blocked tiles', () => {
    const result = resolveMovement(grid, width, 1, 0, 2, 0);
    expect(result).toEqual({ x: 1, y: 0 }); // stays at origin
  });

  it('blocks movement out of bounds', () => {
    const result = resolveMovement(grid, width, 0, 0, -1, 0);
    expect(result).toEqual({ x: 0, y: 0 }); // stays at origin
  });

  it('allows movement to all passable neighbors', () => {
    // From center (1,1) which is passable
    expect(resolveMovement(grid, width, 1, 1, 0, 1)).toEqual({ x: 0, y: 1 }); // left
    expect(resolveMovement(grid, width, 1, 1, 2, 1)).toEqual({ x: 2, y: 1 }); // right
    expect(resolveMovement(grid, width, 1, 1, 1, 0)).toEqual({ x: 1, y: 0 }); // up
    expect(resolveMovement(grid, width, 1, 1, 1, 2)).toEqual({ x: 1, y: 2 }); // down
  });

  it('blocks movement into blocked corner', () => {
    // (0,2) is blocked
    const result = resolveMovement(grid, width, 0, 1, 0, 2);
    expect(result).toEqual({ x: 0, y: 1 }); // stays
  });

  it('returns target when from and to are the same', () => {
    const result = resolveMovement(grid, width, 1, 1, 1, 1);
    expect(result).toEqual({ x: 1, y: 1 });
  });
});

