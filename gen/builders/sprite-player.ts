/** Player class sprite assets from DDL data. */

import { DIMENSIONS, MASTER_NEGATIVE_PROMPT, SPRITE_STYLE } from '../config/index';
import type { SpritesheetAsset } from '../schemas/index';
import { loadPlayerClasses } from './ddl-loader';

export function buildPlayerSprites(): SpritesheetAsset[] {
  const classes = loadPlayerClasses();
  return classes.map((cls) => ({
    id: `sprite-player-${cls.id}`,
    name: cls.name,
    category: 'player' as const,
    appearance: `${cls.name} class hero. ${cls.accent}. Color: ${cls.color}.`,
    colorAccent: cls.color,
    silhouetteNote: cls.accent,
    spriteSize: '32x32' as const,
    animations: { walk: true, idle: true, attack: true, cast: true, hit: true, death: true },
    dimensions: DIMENSIONS.spriteWalk,
    prompt:
      `${SPRITE_STYLE.player}\n\n16-bit RPG ${cls.name} spritesheet. ` +
      `96x256 (3x8 of 32x32). Rows 1-4: walk, Row 5: idle, Row 6: attack, ` +
      `Row 7: cast, Row 8: hit/death. ${cls.accent}. Palette: ${cls.color}.`,
    negativePrompt: MASTER_NEGATIVE_PROMPT,
    docRefs: [
      {
        path: 'docs/design/spritesheet-spec.md',
        heading: cls.heading,
        purpose: 'content' as const,
      },
      {
        path: 'docs/design/spritesheet-spec.md',
        heading: 'Player Character Sprites (4 Classes)',
        purpose: 'style' as const,
      },
      {
        path: 'docs/design/visual-direction.md',
        heading: 'Player Characters',
        purpose: 'style' as const,
      },
    ],
    filename: `sprite_player_${cls.id}.png`,
    format: 'png' as const,
    status: 'pending',
  }));
}
