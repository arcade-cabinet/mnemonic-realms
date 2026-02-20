import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

// Mock node:fs before importing the module under test
vi.mock('node:fs', () => {
  const readdirSync = vi.fn();
  const readFileSync = vi.fn();
  return {
    default: { readdirSync, readFileSync },
    readdirSync,
    readFileSync,
  };
});

// Mock manifest-io to avoid import.meta.dirname issues
vi.mock('./manifest-io', () => ({
  PROJECT_ROOT: '/mock/project',
}));

import { readdirSync, readFileSync } from 'node:fs';
import { loadDdlDirectory, loadDdlMeta } from './ddl-directory';

const mockReaddirSync = vi.mocked(readdirSync);
const mockReadFileSync = vi.mocked(readFileSync);

const TestEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
});

describe('loadDdlDirectory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and validates entries from JSON files', () => {
    mockReaddirSync.mockReturnValue(['a.json', 'b.json'] as any);
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify([{ id: '1', name: 'One' }]))
      .mockReturnValueOnce(JSON.stringify([{ id: '2', name: 'Two' }]));

    const result = loadDdlDirectory('test-dir', TestEntrySchema);
    expect(result).toEqual([
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
    ]);
  });

  it('merges entries from multiple files', () => {
    mockReaddirSync.mockReturnValue(['a.json'] as any);
    mockReadFileSync.mockReturnValueOnce(
      JSON.stringify([
        { id: '1', name: 'One' },
        { id: '2', name: 'Two' },
      ]),
    );

    const result = loadDdlDirectory('multi', TestEntrySchema);
    expect(result).toHaveLength(2);
  });

  it('skips files starting with underscore', () => {
    mockReaddirSync.mockReturnValue(['_meta.json', 'data.json'] as any);
    mockReadFileSync.mockReturnValueOnce(JSON.stringify([{ id: '1', name: 'One' }]));

    const result = loadDdlDirectory('skip-meta', TestEntrySchema);
    expect(result).toHaveLength(1);
    expect(mockReadFileSync).toHaveBeenCalledTimes(1);
  });

  it('skips non-json files', () => {
    mockReaddirSync.mockReturnValue(['readme.md', 'data.json', 'notes.txt'] as any);
    mockReadFileSync.mockReturnValueOnce(JSON.stringify([{ id: '1', name: 'One' }]));

    const result = loadDdlDirectory('mixed', TestEntrySchema);
    expect(result).toHaveLength(1);
    expect(mockReadFileSync).toHaveBeenCalledTimes(1);
  });

  it('throws when JSON is not an array', () => {
    mockReaddirSync.mockReturnValue(['data.json'] as any);
    mockReadFileSync.mockReturnValueOnce(JSON.stringify({ id: '1', name: 'One' }));

    expect(() => loadDdlDirectory('not-array', TestEntrySchema)).toThrow(
      'expected JSON array, got object',
    );
  });

  it('throws on schema validation failure', () => {
    mockReaddirSync.mockReturnValue(['data.json'] as any);
    mockReadFileSync.mockReturnValueOnce(JSON.stringify([{ id: 123, name: 'Bad' }]));

    expect(() => loadDdlDirectory('invalid', TestEntrySchema)).toThrow();
  });

  it('throws when directory does not exist', () => {
    mockReaddirSync.mockImplementation(() => {
      throw new Error('ENOENT: no such file or directory');
    });

    expect(() => loadDdlDirectory('nonexistent', TestEntrySchema)).toThrow('ENOENT');
  });

  it('returns empty array for directory with no matching files', () => {
    mockReaddirSync.mockReturnValue(['_meta.json', 'readme.md'] as any);

    const result = loadDdlDirectory('empty', TestEntrySchema);
    expect(result).toEqual([]);
  });

  it('sorts files alphabetically before reading', () => {
    mockReaddirSync.mockReturnValue(['c.json', 'a.json', 'b.json'] as any);
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify([{ id: 'a', name: 'A' }]))
      .mockReturnValueOnce(JSON.stringify([{ id: 'b', name: 'B' }]))
      .mockReturnValueOnce(JSON.stringify([{ id: 'c', name: 'C' }]));

    const result = loadDdlDirectory('sorted', TestEntrySchema);
    expect(result).toEqual([
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' },
    ]);
  });

  it('throws on invalid JSON', () => {
    mockReaddirSync.mockReturnValue(['bad.json'] as any);
    mockReadFileSync.mockReturnValueOnce('not valid json{');

    expect(() => loadDdlDirectory('bad-json', TestEntrySchema)).toThrow();
  });
});

describe('loadDdlMeta', () => {
  const MetaSchema = z.object({
    gridCols: z.number(),
    gridRows: z.number(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and validates _meta.json', () => {
    mockReadFileSync.mockReturnValueOnce(JSON.stringify({ gridCols: 4, gridRows: 3 }));

    const result = loadDdlMeta('biomes', MetaSchema);
    expect(result).toEqual({ gridCols: 4, gridRows: 3 });
  });

  it('reads from correct path', () => {
    mockReadFileSync.mockReturnValueOnce(JSON.stringify({ gridCols: 2, gridRows: 2 }));

    loadDdlMeta('transitions', MetaSchema);
    const calledPath = mockReadFileSync.mock.calls[0][0] as string;
    expect(calledPath).toContain('transitions');
    expect(calledPath).toContain('_meta.json');
  });

  it('throws when file does not exist', () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error('ENOENT: no such file');
    });

    expect(() => loadDdlMeta('missing', MetaSchema)).toThrow('ENOENT');
  });

  it('throws on schema validation failure', () => {
    mockReadFileSync.mockReturnValueOnce(JSON.stringify({ gridCols: 'not a number' }));

    expect(() => loadDdlMeta('bad', MetaSchema)).toThrow();
  });

  it('throws on invalid JSON', () => {
    mockReadFileSync.mockReturnValueOnce('{broken json');

    expect(() => loadDdlMeta('bad-json', MetaSchema)).toThrow();
  });
});
