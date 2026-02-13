import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import type { GenerationMetadata } from './common-generation';
import { hashFile, hashPrompt, needsRegeneration } from './common-hash';

describe('hashPrompt', () => {
  it('returns a 16-character hex string', () => {
    const result = hashPrompt('test prompt');
    expect(result).toMatch(/^[0-9a-f]{16}$/);
  });

  it('is deterministic for the same input', () => {
    expect(hashPrompt('hello world')).toBe(hashPrompt('hello world'));
  });

  it('produces different hashes for different inputs', () => {
    expect(hashPrompt('prompt A')).not.toBe(hashPrompt('prompt B'));
  });

  it('matches expected sha256 prefix', () => {
    const expected = createHash('sha256').update('test').digest('hex').slice(0, 16);
    expect(hashPrompt('test')).toBe(expected);
  });
});

describe('hashFile', () => {
  it('returns a full sha256 hex string', () => {
    const buf = Buffer.from('file content');
    const result = hashFile(buf);
    expect(result).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is deterministic', () => {
    const buf = Buffer.from('same content');
    expect(hashFile(buf)).toBe(hashFile(buf));
  });

  it('differs for different content', () => {
    expect(hashFile(Buffer.from('a'))).not.toBe(hashFile(Buffer.from('b')));
  });

  it('matches expected sha256', () => {
    const data = Buffer.from('hello');
    const expected = createHash('sha256').update(data).digest('hex');
    expect(hashFile(data)).toBe(expected);
  });
});

describe('needsRegeneration', () => {
  const promptHash = hashPrompt('some prompt');
  const fileData = Buffer.alloc(2048, 'x');
  const outputHash = hashFile(fileData);

  const metadata: GenerationMetadata = {
    promptHash,
    outputHash,
    generatedAt: '2025-01-01T00:00:00.000Z',
    generationTimeMs: 1000,
    fileSizeBytes: 2048,
    model: 'gemini-2.0-flash',
  };

  it('returns true for pending status', () => {
    expect(needsRegeneration('pending', metadata, promptHash, true, fileData)).toBe(true);
  });

  it('returns true for failed status', () => {
    expect(needsRegeneration('failed', metadata, promptHash, true, fileData)).toBe(true);
  });

  it('returns true when metadata is undefined', () => {
    expect(needsRegeneration('generated', undefined, promptHash, true, fileData)).toBe(true);
  });

  it('returns true when file does not exist', () => {
    expect(needsRegeneration('generated', metadata, promptHash, false)).toBe(true);
  });

  it('returns true when file is too small (< 1024 bytes)', () => {
    const tinyFile = Buffer.alloc(512, 'x');
    expect(needsRegeneration('generated', metadata, promptHash, true, tinyFile)).toBe(true);
  });

  it('returns false when file is exactly at the threshold (1024 bytes)', () => {
    const thresholdFile = Buffer.alloc(1024, 'x');
    const thresholdHash = hashFile(thresholdFile);
    const metaWithThresholdHash: GenerationMetadata = {
      ...metadata,
      outputHash: thresholdHash,
    };
    // 1024 bytes is NOT less than 1024, so size check passes. Hash must also match.
    expect(
      needsRegeneration('generated', metaWithThresholdHash, promptHash, true, thresholdFile),
    ).toBe(false);
  });

  it('returns true when prompt hash changed', () => {
    const differentPromptHash = hashPrompt('different prompt');
    expect(needsRegeneration('generated', metadata, differentPromptHash, true, fileData)).toBe(
      true,
    );
  });

  it('returns true when output hash mismatches', () => {
    const differentFileData = Buffer.alloc(2048, 'y');
    expect(needsRegeneration('generated', metadata, promptHash, true, differentFileData)).toBe(
      true,
    );
  });

  it('returns false when everything matches', () => {
    expect(needsRegeneration('generated', metadata, promptHash, true, fileData)).toBe(false);
  });

  it('returns false for generating status with matching data', () => {
    expect(needsRegeneration('generating', metadata, promptHash, true, fileData)).toBe(false);
  });

  it('returns false when file exists but no fileData provided (skips size/hash checks)', () => {
    expect(needsRegeneration('generated', metadata, promptHash, true)).toBe(false);
  });

  it('returns false when metadata has no outputHash (skips hash comparison)', () => {
    const metaNoOutputHash: GenerationMetadata = {
      ...metadata,
      outputHash: undefined,
    };
    expect(needsRegeneration('generated', metaNoOutputHash, promptHash, true, fileData)).toBe(
      false,
    );
  });
});
