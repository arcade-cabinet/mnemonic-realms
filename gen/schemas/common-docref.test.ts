import { describe, expect, it } from 'vitest';
import { DocRefPurposeSchema, DocRefSchema } from './common-docref';

describe('DocRefPurposeSchema', () => {
  it.each(['style', 'content', 'constraints', 'palette'])('accepts "%s"', (purpose) => {
    expect(DocRefPurposeSchema.parse(purpose)).toBe(purpose);
  });

  it('rejects invalid purposes', () => {
    expect(() => DocRefPurposeSchema.parse('reference')).toThrow();
    expect(() => DocRefPurposeSchema.parse('')).toThrow();
  });
});

describe('DocRefSchema', () => {
  const valid = {
    path: 'docs/design/visual-direction.md',
    heading: 'Sprite Style',
    purpose: 'style' as const,
  };

  it('accepts valid doc ref', () => {
    expect(DocRefSchema.parse(valid)).toEqual(valid);
  });

  it('accepts all purpose types', () => {
    for (const purpose of ['style', 'content', 'constraints', 'palette']) {
      expect(DocRefSchema.parse({ ...valid, purpose })).toEqual({ ...valid, purpose });
    }
  });

  it('rejects missing path', () => {
    const { path, ...rest } = valid;
    expect(() => DocRefSchema.parse(rest)).toThrow();
  });

  it('rejects missing heading', () => {
    const { heading, ...rest } = valid;
    expect(() => DocRefSchema.parse(rest)).toThrow();
  });

  it('rejects invalid purpose', () => {
    expect(() => DocRefSchema.parse({ ...valid, purpose: 'unknown' })).toThrow();
  });
});
