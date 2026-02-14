/**
 * Sprite aliases — map alternate graphic IDs used in events to citizen sprite assets.
 *
 * Two categories:
 * 1. Legacy aliases: old NPC names (npc_lira, npc_callum, etc.) → citizen sprites
 *    These keep existing event files working until they're migrated to citizen names.
 * 2. Variant aliases: special states/roles (npc_hana_frozen, god_cantara, etc.)
 */

import { Animation, Direction, Spritesheet } from '@rpgjs/client';

// ---------------------------------------------------------------------------
// Shared helpers (same logic as generated.ts)
// ---------------------------------------------------------------------------
const dirRow = (dir: number, rowsPerDir: number): number =>
  ({
    [Direction.Down]: 0,
    [Direction.Left]: rowsPerDir,
    [Direction.Right]: rowsPerDir * 2,
    [Direction.Up]: rowsPerDir * 3,
  })[dir] ?? 0;

const CHAR_ROWS = 31;
const CHAR_ROWS_PER_DIR = 4;

function makeAliasSprite(id: string, image: any) {
  // Spritesheet() decorator returns void — must capture class ref separately
  class Sprite {}
  Spritesheet({
    id,
    image,
    framesWidth: 4,
    framesHeight: CHAR_ROWS,
    width: 4 * 16,
    height: CHAR_ROWS * 16,
    textures: {
      [Animation.Stand]: {
        animations: (dir: number) => [
          [{ time: 0, frameX: 0, frameY: dirRow(dir, CHAR_ROWS_PER_DIR) }],
        ],
      },
      [Animation.Walk]: {
        animations: (dir: number) => [
          [
            { time: 0, frameX: 0, frameY: dirRow(dir, CHAR_ROWS_PER_DIR) },
            { time: 5, frameX: 1, frameY: dirRow(dir, CHAR_ROWS_PER_DIR) },
            { time: 10, frameX: 2, frameY: dirRow(dir, CHAR_ROWS_PER_DIR) },
            { time: 15, frameX: 3, frameY: dirRow(dir, CHAR_ROWS_PER_DIR) },
            { time: 20 },
          ],
        ],
      },
    },
  })(Sprite);
  return Sprite;
}

// ---------------------------------------------------------------------------
// Image imports
// ---------------------------------------------------------------------------
const IMG_HANA = require('../../../assets/sprites/npcs/citizens/female/Hana/Hana.png');
const IMG_ARTUN = require('../../../assets/sprites/npcs/citizens/male/Artun/Artun.png');
const IMG_GRYM = require('../../../assets/sprites/npcs/citizens/male/Grym/Grym.png');
const IMG_KHALI = require('../../../assets/sprites/npcs/citizens/female/Khali/Khali.png');
const IMG_HARK = require('../../../assets/sprites/npcs/citizens/male/Hark/Hark.png');
const IMG_NYRO = require('../../../assets/sprites/npcs/citizens/male/Nyro/Nyro.png');
const IMG_NEL = require('../../../assets/sprites/npcs/citizens/female/Nel/Nel.png');
const IMG_JANIK = require('../../../assets/sprites/npcs/citizens/male/Janik/Janik.png');
const IMG_JULZ = require('../../../assets/sprites/npcs/citizens/female/Julz/Julz.png');
const IMG_REZA = require('../../../assets/sprites/npcs/citizens/male/Reza/Reza.png');
const IMG_VASH = require('../../../assets/sprites/npcs/citizens/female/Vash/Vash.png');
const IMG_MEZA = require('../../../assets/sprites/npcs/citizens/female/Meza/Meza.png');
const IMG_SEZA = require('../../../assets/sprites/npcs/citizens/female/Seza/Seza.png');

// ---------------------------------------------------------------------------
// Legacy aliases: old NPC names → citizen sprites (backwards compat for events)
// ---------------------------------------------------------------------------
const LegacyLiraSprite = makeAliasSprite('npc_lira', IMG_HANA);
const LegacyCallumSprite = makeAliasSprite('npc_callum', IMG_ARTUN);
const LegacyCuratorSprite = makeAliasSprite('npc_curator', IMG_GRYM);
const LegacyMarenSprite = makeAliasSprite('npc_maren', IMG_KHALI);
const LegacyTorvanSprite = makeAliasSprite('npc_torvan', IMG_HARK);
const LegacyRenSprite = makeAliasSprite('npc_ren', IMG_NYRO);
const LegacyPetraSprite = makeAliasSprite('npc_petra', IMG_NEL);
const LegacyAricSprite = makeAliasSprite('npc_aric', IMG_JANIK);
const LegacyElynSprite = makeAliasSprite('npc_elyn', IMG_JULZ);
const LegacySolenSprite = makeAliasSprite('npc_solen', IMG_REZA);
const LegacyWynnSprite = makeAliasSprite('npc_wynn', IMG_VASH);

// ---------------------------------------------------------------------------
// Variant aliases: special states and roles
// ---------------------------------------------------------------------------
const NpcPreserverScoutF1Sprite = makeAliasSprite('npc_preserver_scout_f1', IMG_REZA);
const NpcRidgewalkerScoutSprite = makeAliasSprite('npc_ridgewalker_scout', IMG_HARK);
const NpcRidgewalkerElderSprite = makeAliasSprite('npc_ridgewalker_elder', IMG_GRYM);
const NpcChildF1Sprite = makeAliasSprite('npc_child_f1', IMG_JULZ);
const NpcFrozenFestivalGoerSprite = makeAliasSprite('npc_frozen_festival_goer', IMG_MEZA);
const NpcGhostF1Sprite = makeAliasSprite('npc_ghost_f1', IMG_SEZA);
const NpcRootwalkerEchoSprite = makeAliasSprite('npc_rootwalker_echo', IMG_HANA);
const NpcHanaFrozenSprite = makeAliasSprite('npc_hana_frozen', IMG_HANA);
const LegacyLiraFrozenSprite = makeAliasSprite('npc_lira_frozen', IMG_HANA);
const GodCantaraSprite = makeAliasSprite('god_cantara', IMG_NYRO);

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const aliasSprites = [
  // Legacy named NPC aliases
  LegacyLiraSprite,
  LegacyCallumSprite,
  LegacyCuratorSprite,
  LegacyMarenSprite,
  LegacyTorvanSprite,
  LegacyRenSprite,
  LegacyPetraSprite,
  LegacyAricSprite,
  LegacyElynSprite,
  LegacySolenSprite,
  LegacyWynnSprite,
  // Variant aliases
  NpcPreserverScoutF1Sprite,
  NpcRidgewalkerScoutSprite,
  NpcRidgewalkerElderSprite,
  NpcChildF1Sprite,
  NpcFrozenFestivalGoerSprite,
  NpcGhostF1Sprite,
  NpcRootwalkerEchoSprite,
  NpcHanaFrozenSprite,
  LegacyLiraFrozenSprite,
  GodCantaraSprite,
];
