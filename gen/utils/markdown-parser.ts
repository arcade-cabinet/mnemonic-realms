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
 * Find the best matching heading line index using tiered matching:
 *   1. Exact match (case-insensitive)
 *   2. Heading contains target as substring
 *   3. All significant words from target appear in heading
 */
function findBestHeadingMatch(lines: string[], target: string): number {
  // Pass 1: exact match
  for (let i = 0; i < lines.length; i++) {
    const h = parseHeading(lines[i]);
    if (h && h.text.toLowerCase().trim() === target) return i;
  }

  // Pass 2: heading contains target as substring (min 3 chars to avoid noise)
  if (target.length >= 3) {
    for (let i = 0; i < lines.length; i++) {
      const h = parseHeading(lines[i]);
      if (!h) continue;
      if (h.text.toLowerCase().trim().includes(target)) return i;
    }
  }

  // Pass 3: all significant words (3+ chars) from target found in heading
  const targetWords = target.split(/[\s:,\u2014\-()/]+/).filter((w) => w.length >= 3);
  if (targetWords.length >= 1) {
    for (let i = 0; i < lines.length; i++) {
      const h = parseHeading(lines[i]);
      if (!h) continue;
      const ht = h.text.toLowerCase();
      if (targetWords.every((w) => ht.includes(w))) return i;
    }
  }

  // Pass 4: partial keyword match — ≥75% of significant words found in heading
  // Catches cases like "Fortress Floor 1: Gallery of Moments" vs "Floor 1: The Gallery of Moments"
  if (targetWords.length >= 3) {
    const threshold = Math.ceil(targetWords.length * 0.75);
    let bestIdx = -1;
    let bestCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const h = parseHeading(lines[i]);
      if (!h) continue;
      const ht = h.text.toLowerCase();
      const matchCount = targetWords.filter((w) => ht.includes(w)).length;
      if (matchCount >= threshold && matchCount > bestCount) {
        bestCount = matchCount;
        bestIdx = i;
      }
    }
    if (bestIdx !== -1) return bestIdx;
  }

  return -1;
}

/**
 * Extract a section from markdown content given a heading text.
 *
 * Uses tiered matching: exact → substring → keyword.
 * Captures everything until the next heading of the same or higher level.
 */
export function extractSection(markdown: string, heading: string): string | null {
  const lines = markdown.split('\n');
  const target = heading.toLowerCase().trim();

  const matchIdx = findBestHeadingMatch(lines, target);
  if (matchIdx === -1) return null;

  const matchedHeading = parseHeading(lines[matchIdx])!;
  const captured: string[] = [lines[matchIdx]];

  for (let i = matchIdx + 1; i < lines.length; i++) {
    const h = parseHeading(lines[i]);
    if (h && h.level <= matchedHeading.level) break;
    captured.push(lines[i]);
  }

  while (captured.length > 0 && captured[captured.length - 1].trim() === '') {
    captured.pop();
  }

  return captured.length === 0 ? null : captured.join('\n');
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
