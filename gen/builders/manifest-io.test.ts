import { describe, expect, it, vi } from 'vitest';
import { genDims, mergeManifestAssets, slugify, timestamp } from './manifest-io';

describe('timestamp', () => {
  it('returns an ISO 8601 string', () => {
    const result = timestamp();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  });

  it('returns a parseable date', () => {
    const result = timestamp();
    const parsed = new Date(result);
    expect(parsed.getTime()).not.toBeNaN();
  });
});

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Iron Sword')).toBe('iron-sword');
  });

  it('removes special characters', () => {
    expect(slugify("Hero's Shield")).toBe('hero-s-shield');
  });

  it('collapses multiple non-alphanum into single hyphen', () => {
    expect(slugify('foo---bar')).toBe('foo-bar');
    expect(slugify('foo   bar')).toBe('foo-bar');
    expect(slugify('foo!!!bar')).toBe('foo-bar');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello');
    expect(slugify('  hello  ')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles all-special-chars string', () => {
    expect(slugify('!!!')).toBe('');
  });

  it('preserves numbers', () => {
    expect(slugify('Item 42 Plus')).toBe('item-42-plus');
  });
});

describe('genDims', () => {
  it('returns 4x scale for small dimensions', () => {
    const result = genDims(32, 32);
    expect(result).toEqual({ width: 32, height: 32, genWidth: 128, genHeight: 128 });
  });

  it('caps at 2048', () => {
    const result = genDims(800, 600);
    expect(result).toEqual({ width: 800, height: 600, genWidth: 2048, genHeight: 2048 });
  });

  it('preserves original dimensions', () => {
    const result = genDims(256, 128);
    expect(result.width).toBe(256);
    expect(result.height).toBe(128);
  });

  it('caps only the dimension that exceeds 2048', () => {
    const result = genDims(100, 600);
    expect(result.genWidth).toBe(400);
    expect(result.genHeight).toBe(2048);
  });

  it('handles exact boundary (512 * 4 = 2048)', () => {
    const result = genDims(512, 512);
    expect(result.genWidth).toBe(2048);
    expect(result.genHeight).toBe(2048);
  });

  it('caps dimension just above boundary', () => {
    const result = genDims(513, 513);
    expect(result.genWidth).toBe(2048);
    expect(result.genHeight).toBe(2048);
  });
});

describe('mergeManifestAssets', () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  it('preserves metadata for unchanged IDs', () => {
    const existing = [
      {
        id: 'a',
        status: 'generated',
        metadata: {
          promptHash: 'hash1',
          generatedAt: '2025-01-01T00:00:00.000Z',
          generationTimeMs: 100,
          fileSizeBytes: 500,
          model: 'gemini',
        },
      },
    ];
    const newAssets = [{ id: 'a', status: 'pending' }];

    const result = mergeManifestAssets(newAssets, existing);
    expect(result[0].status).toBe('generated');
    expect(result[0].metadata).toEqual(existing[0].metadata);
  });

  it('does not preserve when existing has no metadata', () => {
    const existing = [{ id: 'a', status: 'pending' }];
    const newAssets = [{ id: 'a', status: 'pending' }];

    const result = mergeManifestAssets(newAssets, existing);
    expect(result[0].metadata).toBeUndefined();
    expect(result[0].status).toBe('pending');
  });

  it('uses new asset data for IDs not in existing', () => {
    const existing = [{ id: 'old', status: 'generated', metadata: { promptHash: 'h' } as any }];
    const newAssets = [{ id: 'new', status: 'pending' }];

    const result = mergeManifestAssets(newAssets, existing);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('new');
    expect(result[0].status).toBe('pending');
  });

  it('preserves lastError from existing', () => {
    const existing = [
      {
        id: 'a',
        status: 'failed',
        metadata: { promptHash: 'h' } as any,
        lastError: 'API timeout',
      },
    ];
    const newAssets = [{ id: 'a', status: 'pending' }];

    const result = mergeManifestAssets(newAssets, existing);
    expect(result[0].lastError).toBe('API timeout');
  });

  it('does not carry over lastError if existing has none', () => {
    const existing = [{ id: 'a', status: 'generated', metadata: { promptHash: 'h' } as any }];
    const newAssets = [{ id: 'a', status: 'pending' }];

    const result = mergeManifestAssets(newAssets, existing);
    expect(result[0].lastError).toBeUndefined();
  });

  it('handles empty existing assets', () => {
    const newAssets = [
      { id: 'a', status: 'pending' },
      { id: 'b', status: 'pending' },
    ];

    const result = mergeManifestAssets(newAssets, []);
    expect(result).toHaveLength(2);
    expect(result.every((a) => a.status === 'pending')).toBe(true);
  });

  it('handles empty new assets', () => {
    const existing = [{ id: 'old', status: 'generated', metadata: { promptHash: 'h' } as any }];

    const result = mergeManifestAssets([], existing);
    expect(result).toHaveLength(0);
  });

  it('logs stale asset removal', () => {
    consoleSpy.mockClear();
    const existing = [{ id: 'stale', status: 'generated', metadata: { promptHash: 'h' } as any }];
    const newAssets = [{ id: 'fresh', status: 'pending' }];

    mergeManifestAssets(newAssets, existing);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Removed 1 stale assets'));
  });

  it('overwrites new asset fields with existing metadata', () => {
    const existing = [
      {
        id: 'a',
        status: 'generated',
        metadata: { promptHash: 'old-hash' } as any,
      },
    ];
    const newAssets = [{ id: 'a', status: 'pending', prompt: 'new prompt' } as any];

    const result = mergeManifestAssets(newAssets, existing);
    // New fields preserved, status + metadata from existing
    expect(result[0].prompt).toBe('new prompt');
    expect(result[0].status).toBe('generated');
    expect(result[0].metadata.promptHash).toBe('old-hash');
  });
});
