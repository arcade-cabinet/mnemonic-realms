/** Enemy and boss sprites from catalog. */

import { DIMENSIONS, MASTER_NEGATIVE_PROMPT, SPRITE_STYLE } from '../config/index';
import type { SpritesheetAsset } from '../schemas/index';
import { slugify } from './manifest-io';

const ENEMIES_PATH = 'docs/design/enemies-catalog.md';

function extractSection(catalog: string, start: number): string {
  const next = catalog.indexOf('\n### ', start + 1);
  return next === -1 ? catalog.slice(start) : catalog.slice(start, next);
}

export function buildEnemiesFromCatalog(catalog: string): SpritesheetAsset[] {
  const assets: SpritesheetAsset[] = [];
  const flavorRe = /\*\*Flavor\*\*: (.+)/;
  const spawnRe = /\*\*Spawn zone\*\*: (.+)/;

  for (const m of catalog.matchAll(/^### (E-\w+-\d+): (.+)$/gm)) {
    const [, eid, name] = m;
    const sec = extractSection(catalog, m.index ?? 0);
    const flavor = sec.match(flavorRe)?.[1] || '';
    const spawn = sec.match(spawnRe)?.[1] || '';
    const isPres = eid.startsWith('E-PR') || eid.startsWith('E-PA') || eid.startsWith('E-PV');
    assets.push({
      id: `sprite-enemy-${slugify(eid)}`,
      name,
      category: isPres ? 'preserver' : 'enemy',
      appearance: flavor,
      spriteSize: '32x32',
      animations: { walk: false, idle: true, attack: true, cast: false, hit: true, death: true },
      dimensions: DIMENSIONS.spriteWalk,
      prompt:
        `${SPRITE_STYLE.enemy}\n\n16-bit RPG enemy spritesheet. ` +
        `96x128 (3x4 of 32x32). "${name}". ${flavor} Spawn: ${spawn}.`,
      negativePrompt: MASTER_NEGATIVE_PROMPT,
      docRefs: [
        { path: ENEMIES_PATH, heading: `${eid}: ${name}`, purpose: 'content' },
        {
          path: 'docs/design/spritesheet-spec.md',
          heading: 'Enemy Sprites (34 Types)',
          purpose: 'style',
        },
      ],
      filename: `sprite_enemy_${slugify(eid)}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  for (const m of catalog.matchAll(/^### (B-\d+): (.+)$/gm)) {
    const [, bid, name] = m;
    const sec = extractSection(catalog, m.index ?? 0);
    const flavor = sec.match(flavorRe)?.[1] || '';
    assets.push({
      id: `sprite-boss-${slugify(bid)}`,
      name,
      category: 'boss',
      appearance: flavor,
      spriteSize: '64x64',
      animations: { walk: false, idle: true, attack: true, cast: false, hit: true, death: true },
      dimensions: DIMENSIONS.spriteBoss,
      prompt:
        `${SPRITE_STYLE.boss}\n\n16-bit RPG boss spritesheet. ` +
        `192x448 (3x7 of 64x64). "${name}". ${flavor} Imposing silhouette.`,
      negativePrompt: MASTER_NEGATIVE_PROMPT,
      docRefs: [
        { path: ENEMIES_PATH, heading: `${bid}: ${name}`, purpose: 'content' },
        {
          path: 'docs/design/spritesheet-spec.md',
          heading: 'Boss Sprites (10 Encounters)',
          purpose: 'style',
        },
      ],
      filename: `sprite_boss_${slugify(bid)}.png`,
      format: 'png',
      status: 'pending',
    });
  }

  return assets;
}
