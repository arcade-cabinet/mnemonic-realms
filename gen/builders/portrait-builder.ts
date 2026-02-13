/** Builds portrait manifest from DDL data. */

import {
  DEFAULT_DOC_REFS,
  DIMENSIONS,
  MASTER_NEGATIVE_PROMPT,
  MASTER_STYLE_PROMPT,
  PALETTE,
} from '../config/index';
import type { PortraitAsset, PortraitManifest } from '../schemas/index';
import { loadPortraits, loadPortraitsMeta } from './ddl-loader';
import { timestamp } from './manifest-io';

export function buildPortraitManifest(): PortraitManifest {
  console.log('Building portrait manifest...');
  const allChars = loadPortraits();
  const meta = loadPortraitsMeta();
  const characters = allChars.filter((c) => c.type === 'named');
  const gods = allChars.filter((c) => c.type === 'god');
  const assets: PortraitAsset[] = [];

  for (const char of characters) {
    for (const expr of meta.expressions) {
      assets.push({
        id: `portrait-${char.id}-${expr}`,
        characterId: char.id,
        name: char.name,
        type: char.type,
        expression: expr,
        appearance: char.appearance,
        dimensions: DIMENSIONS.portrait,
        prompt:
          `${MASTER_STYLE_PROMPT}\n\n16-bit JRPG portrait, head and shoulders. ` +
          `${expr} expression. ${char.appearance} SNES-era, 128x128 pixels.`,
        negativePrompt: `${MASTER_NEGATIVE_PROMPT}, full body, action pose`,
        docRefs: [
          ...(char.heading
            ? [
                {
                  path: 'docs/story/characters.md',
                  heading: char.heading,
                  purpose: 'content' as const,
                },
              ]
            : []),
          { path: 'docs/design/visual-direction.md', heading: 'Sprite Style', purpose: 'style' },
        ],
        filename: `${char.id}-${expr}.png`,
        format: 'png',
        status: 'pending',
      });
    }
  }

  for (const god of gods) {
    assets.push({
      id: `portrait-god-${god.id}`,
      characterId: god.id,
      name: god.name,
      type: 'god',
      expression: 'neutral',
      appearance: god.appearance,
      dimensions: DIMENSIONS.portrait,
      prompt:
        `${MASTER_STYLE_PROMPT}\n\n16-bit JRPG dormant god portrait. ` +
        `${god.appearance} Memory-amber (${PALETTE.memoryEnergy}) accents.`,
      negativePrompt: `${MASTER_NEGATIVE_PROMPT}, human face, realistic`,
      docRefs: [{ path: 'docs/world/dormant-gods.md', heading: god.name, purpose: 'content' }],
      filename: `god-${god.id}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  console.log(`  Total portrait assets: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Character portrait generation manifest',
    updatedAt: timestamp(),
    styleGuide: `${MASTER_STYLE_PROMPT} Portraits are 16-bit JRPG style.`,
    styleDocRefs: DEFAULT_DOC_REFS.globalStyle,
    assets,
  };
}
