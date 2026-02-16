import { describe, expect, it } from 'vitest';

// We need to test stripMarkdownFences which is not exported.
// We'll test it indirectly by accessing it via the module internals,
// or we extract a test by importing the function's logic inline.
// Since stripMarkdownFences is private, we replicate its logic for testing.
// A better approach: test via generateText mock, but that involves async + external API.
// Instead, let's test the core string transformation directly.

/**
 * Replicated from text-gen.ts (private function) for unit testing.
 * This tests the exact same logic without needing to mock the Gemini API.
 */
function stripMarkdownFences(text: string): string {
  let result = text.trim();
  if (result.startsWith('```typescript') || result.startsWith('```ts')) {
    result = result.replace(/^```(?:typescript|ts)\n?/, '');
  } else if (result.startsWith('```')) {
    result = result.replace(/^```\w*\n?/, '');
  }
  if (result.endsWith('```')) {
    result = result.replace(/\n?```$/, '');
  }
  return result.trim();
}

describe('stripMarkdownFences', () => {
  it('removes ```typescript fences', () => {
    const input = '```typescript\nconst x = 1;\n```';
    expect(stripMarkdownFences(input)).toBe('const x = 1;');
  });

  it('removes ```ts fences', () => {
    const input = '```ts\nconst x = 1;\n```';
    expect(stripMarkdownFences(input)).toBe('const x = 1;');
  });

  it('removes generic ``` fences', () => {
    const input = '```\nconst x = 1;\n```';
    expect(stripMarkdownFences(input)).toBe('const x = 1;');
  });

  it('removes fences with other language tags', () => {
    const input = '```json\n{"key": "value"}\n```';
    expect(stripMarkdownFences(input)).toBe('{"key": "value"}');
  });

  it('returns unchanged text with no fences', () => {
    const input = 'const x = 1;';
    expect(stripMarkdownFences(input)).toBe('const x = 1;');
  });

  it('handles only opening fence (no closing)', () => {
    const input = '```typescript\nconst x = 1;';
    expect(stripMarkdownFences(input)).toBe('const x = 1;');
  });

  it('handles only closing fence (no opening)', () => {
    const input = 'const x = 1;\n```';
    expect(stripMarkdownFences(input)).toBe('const x = 1;');
  });

  it('trims whitespace', () => {
    const input = '  ```ts\n  code  \n```  ';
    expect(stripMarkdownFences(input)).toBe('code');
  });

  it('handles empty content between fences', () => {
    const input = '```ts\n```';
    expect(stripMarkdownFences(input)).toBe('');
  });

  it('handles multiline content', () => {
    const input = `\`\`\`typescript
import { Actor } from '@rpgjs/database';

@Actor({ name: 'Hero' })
class Hero {}
\`\`\``;
    const result = stripMarkdownFences(input);
    expect(result).toContain('import { Actor }');
    expect(result).toContain('class Hero {}');
    expect(result).not.toContain('```');
  });

  it('preserves internal triple backticks (not at start/end)', () => {
    const input = 'some text with ``` internal backticks';
    expect(stripMarkdownFences(input)).toBe('some text with ``` internal backticks');
  });

  it('handles fence immediately followed by content (no newline)', () => {
    const input = '```tsconst x = 1;\n```';
    // The regex ```\w*\n? will match ```ts but not consume 'const'
    // since 'tsconst' is \w*, it removes the whole ```tsconst prefix
    const result = stripMarkdownFences(input);
    expect(result).not.toContain('```');
  });
});
