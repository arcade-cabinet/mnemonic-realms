/**
 * Tileset Table Parser
 *
 * Extracts tile rows from markdown sub-tables within a biome section.
 * The v2 tileset-spec.md has multiple sub-sections (Ground, Path, etc.)
 * each with their own table.
 */

function parseRow(line: string): string[] {
  return line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function parseTableBlock(tableLines: string[]): Record<string, string>[] {
  if (tableLines.length < 3) return [];
  const headers = parseRow(tableLines[0]);
  const rows: Record<string, string>[] = [];
  for (let r = 2; r < tableLines.length; r++) {
    const cells = parseRow(tableLines[r]);
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = cells[i] || '';
    });
    if (obj.ID) {
      rows.push(obj);
    }
  }
  return rows;
}

/** Collect all tile rows from all sub-tables within a biome section. */
export function collectBiomeTileRows(biomeSection: string): Record<string, string>[] {
  const lines = biomeSection.split('\n');
  const allRows: Record<string, string>[] = [];
  let tableLines: string[] = [];
  let inTable = false;

  for (const line of lines) {
    const isTableLine = line.trim().startsWith('|');
    if (isTableLine) {
      tableLines.push(line);
      inTable = true;
    } else if (inTable) {
      allRows.push(...parseTableBlock(tableLines));
      tableLines = [];
      inTable = false;
    }
  }

  if (inTable) {
    allRows.push(...parseTableBlock(tableLines));
  }

  return allRows;
}
