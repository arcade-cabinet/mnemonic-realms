/**
 * Utils — Barrel Export
 *
 * Markdown parsing, DocRef resolution, and table extraction utilities.
 */

export { assembleDocRefContext, resolveDocRef, resolveDocRefTable } from './docref-resolver';
export { extractSection, extractTable, parseHeading } from './markdown-parser';
