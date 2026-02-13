/**
 * DocRef Resolver
 *
 * Resolves DocRef objects by reading markdown files and extracting
 * content under specific headings. Bridge between game bible (docs/)
 * and the generation pipeline (gen/).
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { DocRef } from '../schemas/index';
import { extractSection, extractTable } from './markdown-parser';

const PROJECT_ROOT = resolve(
  import.meta.dirname ?? process.cwd(),
  import.meta.dirname ? '../..' : '.',
);

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

const PURPOSE_LABELS: Record<string, string> = {
  style: 'STYLE CONTEXT',
  content: 'CONTENT REFERENCE',
  constraints: 'TECHNICAL CONSTRAINTS',
  palette: 'COLOR PALETTE',
};

/**
 * Resolve multiple DocRefs and assemble them into labeled prompt sections.
 *
 * Groups by purpose and formats as:
 *   [STYLE CONTEXT -- path#heading]
 *   <resolved markdown>
 */
export function assembleDocRefContext(refs: DocRef[]): string {
  const sections: string[] = [];

  for (const ref of refs) {
    const content = resolveDocRef(ref);
    if (!content) continue;

    const label = PURPOSE_LABELS[ref.purpose] || ref.purpose.toUpperCase();
    sections.push(`[${label} — ${ref.path}#${ref.heading}]\n${content}`);
  }

  return sections.join('\n\n');
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
