/** Named NPC and template sprite assets from DDL. */

import { DIMENSIONS, MASTER_NEGATIVE_PROMPT, SPRITE_STYLE } from '../config/index';
import type { SpritesheetAsset } from '../schemas/index';
import { loadNpcs } from './ddl-loader';

export function buildNpcSprites(): SpritesheetAsset[] {
  const allNpcs = loadNpcs();
  const named = allNpcs.filter((n) => n.type === 'named');
  const templates = allNpcs.filter((n) => n.type === 'template');

  const namedAssets: SpritesheetAsset[] = named.map((npc) => ({
    id: `sprite-npc-${npc.id}`,
    name: npc.name,
    category: 'npc' as const,
    appearance: npc.desc,
    spriteSize: '32x32' as const,
    animations: { walk: true, idle: true, attack: false, cast: false, hit: false, death: false },
    dimensions: DIMENSIONS.spriteWalk,
    prompt:
      `${SPRITE_STYLE.npc}\n\n16-bit RPG named NPC spritesheet. ` +
      `96x160 (3x5 of 32x32). Rows 1-4: walk. Row 5: idle. ${npc.desc}`,
    negativePrompt: MASTER_NEGATIVE_PROMPT,
    docRefs: [
      {
        path: 'docs/design/spritesheet-spec.md',
        heading: npc.heading,
        purpose: 'content' as const,
      },
      {
        path: 'docs/design/spritesheet-spec.md',
        heading: 'Named NPC Sprites (5 Characters)',
        purpose: 'style' as const,
      },
    ],
    filename: `sprite_npc_${npc.id}.png`,
    format: 'png' as const,
    status: 'pending',
  }));

  const templateAssets: SpritesheetAsset[] = templates.map((npt) => ({
    id: `sprite-npt-${npt.id}`,
    name: npt.name,
    category: 'npc' as const,
    appearance: npt.desc,
    spriteSize: '32x32' as const,
    animations: { walk: true, idle: true, attack: false, cast: false, hit: false, death: false },
    dimensions: DIMENSIONS.spriteWalk,
    prompt:
      `${SPRITE_STYLE.npc}\n\n16-bit RPG NPC template spritesheet. ` +
      `96x160 (3x5 of 32x32). Rows 1-4: walk. Row 5: idle. ${npt.desc}`,
    negativePrompt: MASTER_NEGATIVE_PROMPT,
    docRefs: [
      {
        path: 'docs/design/spritesheet-spec.md',
        heading: npt.heading,
        purpose: 'content' as const,
      },
      {
        path: 'docs/design/spritesheet-spec.md',
        heading: 'NPC Template Sprites (6 Types)',
        purpose: 'style' as const,
      },
    ],
    filename: `sprite_npc_${npt.id}.png`,
    format: 'png' as const,
    status: 'pending',
  }));

  return [...namedAssets, ...templateAssets];
}
