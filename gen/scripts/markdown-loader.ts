/**
 * Markdown Section Loader
 *
 * Resolves DocRef objects by reading markdown files and extracting
 * content under specific headings. This is the bridge between the
 * game bible (docs/) and the generation pipeline (gen/).
 *
 * Algorithm:
 * 1. Read the markdown file at DocRef.path
 * 2. Find the heading matching DocRef.heading (case-insensitive)
 * 3. Extract all content until the next heading of same or higher level
 * 4. Return the extracted section as a string
 *
 * The generation script uses this to assemble rich prompts from bible sections.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { DocRef } from '../schemas/index';

const PROJECT_ROOT = resolve(import.meta.dirname ?? process.cwd(), import.meta.dirname ? '../..' : '.');

/**
 * Parse a markdown heading line into its level and text.
 * "### Biome: Village" → { level: 3, text: "Biome: Village" }
 */
function parseHeading(line: string): { level: number; text: string } | null {
  const match = line.match(/^(#{1,6})\s+(.+)$/);
  if (!match) return null;
  return { level: match[1].length, text: match[2].trim() };
}

/**
 * Extract a section from markdown content given a heading text.
 *
 * Finds the first heading whose text matches (case-insensitive, trimmed),
 * then captures everything until the next heading of the same or higher level.
 *
 * Returns the heading line + all content below it.
 */
export function extractSection(markdown: string, heading: string): string | null {
  const lines = markdown.split('\n');
  const targetHeading = heading.toLowerCase().trim();

  let capturing = false;
  let capturedLevel = 0;
  const captured: string[] = [];

  for (const line of lines) {
    const parsed = parseHeading(line);

    if (capturing) {
      // Stop at next heading of same or higher level
      if (parsed && parsed.level <= capturedLevel) {
        break;
      }
      captured.push(line);
    } else if (parsed && parsed.text.toLowerCase().trim() === targetHeading) {
      capturing = true;
      capturedLevel = parsed.level;
      captured.push(line);
    }
  }

  if (captured.length === 0) return null;

  // Trim trailing blank lines
  while (captured.length > 0 && captured[captured.length - 1].trim() === '') {
    captured.pop();
  }

  return captured.join('\n');
}

/**
 * Resolve a single DocRef into its markdown content.
 * Returns null if the file doesn't exist or the heading isn't found.
 */
export function resolveDocRef(ref: DocRef): string | null {
  const filePath = join(PROJECT_ROOT, ref.path);

  if (!existsSync(filePath)) {
    console.warn(`  DocRef warning: file not found: ${ref.path}`);
    return null;
  }

  const content = readFileSync(filePath, 'utf-8');
  const section = extractSection(content, ref.heading);

  if (!section) {
    console.warn(`  DocRef warning: heading "${ref.heading}" not found in ${ref.path}`);
    return null;
  }

  return section;
}

/**
 * Resolve multiple DocRefs and assemble them into labeled prompt sections.
 *
 * Groups by purpose (style, content, constraints, palette) and formats as:
 *   [STYLE CONTEXT]
 *   <resolved markdown>
 *
 *   [CONTENT REFERENCE]
 *   <resolved markdown>
 *
 * This assembled text is appended to the base prompt for generation.
 */
export function assembleDocRefContext(refs: DocRef[]): string {
  const purposeLabels: Record<string, string> = {
    style: 'STYLE CONTEXT',
    content: 'CONTENT REFERENCE',
    constraints: 'TECHNICAL CONSTRAINTS',
    palette: 'COLOR PALETTE',
  };

  const sections: string[] = [];

  for (const ref of refs) {
    const content = resolveDocRef(ref);
    if (!content) continue;

    const label = purposeLabels[ref.purpose] || ref.purpose.toUpperCase();
    sections.push(`[${label} — ${ref.path}#${ref.heading}]\n${content}`);
  }

  return sections.join('\n\n');
}

/**
 * Extract a markdown table as an array of row objects.
 * Useful for parsing tile swap tables, stat tables, etc.
 *
 * Given:
 *   | Tile Type | Muted | Normal | Vivid |
 *   |-----------|-------|--------|-------|
 *   | Ground    | pale  | warm   | rich  |
 *
 * Returns: [{ 'Tile Type': 'Ground', 'Muted': 'pale', 'Normal': 'warm', 'Vivid': 'rich' }]
 */
export function extractTable(markdown: string): Record<string, string>[] {
  const lines = markdown.split('\n').filter((l) => l.trim().startsWith('|'));
  if (lines.length < 3) return []; // Need header + separator + at least 1 row

  const parseRow = (line: string): string[] =>
    line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

  const headers = parseRow(lines[0]);
  // Skip separator line (lines[1])
  const rows = lines.slice(2);

  return rows.map((row) => {
    const cells = parseRow(row);
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = cells[i] || '';
    });
    return obj;
  });
}

/**
 * Resolve a DocRef and extract its table data.
 * Combines resolveDocRef + extractTable for convenience.
 */
export function resolveDocRefTable(ref: DocRef): Record<string, string>[] {
  const section = resolveDocRef(ref);
  if (!section) return [];
  return extractTable(section);
}
