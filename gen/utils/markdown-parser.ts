/**
 * Markdown Section Parser
 *
 * Extracts content under specific headings from markdown files.
 * Used to resolve DocRef objects from the game bible.
 */

/**
 * Parse a markdown heading line into its level and text.
 * "### Biome: Village" -> { level: 3, text: "Biome: Village" }
 */
export function parseHeading(line: string): { level: number; text: string } | null {
  const match = line.match(/^(#{1,6})\s+(.+)$/);
  if (!match) return null;
  return { level: match[1].length, text: match[2].trim() };
}

/**
 * Extract a section from markdown content given a heading text.
 *
 * Finds the first heading whose text matches (case-insensitive, trimmed),
 * then captures everything until the next heading of the same or higher level.
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

  while (captured.length > 0 && captured[captured.length - 1].trim() === '') {
    captured.pop();
  }

  return captured.join('\n');
}

/**
 * Extract a markdown table as an array of row objects.
 *
 * Given:
 *   | Tile Type | Muted | Normal | Vivid |
 *   |-----------|-------|--------|-------|
 *   | Ground    | pale  | warm   | rich  |
 *
 * Returns: [{ 'Tile Type': 'Ground', 'Muted': 'pale', ... }]
 */
export function extractTable(markdown: string): Record<string, string>[] {
  const lines = markdown.split('\n').filter((l) => l.trim().startsWith('|'));
  if (lines.length < 3) return [];

  const parseRow = (line: string): string[] =>
    line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

  const headers = parseRow(lines[0]);
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
