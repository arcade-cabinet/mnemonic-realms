/** Builds UI element manifest from DDL data. */

import {
  DEFAULT_DOC_REFS,
  DIMENSIONS,
  MASTER_NEGATIVE_PROMPT,
  MASTER_STYLE_PROMPT,
} from '../config/index';
import type { UIElementAsset, UIElementManifest } from '../schemas/index';
import { loadUIElements, loadUIElementsMeta } from './ddl-loader';
import { timestamp } from './manifest-io';

const TYPE_DIMENSIONS: Record<string, (typeof DIMENSIONS)[keyof typeof DIMENSIONS]> = {
  'dialogue-frame': DIMENSIONS.dialogueFrame,
  'battle-frame': DIMENSIONS.battleFrame,
  'menu-background': DIMENSIONS.menuBackground,
  'title-background': DIMENSIONS.titleBackground,
  'window-border': DIMENSIONS.windowBorder,
  button: DIMENSIONS.button,
  'hud-element': DIMENSIONS.hudElement,
};

export function buildUIElementManifest(): UIElementManifest {
  console.log('Building UI element manifest...');
  const entries = loadUIElements();
  const meta = loadUIElementsMeta();
  const assets: UIElementAsset[] = [];
  const style = `${MASTER_STYLE_PROMPT}\n\nGame UI element, pixel art style.`;

  for (const entry of entries) {
    const dims = TYPE_DIMENSIONS[entry.type];
    if (!dims) {
      console.warn(`  Unknown UI type: ${entry.type}, skipping ${entry.id}`);
      continue;
    }

    const nineSlice = entry.nineSlice ?? false;
    const nineSlicePrompt = nineSlice
      ? ' 9-slice tileable border panel. Symmetric edges and corners.'
      : '';

    assets.push({
      id: entry.id,
      name: entry.name,
      type: entry.type,
      appearance: entry.desc,
      nineSlice,
      ...(nineSlice ? { nineSlicePadding: meta.nineSlicePadding } : {}),
      dimensions: dims,
      prompt: `${style} ${entry.desc}${nineSlicePrompt} ${meta.styleNote}`,
      negativePrompt: `${MASTER_NEGATIVE_PROMPT}, text, modern UI, flat design, gradient mesh`,
      docRefs: [
        { path: 'docs/design/visual-direction.md', heading: 'UI Design', purpose: 'style' },
      ],
      filename: `${entry.id.toLowerCase()}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  console.log(`  Total UI element assets: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'UI element generation manifest',
    updatedAt: timestamp(),
    styleGuide: `${MASTER_STYLE_PROMPT} UI elements use parchment/leather aesthetic with warm tones.`,
    styleDocRefs: DEFAULT_DOC_REFS.globalStyle,
    assets,
  };
}
