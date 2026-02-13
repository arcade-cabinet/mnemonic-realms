/** Orchestrates spritesheet manifest building from DDLs + catalog. */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEFAULT_DOC_REFS, SPRITE_STYLE } from '../config/index';
import type { SpritesheetManifest } from '../schemas/index';
import { PROJECT_ROOT, timestamp } from './manifest-io';
import { buildEnemiesFromCatalog } from './sprite-enemies';
import { buildNpcSprites } from './sprite-npc';
import { buildPlayerSprites } from './sprite-player';

export function buildSpritesheetManifest(): SpritesheetManifest {
  console.log('Building spritesheet manifest...');
  const assets = [...buildPlayerSprites(), ...buildNpcSprites()];

  try {
    const catalog = readFileSync(resolve(PROJECT_ROOT, 'docs/design/enemies-catalog.md'), 'utf-8');
    const enemies = buildEnemiesFromCatalog(catalog);
    assets.push(...enemies);
    console.log(`  Auto-extracted ${enemies.length} enemies/bosses`);
  } catch {
    /* no catalog yet */
  }

  console.log(`  Total sprite assets: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Character and enemy spritesheet manifest',
    updatedAt: timestamp(),
    styleGuide: SPRITE_STYLE.player,
    styleDocRefs: [
      ...DEFAULT_DOC_REFS.globalStyle,
      { path: 'docs/design/spritesheet-spec.md', heading: 'Overview', purpose: 'style' },
    ],
    assets,
  };
}
