/**
 * Default DocRef Sets
 *
 * Standard DocRef collections reused across many manifest entries.
 */

import type { DocRef } from '../schemas/index';

export const DEFAULT_DOC_REFS: Record<string, DocRef[]> = {
  /** Style context from visual-direction.md */
  globalStyle: [
    { path: 'docs/design/visual-direction.md', heading: 'Color Philosophy', purpose: 'style' },
    { path: 'docs/design/visual-direction.md', heading: 'Sprite Style', purpose: 'style' },
  ],
  /** Tile constraints from tileset-spec.md */
  tileRules: [
    { path: 'docs/design/tileset-spec.md', heading: 'Conventions', purpose: 'constraints' },
  ],
  /** Stagnation overlay reference */
  stagnation: [
    {
      path: 'docs/design/tileset-spec.md',
      heading: 'Overlay: Stagnation/Crystal',
      purpose: 'content',
    },
    { path: 'docs/design/visual-direction.md', heading: 'Color Philosophy', purpose: 'palette' },
  ],
};
