/** Assembles full prompts from base prompt + DocRefs + style guide. */

import type { DocRef } from '../schemas/index';
import { assembleDocRefContext } from '../utils/index';

/**
 * Build the full prompt for an asset by combining:
 * 1. The manifest's global style guide
 * 2. The asset's base prompt
 * 3. Resolved DocRef sections from the game bible
 */
export function assembleFullPrompt(
  basePrompt: string,
  docRefs: DocRef[],
  styleGuide?: string,
): string {
  const parts: string[] = [];

  if (styleGuide) {
    parts.push(`[GLOBAL STYLE GUIDE]\n${styleGuide}`);
  }

  parts.push(basePrompt);

  const docContext = assembleDocRefContext(docRefs);
  if (docContext) {
    parts.push(docContext);
  }

  return parts.join('\n\n');
}
