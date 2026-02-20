import { describe, expect, it } from 'vitest';
import {
  cullSprites,
  getSpriteSourceRect,
  sortSpritesByDepth,
} from '../../../../engine/renderer/sprite-helpers.js';
import type { SpriteEntry } from '../../../../engine/renderer/sprite-helpers.js';
import type { CameraState } from '../../../../engine/renderer/types.js';

// ── Helper ──────────────────────────────────────────────────────────────────

function cam(x: number, y: number, w: number, h: number): CameraState {
  return { x, y, viewportWidth: w, viewportHeight: h };
}

function sprite(x: number, y: number, frame = 0): SpriteEntry {
  return { x, y, frame, width: 16, height: 16 };
}

// ── sortSpritesByDepth ──────────────────────────────────────────────────────

describe('sortSpritesByDepth', () => {
  it('sorts sprites by Y ascending', () => {
    const sprites = [sprite(0, 48), sprite(0, 16), sprite(0, 32)];
    const sorted = sortSpritesByDepth(sprites);
    expect(sorted.map((s) => s.y)).toEqual([16, 32, 48]);
  });

  it('preserves order for same Y', () => {
    const sprites = [sprite(32, 16), sprite(0, 16), sprite(16, 16)];
    const sorted = sortSpritesByDepth(sprites);
    expect(sorted.map((s) => s.x)).toEqual([32, 0, 16]);
  });

  it('does not mutate original array', () => {
    const sprites = [sprite(0, 48), sprite(0, 16)];
    const sorted = sortSpritesByDepth(sprites);
    expect(sorted).not.toBe(sprites);
    expect(sprites[0].y).toBe(48); // original unchanged
  });

  it('handles empty array', () => {
    expect(sortSpritesByDepth([])).toEqual([]);
  });
});

// ── getSpriteSourceRect ─────────────────────────────────────────────────────

describe('getSpriteSourceRect', () => {
  it('returns correct rect for frame 0', () => {
    const rect = getSpriteSourceRect(0, 4, 16, 16);
    expect(rect).toEqual({ x: 0, y: 0, width: 16, height: 16 });
  });

  it('returns correct rect for frame in first row', () => {
    const rect = getSpriteSourceRect(2, 4, 16, 16);
    expect(rect).toEqual({ x: 32, y: 0, width: 16, height: 16 });
  });

  it('wraps to next row', () => {
    const rect = getSpriteSourceRect(5, 4, 16, 16);
    // frame 5: col=1, row=1
    expect(rect).toEqual({ x: 16, y: 16, width: 16, height: 16 });
  });

  it('handles last column', () => {
    const rect = getSpriteSourceRect(3, 4, 16, 16);
    expect(rect).toEqual({ x: 48, y: 0, width: 16, height: 16 });
  });
});

// ── cullSprites ─────────────────────────────────────────────────────────────

describe('cullSprites', () => {
  it('keeps sprites within viewport', () => {
    const sprites = [sprite(10, 10), sprite(100, 100)];
    const result = cullSprites(sprites, cam(0, 0, 200, 200));
    expect(result).toHaveLength(2);
  });

  it('removes sprites fully outside viewport (right)', () => {
    const sprites = [sprite(300, 10)];
    const result = cullSprites(sprites, cam(0, 0, 200, 200));
    expect(result).toHaveLength(0);
  });

  it('removes sprites fully outside viewport (below)', () => {
    const sprites = [sprite(10, 300)];
    const result = cullSprites(sprites, cam(0, 0, 200, 200));
    expect(result).toHaveLength(0);
  });

  it('removes sprites fully outside viewport (left)', () => {
    const sprites = [sprite(-20, 10)];
    const result = cullSprites(sprites, cam(0, 0, 200, 200));
    expect(result).toHaveLength(0);
  });

  it('removes sprites fully outside viewport (above)', () => {
    const sprites = [sprite(10, -20)];
    const result = cullSprites(sprites, cam(0, 0, 200, 200));
    expect(result).toHaveLength(0);
  });

  it('keeps partially visible sprites', () => {
    // Sprite at (-8, -8) with size 16x16 → partially visible
    const sprites = [{ x: -8, y: -8, frame: 0, width: 16, height: 16 }];
    const result = cullSprites(sprites, cam(0, 0, 200, 200));
    expect(result).toHaveLength(1);
  });

  it('accounts for camera offset', () => {
    // Sprite at world (300, 300), camera at (200, 200), viewport 200x200
    // Screen position: (100, 100) → visible
    const sprites = [sprite(300, 300)];
    const result = cullSprites(sprites, cam(200, 200, 200, 200));
    expect(result).toHaveLength(1);
  });

  it('handles empty array', () => {
    expect(cullSprites([], cam(0, 0, 200, 200))).toEqual([]);
  });
});

