/**
 * Markdown Table & Frontmatter Parser
 *
 * Uses remark (AST) for table parsing and yaml library for frontmatter.
 * Domain-specific value parsers handle game data formats:
 * - Coordinate strings: (19, 11) → { x: 19, y: 11 }
 * - Markdown links: [text](path) → { text, path }
 * - Comma-separated lists: "MQ-01, MQ-03" → ["MQ-01", "MQ-03"]
 * - Size strings: "6x5" → { width: 6, height: 5 }
 *
 * Used by the markdown world compiler and assemblage parser.
 */

import type { Heading, TableRow as MdastTableRow, Root, Table, TableCell, Text } from 'mdast';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { parse as parseYaml } from 'yaml';

// --- Parsed value types ---

export interface Coordinate {
  x: number;
  y: number;
}

export interface MarkdownLink {
  text: string;
  path: string;
  anchor?: string;
}

export interface SizeSpec {
  width: number;
  height: number;
}

export interface TableRow {
  [column: string]: string;
}

// --- AST helpers ---

const parser = remark().use(remarkGfm);

function parseAst(markdown: string): Root {
  return parser.parse(markdown);
}

function cellText(cell: TableCell): string {
  return cell.children
    .map((child) => {
      if (child.type === 'text') return (child as Text).value;
      if (child.type === 'link') {
        const linkText = child.children.map((c) => ('value' in c ? c.value : '')).join('');
        return `[${linkText}](${child.url})`;
      }
      if ('value' in child) return child.value as string;
      return '';
    })
    .join('')
    .trim();
}

function tableToRows(table: Table): TableRow[] {
  if (table.children.length < 2) return [];

  const headerRow = table.children[0];
  const headers = headerRow.children.map(cellText);

  return table.children.slice(1).map((row: MdastTableRow) => {
    const record: TableRow = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = row.children[j] ? cellText(row.children[j]) : '';
    }
    return record;
  });
}

// --- Table parsing ---

/**
 * Parse the first markdown table into an array of row objects keyed by column header.
 * Returns empty array if no table found.
 */
export function parseTable(markdown: string): TableRow[] {
  const ast = parseAst(markdown);
  const table = ast.children.find((n): n is Table => n.type === 'table');
  if (!table) return [];
  return tableToRows(table);
}

/**
 * Parse the first table under a specific heading.
 */
export function parseTableUnderHeading(markdown: string, heading: string): TableRow[] {
  const section = extractSection(markdown, heading);
  if (!section) return [];
  return parseTable(section);
}

/**
 * Parse ALL tables in a markdown string.
 */
export function parseTables(markdown: string): TableRow[][] {
  const ast = parseAst(markdown);
  return ast.children.filter((n): n is Table => n.type === 'table').map(tableToRows);
}

// --- Section extraction ---

/**
 * Extract the content under a heading (## or ### level).
 * Stops at the next heading of equal or higher level.
 *
 * Uses AST for heading detection but returns raw markdown text
 * (since downstream parsers need the original table formatting).
 */
export function extractSection(markdown: string, headingText: string): string | null {
  const lines = markdown.split('\n');
  let capturing = false;
  let capturedLevel = 0;
  const captured: string[] = [];

  for (const line of lines) {
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = hMatch[2].trim();

      if (normalizeHeading(text) === normalizeHeading(headingText)) {
        capturing = true;
        capturedLevel = level;
        continue;
      }

      if (capturing && level <= capturedLevel) {
        break;
      }
    }

    if (capturing) {
      captured.push(line);
    }
  }

  const result = captured.join('\n').trim();
  return result || null;
}

// --- Value parsers ---

/**
 * Parse a coordinate string like "(19, 11)" or "19,11" into {x, y}.
 */
export function parseCoordinate(value: string): Coordinate | null {
  const match = value.match(/\(?\s*(\d+)\s*,\s*(\d+)\s*\)?/);
  if (!match) return null;
  return { x: parseInt(match[1], 10), y: parseInt(match[2], 10) };
}

/**
 * Parse a size string like "6x5" or "60 x 60" into {width, height}.
 */
export function parseSize(value: string): SizeSpec | null {
  const match = value.match(/(\d+)\s*[x]\s*(\d+)/i);
  if (!match) return null;
  return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
}

/**
 * Parse a markdown link like "[text](path)" or "[text](path#anchor)".
 */
export function parseLink(value: string): MarkdownLink | null {
  const match = value.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!match) return null;

  const path = match[2];
  const anchorIdx = path.indexOf('#');

  if (anchorIdx >= 0) {
    return {
      text: match[1],
      path: path.slice(0, anchorIdx),
      anchor: path.slice(anchorIdx + 1),
    };
  }

  return { text: match[1], path };
}

/**
 * Parse all markdown links in a string.
 */
export function parseLinks(value: string): MarkdownLink[] {
  const links: MarkdownLink[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null = regex.exec(value);

  while (match !== null) {
    const path = match[2];
    const anchorIdx = path.indexOf('#');

    if (anchorIdx >= 0) {
      links.push({
        text: match[1],
        path: path.slice(0, anchorIdx),
        anchor: path.slice(anchorIdx + 1),
      });
    } else {
      links.push({ text: match[1], path });
    }
    match = regex.exec(value);
  }

  return links;
}

/**
 * Parse a comma-separated list of values.
 */
export function parseList(value: string): string[] {
  return value
    .split(/,\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Try to parse a value as a number. Returns the number or the original string.
 */
export function parseNumeric(value: string): number | string {
  const trimmed = value.trim();
  const num = Number(trimmed);
  return !isNaN(num) && trimmed.length > 0 ? num : trimmed;
}

/**
 * Parse a coordinate range string like "(5,5) to (30,20)" or "x1,y1 -> x2,y2".
 */
export function parseCoordinateRange(value: string): { from: Coordinate; to: Coordinate } | null {
  const match = value.match(
    /\(?\s*(\d+)\s*,\s*(\d+)\s*\)?\s*(?:->|to)\s*\(?\s*(\d+)\s*,\s*(\d+)\s*\)?/i,
  );
  if (!match) return null;
  return {
    from: { x: parseInt(match[1], 10), y: parseInt(match[2], 10) },
    to: { x: parseInt(match[3], 10), y: parseInt(match[4], 10) },
  };
}

// --- YAML frontmatter ---

/**
 * Extract YAML frontmatter from a markdown file.
 * Returns the raw YAML string (without --- delimiters) and the body after it.
 */
export function extractFrontmatter(markdown: string): {
  frontmatter: string | null;
  body: string;
} {
  const trimmed = markdown.trimStart();
  if (!trimmed.startsWith('---')) {
    return { frontmatter: null, body: markdown };
  }

  const endIdx = trimmed.indexOf('---', 3);
  if (endIdx < 0) {
    return { frontmatter: null, body: markdown };
  }

  return {
    frontmatter: trimmed.slice(3, endIdx).trim(),
    body: trimmed.slice(endIdx + 3).trim(),
  };
}

/**
 * Parse YAML frontmatter string into a typed record using the yaml library.
 * Handles all YAML features: nested objects, arrays of objects, anchors, etc.
 */
export function parseFrontmatterSimple(yamlStr: string): Record<string, unknown> {
  const result = parseYaml(yamlStr);
  if (result == null || typeof result !== 'object' || Array.isArray(result)) {
    return {};
  }
  return result as Record<string, unknown>;
}

/**
 * Convenience: extract + parse frontmatter in one call.
 * Returns parsed data and the markdown body.
 */
export function parseFrontmatterFromMarkdown(markdown: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const { frontmatter, body } = extractFrontmatter(markdown);
  const data = frontmatter ? parseFrontmatterSimple(frontmatter) : {};
  return { data, body };
}

// --- Helpers ---

function normalizeHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}
