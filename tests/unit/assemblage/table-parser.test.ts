import { describe, expect, it } from 'vitest';
import {
  parseTable,
  parseTableUnderHeading,
  parseTables,
  extractSection,
  parseCoordinate,
  parseSize,
  parseLink,
  parseLinks,
  parseList,
  parseCoordinateRange,
  extractFrontmatter,
  parseFrontmatterSimple,
  parseFrontmatterFromMarkdown,
} from '../../../gen/assemblage/compiler/table-parser.ts';

describe('table-parser', () => {
  describe('parseTable', () => {
    it('parses a basic markdown table', () => {
      const md = `
| Name | Position | Type |
|------|----------|------|
| Artun | (19, 11) | quest-giver |
| Khali | (19, 17) | shopkeeper |
`;
      const rows = parseTable(md);
      expect(rows).toHaveLength(2);
      expect(rows[0]).toEqual({
        Name: 'Artun',
        Position: '(19, 11)',
        Type: 'quest-giver',
      });
      expect(rows[1]).toEqual({
        Name: 'Khali',
        Position: '(19, 17)',
        Type: 'shopkeeper',
      });
    });

    it('returns empty for no table', () => {
      expect(parseTable('Just some text')).toEqual([]);
    });

    it('stops at non-table line', () => {
      const md = `
| A | B |
|---|---|
| 1 | 2 |

Some text after
`;
      expect(parseTable(md)).toHaveLength(1);
    });

    it('preserves markdown links in cell text', () => {
      const md = `
| Building | Assemblage |
|----------|-----------|
| Khali's Curios | [house-red-small-1](../../catalog/house-red-small-1.md) |
`;
      const rows = parseTable(md);
      expect(rows[0].Assemblage).toBe(
        '[house-red-small-1](../../catalog/house-red-small-1.md)',
      );
    });
  });

  describe('parseTables', () => {
    it('finds all tables in markdown', () => {
      const md = `
## NPCs

| NPC | Position |
|-----|----------|
| Artun | (19, 11) |

## Events

| ID | Type |
|----|------|
| EV-01 | action |
| EV-02 | trigger |
`;
      const tables = parseTables(md);
      expect(tables).toHaveLength(2);
      expect(tables[0]).toHaveLength(1);
      expect(tables[1]).toHaveLength(2);
    });
  });

  describe('parseTableUnderHeading', () => {
    it('finds table under correct heading', () => {
      const md = `
## NPCs

| NPC | Position |
|-----|----------|
| Artun | (19, 11) |

## Events

| ID | Type |
|----|------|
| EV-01 | action |
`;
      const npcs = parseTableUnderHeading(md, 'NPCs');
      expect(npcs).toHaveLength(1);
      expect(npcs[0]['NPC']).toBe('Artun');

      const events = parseTableUnderHeading(md, 'Events');
      expect(events).toHaveLength(1);
      expect(events[0]['ID']).toBe('EV-01');
    });
  });

  describe('extractSection', () => {
    it('extracts content under heading', () => {
      const md = `
## Buildings

Some buildings text.

| Building | Size |
|----------|------|
| House | 4x3 |

## NPCs

NPC text.
`;
      const section = extractSection(md, 'Buildings');
      expect(section).toContain('Some buildings text');
      expect(section).toContain('House');
      expect(section).not.toContain('NPC text');
    });

    it('returns null for missing heading', () => {
      expect(extractSection('## Foo\nbar', 'Missing')).toBeNull();
    });
  });

  describe('parseCoordinate', () => {
    it('parses (x, y) format', () => {
      expect(parseCoordinate('(19, 11)')).toEqual({ x: 19, y: 11 });
    });

    it('parses x,y format without parens', () => {
      expect(parseCoordinate('19,11')).toEqual({ x: 19, y: 11 });
    });

    it('returns null for invalid', () => {
      expect(parseCoordinate('abc')).toBeNull();
    });
  });

  describe('parseSize', () => {
    it('parses WxH format', () => {
      expect(parseSize('6x5')).toEqual({ width: 6, height: 5 });
    });

    it('parses with spaces', () => {
      expect(parseSize('60 x 60')).toEqual({ width: 60, height: 60 });
    });
  });

  describe('parseLink', () => {
    it('parses basic link', () => {
      expect(parseLink('[Artun](../../story/characters.md)')).toEqual({
        text: 'Artun',
        path: '../../story/characters.md',
      });
    });

    it('parses link with anchor', () => {
      expect(parseLink('[Scene 1](../story/act1-script.md#scene-1)')).toEqual({
        text: 'Scene 1',
        path: '../story/act1-script.md',
        anchor: 'scene-1',
      });
    });

    it('returns null for no link', () => {
      expect(parseLink('plain text')).toBeNull();
    });
  });

  describe('parseLinks', () => {
    it('finds multiple links', () => {
      const text = 'See [A](a.md) and [B](b.md#sec)';
      const links = parseLinks(text);
      expect(links).toHaveLength(2);
      expect(links[0].text).toBe('A');
      expect(links[1].anchor).toBe('sec');
    });
  });

  describe('parseList', () => {
    it('splits comma-separated values', () => {
      expect(parseList('MQ-01, MQ-03, SQ-01')).toEqual(['MQ-01', 'MQ-03', 'SQ-01']);
    });
  });

  describe('parseCoordinateRange', () => {
    it('parses arrow range', () => {
      expect(parseCoordinateRange('(5,5) -> (30,20)')).toEqual({
        from: { x: 5, y: 5 },
        to: { x: 30, y: 20 },
      });
    });
  });

  describe('extractFrontmatter', () => {
    it('extracts YAML frontmatter', () => {
      const md = `---
id: everwick
type: town
---

# Everwick`;
      const result = extractFrontmatter(md);
      expect(result.frontmatter).toContain('id: everwick');
      expect(result.body).toContain('# Everwick');
    });

    it('returns null for no frontmatter', () => {
      const result = extractFrontmatter('# Just a heading');
      expect(result.frontmatter).toBeNull();
      expect(result.body).toBe('# Just a heading');
    });
  });

  describe('parseFrontmatterSimple (yaml library)', () => {
    it('parses simple key-value pairs', () => {
      const yaml = `id: everwick
type: town
vibrancy: 60`;
      const result = parseFrontmatterSimple(yaml);
      expect(result.id).toBe('everwick');
      expect(result.type).toBe('town');
      expect(result.vibrancy).toBe(60);
    });

    it('parses inline arrays', () => {
      const yaml = `size: [60, 60]
acts: [1, 2]`;
      const result = parseFrontmatterSimple(yaml);
      expect(result.size).toEqual([60, 60]);
      expect(result.acts).toEqual([1, 2]);
    });

    it('parses multi-line arrays of objects', () => {
      const yaml = `interiors:
  - id: everwick-khali
    template: shop-single
    keeper: khali
  - id: everwick-hark
    template: shop-single
    keeper: hark`;
      const result = parseFrontmatterSimple(yaml);
      const interiors = result.interiors as Record<string, unknown>[];
      expect(interiors).toHaveLength(2);
      expect(interiors[0].id).toBe('everwick-khali');
      expect(interiors[0].template).toBe('shop-single');
      expect(interiors[1].keeper).toBe('hark');
    });

    it('parses nested objects', () => {
      const yaml = `encounters:
  enemies: [E-SL-01, E-SL-02]
  levelRange: [1, 5]
  stepsBetween: 200`;
      const result = parseFrontmatterSimple(yaml);
      const enc = result.encounters as Record<string, unknown>;
      expect(enc.enemies).toEqual(['E-SL-01', 'E-SL-02']);
      expect(enc.levelRange).toEqual([1, 5]);
      expect(enc.stepsBetween).toBe(200);
    });

    it('parses booleans', () => {
      const yaml = `walled: false
dynamic: true`;
      const result = parseFrontmatterSimple(yaml);
      expect(result.walled).toBe(false);
      expect(result.dynamic).toBe(true);
    });

    it('parses quoted strings', () => {
      const yaml = `name: "Khali's Curios"`;
      const result = parseFrontmatterSimple(yaml);
      expect(result.name).toBe("Khali's Curios");
    });

    it('handles YAML anchors and aliases', () => {
      const yaml = `defaults: &defaults
  palette: village-premium
base:
  ref: *defaults`;
      const result = parseFrontmatterSimple(yaml);
      const defaults = result.defaults as Record<string, unknown>;
      const base = result.base as Record<string, unknown>;
      expect(defaults.palette).toBe('village-premium');
      expect(base.ref).toEqual({ palette: 'village-premium' });
    });

    it('returns empty object for null/invalid input', () => {
      expect(parseFrontmatterSimple('')).toEqual({});
      expect(parseFrontmatterSimple('null')).toEqual({});
    });
  });

  describe('parseFrontmatterFromMarkdown', () => {
    it('extracts and parses in one call', () => {
      const md = `---
id: everwick
type: town
size: [60, 60]
interiors:
  - id: everwick-khali
    template: shop-single
---

# Everwick

The eternal settlement.

## Buildings

| Building | Position |
|----------|----------|
| House | (18, 16) |
`;
      const { data, body } = parseFrontmatterFromMarkdown(md);
      expect(data.id).toBe('everwick');
      expect(data.type).toBe('town');
      expect(data.size).toEqual([60, 60]);
      expect((data.interiors as any[])[0].id).toBe('everwick-khali');
      expect(body).toContain('# Everwick');
      expect(body).toContain('| House |');
    });

    it('returns empty data for no frontmatter', () => {
      const { data, body } = parseFrontmatterFromMarkdown('# Just a heading');
      expect(data).toEqual({});
      expect(body).toBe('# Just a heading');
    });
  });
});
