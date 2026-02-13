import { describe, expect, it } from 'vitest';
import { extractSection, extractTable, parseHeading } from './markdown-parser';

describe('parseHeading', () => {
  it('parses h1 heading', () => {
    expect(parseHeading('# Title')).toEqual({ level: 1, text: 'Title' });
  });

  it('parses h2 heading', () => {
    expect(parseHeading('## Subtitle')).toEqual({ level: 2, text: 'Subtitle' });
  });

  it('parses h3 heading', () => {
    expect(parseHeading('### Section')).toEqual({ level: 3, text: 'Section' });
  });

  it('parses h6 heading', () => {
    expect(parseHeading('###### Deep')).toEqual({ level: 6, text: 'Deep' });
  });

  it('trims heading text', () => {
    expect(parseHeading('## Biome: Village  ')).toEqual({ level: 2, text: 'Biome: Village' });
  });

  it('returns null for non-heading lines', () => {
    expect(parseHeading('Not a heading')).toBeNull();
    expect(parseHeading('')).toBeNull();
    expect(parseHeading('  ## Indented')).toBeNull();
  });

  it('returns null for missing space after hashes', () => {
    expect(parseHeading('##NoSpace')).toBeNull();
  });

  it('returns null for more than 6 hashes', () => {
    expect(parseHeading('####### Too deep')).toBeNull();
  });
});

describe('extractSection', () => {
  const doc = `# Main Title

Some intro text.

## Section A

Content of section A.

More A content.

### Subsection A1

Nested content.

## Section B

Content of section B.

### Subsection B1

B1 content.
`;

  it('extracts a top-level section', () => {
    const result = extractSection(doc, 'Section A');
    expect(result).toContain('## Section A');
    expect(result).toContain('Content of section A.');
    expect(result).toContain('More A content.');
    expect(result).toContain('### Subsection A1');
    expect(result).toContain('Nested content.');
  });

  it('stops at next same-level heading', () => {
    const result = extractSection(doc, 'Section A');
    expect(result).not.toContain('Section B');
  });

  it('extracts nested subsection', () => {
    const result = extractSection(doc, 'Subsection A1');
    expect(result).toContain('### Subsection A1');
    expect(result).toContain('Nested content.');
    expect(result).not.toContain('Section B');
  });

  it('extracts last section (no trailing heading)', () => {
    const result = extractSection(doc, 'Subsection B1');
    expect(result).toContain('B1 content.');
  });

  it('matches case-insensitively', () => {
    const result = extractSection(doc, 'SECTION A');
    expect(result).toContain('## Section A');
  });

  it('matches with leading/trailing whitespace in query', () => {
    const result = extractSection(doc, '  Section A  ');
    expect(result).toContain('## Section A');
  });

  it('returns null when heading not found', () => {
    expect(extractSection(doc, 'Nonexistent')).toBeNull();
  });

  it('returns null for empty content', () => {
    expect(extractSection('', 'anything')).toBeNull();
  });

  it('trims trailing blank lines', () => {
    const result = extractSection(doc, 'Section B');
    expect(result).not.toMatch(/\n\s*$/);
  });

  it('includes the heading line itself', () => {
    const result = extractSection(doc, 'Section A');
    expect(result?.startsWith('## Section A')).toBe(true);
  });

  it('stops at higher-level heading', () => {
    const deeper = `# Top
## Parent
### Child
Content
# New Top`;
    const result = extractSection(deeper, 'Child');
    expect(result).toContain('Content');
    expect(result).not.toContain('New Top');
  });

  it('h1 section captures until next h1', () => {
    // h1 is the highest level, so only another h1 can stop it.
    // In this doc there's no second h1, so it captures everything.
    const result = extractSection(doc, 'Main Title');
    expect(result).toContain('# Main Title');
    expect(result).toContain('Some intro text.');
    expect(result).toContain('## Section A');
  });

  it('h1 section stops at next h1', () => {
    const twoH1s = `# First

First content.

# Second

Second content.`;
    const result = extractSection(twoH1s, 'First');
    expect(result).toContain('First content.');
    expect(result).not.toContain('Second content.');
  });
});

describe('extractTable', () => {
  it('extracts a markdown table into row objects', () => {
    const md = `| Name | Type | Level |
|------|------|-------|
| Goblin | Enemy | 1 |
| Orc | Enemy | 5 |`;

    const result = extractTable(md);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ Name: 'Goblin', Type: 'Enemy', Level: '1' });
    expect(result[1]).toEqual({ Name: 'Orc', Type: 'Enemy', Level: '5' });
  });

  it('handles cells with varied spacing', () => {
    const md = `|  Name  |Type|  Level  |
|--------|-----|---------|
|  Slime |Blob |  2  |`;

    const result = extractTable(md);
    expect(result[0]).toEqual({ Name: 'Slime', Type: 'Blob', Level: '2' });
  });

  it('returns empty array for no table', () => {
    expect(extractTable('No table here.')).toEqual([]);
  });

  it('returns empty array for table with only headers (no data rows)', () => {
    const md = `| Name | Type |
|------|------|`;
    expect(extractTable(md)).toEqual([]);
  });

  it('handles missing cells with empty strings', () => {
    const md = `| A | B | C |
|---|---|---|
| 1 |   |   |`;

    const result = extractTable(md);
    expect(result[0]).toEqual({ A: '1', B: '', C: '' });
  });

  it('ignores non-table lines in markdown', () => {
    const md = `Some text

| Col1 | Col2 |
|------|------|
| a | b |

More text`;

    const result = extractTable(md);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ Col1: 'a', Col2: 'b' });
  });
});
