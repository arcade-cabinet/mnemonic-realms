import { describe, expect, it } from 'vitest';
import {
  AssetCategorySchema,
  AssetDimensionsSchema,
  GenerationMetadataSchema,
  GenerationStatusSchema,
  OutputFormatSchema,
} from './common-generation';

describe('GenerationStatusSchema', () => {
  it.each(['pending', 'generating', 'generated', 'failed'])('accepts "%s"', (status) => {
    expect(GenerationStatusSchema.parse(status)).toBe(status);
  });

  it('rejects invalid status', () => {
    expect(() => GenerationStatusSchema.parse('unknown')).toThrow();
    expect(() => GenerationStatusSchema.parse('')).toThrow();
    expect(() => GenerationStatusSchema.parse(42)).toThrow();
  });
});

describe('GenerationMetadataSchema', () => {
  const valid = {
    promptHash: 'abc123def456',
    generatedAt: '2025-01-15T12:00:00.000Z',
    generationTimeMs: 5000,
    fileSizeBytes: 1024,
    model: 'gemini-2.0-flash',
  };

  it('accepts valid metadata', () => {
    const result = GenerationMetadataSchema.parse(valid);
    expect(result.promptHash).toBe(valid.promptHash);
    expect(result.model).toBe(valid.model);
  });

  it('accepts metadata with optional fields', () => {
    const withOptional = {
      ...valid,
      outputHash: 'abcdef1234567890',
      postProcessing: ['resize', 'quantize'],
    };
    const result = GenerationMetadataSchema.parse(withOptional);
    expect(result.outputHash).toBe('abcdef1234567890');
    expect(result.postProcessing).toEqual(['resize', 'quantize']);
  });

  it('rejects missing required fields', () => {
    expect(() => GenerationMetadataSchema.parse({})).toThrow();
    expect(() => GenerationMetadataSchema.parse({ promptHash: 'x' })).toThrow();
  });

  it('rejects invalid datetime format', () => {
    expect(() => GenerationMetadataSchema.parse({ ...valid, generatedAt: 'not-a-date' })).toThrow();
  });

  it('rejects non-number generationTimeMs', () => {
    expect(() => GenerationMetadataSchema.parse({ ...valid, generationTimeMs: 'fast' })).toThrow();
  });
});

describe('AssetDimensionsSchema', () => {
  const valid = { width: 32, height: 32, genWidth: 256, genHeight: 256 };

  it('accepts valid dimensions', () => {
    expect(AssetDimensionsSchema.parse(valid)).toEqual(valid);
  });

  it('rejects non-positive dimensions', () => {
    expect(() => AssetDimensionsSchema.parse({ ...valid, width: 0 })).toThrow();
    expect(() => AssetDimensionsSchema.parse({ ...valid, height: -1 })).toThrow();
  });

  it('rejects non-integer dimensions', () => {
    expect(() => AssetDimensionsSchema.parse({ ...valid, width: 32.5 })).toThrow();
  });

  it('rejects missing fields', () => {
    expect(() => AssetDimensionsSchema.parse({ width: 32 })).toThrow();
  });
});

describe('OutputFormatSchema', () => {
  it('accepts png', () => {
    expect(OutputFormatSchema.parse('png')).toBe('png');
  });

  it('accepts webp', () => {
    expect(OutputFormatSchema.parse('webp')).toBe('webp');
  });

  it('rejects other formats', () => {
    expect(() => OutputFormatSchema.parse('jpg')).toThrow();
    expect(() => OutputFormatSchema.parse('gif')).toThrow();
  });
});

describe('AssetCategorySchema', () => {
  it.each([
    'tileset',
    'spritesheet',
    'portrait',
    'item-icon',
    'ui-element',
    'particle',
  ])('accepts "%s"', (cat) => {
    expect(AssetCategorySchema.parse(cat)).toBe(cat);
  });

  it('rejects unknown categories', () => {
    expect(() => AssetCategorySchema.parse('music')).toThrow();
    expect(() => AssetCategorySchema.parse('')).toThrow();
  });
});
