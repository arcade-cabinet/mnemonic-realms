/** Builds item icon manifest from DDL data. */

import {
  DEFAULT_DOC_REFS,
  DIMENSIONS,
  MASTER_NEGATIVE_PROMPT,
  MASTER_STYLE_PROMPT,
} from '../config/index';
import type { ItemIconAsset, ItemIconManifest } from '../schemas/index';
import { loadItems } from './ddl-loader';
import { timestamp } from './manifest-io';

export function buildItemIconManifest(): ItemIconManifest {
  console.log('Building item icon manifest...');
  const allItems = loadItems();
  const weapons = allItems.filter((i) => i.category.startsWith('weapon'));
  const consumables = allItems.filter((i) => i.category === 'consumable');
  const fragments = allItems.filter((i) => i.category === 'memory-fragment');
  const assets: ItemIconAsset[] = [];
  const style = `${MASTER_STYLE_PROMPT}\n\n16-bit RPG item icon, 32x32 pixels.`;

  for (const wpn of weapons) {
    assets.push({
      id: wpn.id,
      name: wpn.name,
      category: wpn.category,
      appearance: wpn.desc,
      dimensions: DIMENSIONS.itemIcon,
      prompt: `${style} ${wpn.desc} Top-down, clean silhouette. SNES inventory icon.`,
      negativePrompt: `${MASTER_NEGATIVE_PROMPT}, text, hand holding weapon`,
      docRefs: [{ path: 'docs/design/items-catalog.md', heading: 'Weapons', purpose: 'content' }],
      filename: `${wpn.id.toLowerCase()}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  for (const item of consumables) {
    assets.push({
      id: item.id,
      name: item.name,
      category: 'consumable',
      appearance: item.desc,
      dimensions: DIMENSIONS.itemIcon,
      prompt: `${style} ${item.desc} Clean silhouette on transparent background.`,
      negativePrompt: `${MASTER_NEGATIVE_PROMPT}, text, hand`,
      docRefs: [
        { path: 'docs/design/items-catalog.md', heading: 'Consumables', purpose: 'content' },
      ],
      filename: `${item.id.toLowerCase()}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  for (const frag of fragments) {
    assets.push({
      id: frag.id,
      name: frag.name,
      category: 'memory-fragment',
      appearance: frag.desc,
      glowEffect: true,
      dimensions: DIMENSIONS.itemIcon,
      prompt: `${style} ${frag.desc} Distinct glow effect. Transparent background.`,
      negativePrompt: `${MASTER_NEGATIVE_PROMPT}, text, realistic crystal`,
      docRefs: [
        { path: 'docs/design/memory-system.md', heading: 'Memory Fragments', purpose: 'content' },
        { path: 'docs/design/visual-direction.md', heading: 'Particle Effects', purpose: 'style' },
      ],
      filename: `${frag.id.toLowerCase()}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  console.log(`  Total item icon assets: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Item icon generation manifest',
    updatedAt: timestamp(),
    styleGuide: `${MASTER_STYLE_PROMPT} Icons are 32x32, SNES-style.`,
    styleDocRefs: DEFAULT_DOC_REFS.globalStyle,
    assets,
  };
}
