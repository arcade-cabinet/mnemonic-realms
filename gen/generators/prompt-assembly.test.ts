import { describe, expect, it, vi } from 'vitest';

// Mock the docref resolver
vi.mock('../utils/index', () => ({
  assembleDocRefContext: vi.fn(),
}));

import { assembleDocRefContext } from '../utils/index';
import { assembleFullPrompt } from './prompt-assembly';

const mockAssembleDocRefContext = vi.mocked(assembleDocRefContext);

describe('assembleFullPrompt', () => {
  it('returns just the base prompt when no style guide and no doc context', () => {
    mockAssembleDocRefContext.mockReturnValue('');
    const result = assembleFullPrompt('Draw a sword.', []);
    expect(result).toBe('Draw a sword.');
  });

  it('prepends style guide when provided', () => {
    mockAssembleDocRefContext.mockReturnValue('');
    const result = assembleFullPrompt('Draw a sword.', [], '16-bit JRPG style');
    expect(result).toContain('[GLOBAL STYLE GUIDE]');
    expect(result).toContain('16-bit JRPG style');
    expect(result).toContain('Draw a sword.');
  });

  it('style guide comes before base prompt', () => {
    mockAssembleDocRefContext.mockReturnValue('');
    const result = assembleFullPrompt('Draw a sword.', [], 'Style here');
    const styleIdx = result.indexOf('[GLOBAL STYLE GUIDE]');
    const promptIdx = result.indexOf('Draw a sword.');
    expect(styleIdx).toBeLessThan(promptIdx);
  });

  it('appends doc ref context when resolved', () => {
    mockAssembleDocRefContext.mockReturnValue('[CONTENT REFERENCE]\nSome doc content');
    const refs = [{ path: 'docs/test.md', heading: 'Test', purpose: 'content' as const }];
    const result = assembleFullPrompt('Draw a sword.', refs);
    expect(result).toContain('[CONTENT REFERENCE]');
    expect(result).toContain('Some doc content');
  });

  it('includes all three parts when everything is present', () => {
    mockAssembleDocRefContext.mockReturnValue('[STYLE CONTEXT]\nVisual notes');
    const refs = [{ path: 'docs/test.md', heading: 'Test', purpose: 'style' as const }];
    const result = assembleFullPrompt('Base prompt.', refs, 'Global style');

    expect(result).toContain('[GLOBAL STYLE GUIDE]');
    expect(result).toContain('Global style');
    expect(result).toContain('Base prompt.');
    expect(result).toContain('[STYLE CONTEXT]');
    expect(result).toContain('Visual notes');
  });

  it('separates parts with double newlines', () => {
    mockAssembleDocRefContext.mockReturnValue('doc context');
    const result = assembleFullPrompt('prompt', [], 'style');
    const parts = result.split('\n\n');
    expect(parts.length).toBeGreaterThanOrEqual(3);
  });

  it('does not include style guide section when styleGuide is undefined', () => {
    mockAssembleDocRefContext.mockReturnValue('');
    const result = assembleFullPrompt('prompt', []);
    expect(result).not.toContain('[GLOBAL STYLE GUIDE]');
  });

  it('does not include style guide section when styleGuide is empty string', () => {
    mockAssembleDocRefContext.mockReturnValue('');
    // Empty string is falsy, should not include style guide
    const result = assembleFullPrompt('prompt', [], '');
    expect(result).not.toContain('[GLOBAL STYLE GUIDE]');
  });

  it('passes docRefs to assembleDocRefContext', () => {
    mockAssembleDocRefContext.mockReturnValue('');
    const refs = [
      { path: 'a.md', heading: 'A', purpose: 'content' as const },
      { path: 'b.md', heading: 'B', purpose: 'style' as const },
    ];

    assembleFullPrompt('prompt', refs);
    expect(mockAssembleDocRefContext).toHaveBeenCalledWith(refs);
  });
});
