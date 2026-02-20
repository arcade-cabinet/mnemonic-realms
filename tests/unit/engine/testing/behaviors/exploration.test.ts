import { describe, expect, it } from 'vitest';
import {
  getUnexploredTiles,
  pickExplorationTarget,
  markVisited,
  getExplorationCoverage,
} from '../../../../../engine/testing/behaviors/exploration.js';

describe('getUnexploredTiles', () => {
  it('returns all passable tiles when none visited', () => {
    const grid = new Uint8Array([0, 0, 1, 0]); // 2x2, (0,1) blocked
    const visited = new Set<number>();
    const tiles = getUnexploredTiles(visited, grid, 2, 2);
    expect(tiles).toHaveLength(3);
  });

  it('excludes visited tiles', () => {
    const grid = new Uint8Array([0, 0, 0, 0]); // 2x2 all passable
    const visited = new Set<number>([0, 1]); // (0,0) and (1,0) visited
    const tiles = getUnexploredTiles(visited, grid, 2, 2);
    expect(tiles).toHaveLength(2);
    expect(tiles).toEqual([{ x: 0, y: 1 }, { x: 1, y: 1 }]);
  });

  it('returns empty when all passable tiles visited', () => {
    const grid = new Uint8Array([0, 1, 0, 1]); // 2x2, only (0,0) and (0,1) passable
    const visited = new Set<number>([0, 2]);
    const tiles = getUnexploredTiles(visited, grid, 2, 2);
    expect(tiles).toHaveLength(0);
  });

  it('excludes blocked tiles', () => {
    const grid = new Uint8Array([1, 1, 1, 1]); // all blocked
    const visited = new Set<number>();
    const tiles = getUnexploredTiles(visited, grid, 2, 2);
    expect(tiles).toHaveLength(0);
  });
});

describe('pickExplorationTarget', () => {
  it('returns closest tile by Manhattan distance', () => {
    const tiles = [
      { x: 5, y: 5 },
      { x: 1, y: 1 },
      { x: 3, y: 3 },
    ];
    const target = pickExplorationTarget(tiles, { x: 0, y: 0 });
    expect(target).toEqual({ x: 1, y: 1 });
  });

  it('returns null for empty array', () => {
    const target = pickExplorationTarget([], { x: 0, y: 0 });
    expect(target).toBeNull();
  });

  it('returns the only tile when array has one element', () => {
    const target = pickExplorationTarget([{ x: 3, y: 4 }], { x: 0, y: 0 });
    expect(target).toEqual({ x: 3, y: 4 });
  });
});

describe('markVisited', () => {
  it('adds tile index to visited set', () => {
    const visited = new Set<number>();
    markVisited(visited, 3, 2, 10); // index = 2*10+3 = 23
    expect(visited.has(23)).toBe(true);
  });

  it('does not duplicate entries', () => {
    const visited = new Set<number>();
    markVisited(visited, 1, 1, 5);
    markVisited(visited, 1, 1, 5);
    expect(visited.size).toBe(1);
  });
});

describe('getExplorationCoverage', () => {
  it('returns 0 when no tiles visited', () => {
    const grid = new Uint8Array([0, 0, 0, 0]);
    const visited = new Set<number>();
    expect(getExplorationCoverage(visited, grid, 2, 2)).toBe(0);
  });

  it('returns 1 when all passable tiles visited', () => {
    const grid = new Uint8Array([0, 1, 0, 1]); // 2 passable
    const visited = new Set<number>([0, 2]);
    expect(getExplorationCoverage(visited, grid, 2, 2)).toBe(1);
  });

  it('returns correct ratio for partial coverage', () => {
    const grid = new Uint8Array([0, 0, 0, 0]); // 4 passable
    const visited = new Set<number>([0, 1]); // 2 visited
    expect(getExplorationCoverage(visited, grid, 2, 2)).toBe(0.5);
  });

  it('returns 1 when all tiles are blocked', () => {
    const grid = new Uint8Array([1, 1, 1, 1]);
    const visited = new Set<number>();
    expect(getExplorationCoverage(visited, grid, 2, 2)).toBe(1);
  });
});

