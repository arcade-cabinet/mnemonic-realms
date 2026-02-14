/**
 * Sprite aliases -- map alternate graphic IDs used in events to existing sprite assets.
 * These reuse purchased citizen PNGs from assets/sprites/ with different RPG-JS sprite IDs.
 */

import { Spritesheet, Animation, Direction } from '@rpgjs/client';

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
  return Spritesheet({
    id,
    image,
    framesWidth: 4,
    framesHeight: CHAR_ROWS,
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
  })(class {});
}

// ---------------------------------------------------------------------------
// Image imports for alias targets
// ---------------------------------------------------------------------------
const IMG_REZA = require('../../../assets/sprites/npcs/citizens/male/Reza/Reza.png');
const IMG_HARK = require('../../../assets/sprites/npcs/citizens/male/Hark/Hark.png');
const IMG_GRYM = require('../../../assets/sprites/npcs/citizens/male/Grym/Grym.png');
const IMG_JULZ = require('../../../assets/sprites/npcs/citizens/female/Julz/Julz.png');
const IMG_MEZA = require('../../../assets/sprites/npcs/citizens/female/Meza/Meza.png');
const IMG_SEZA = require('../../../assets/sprites/npcs/citizens/female/Seza/Seza.png');
const IMG_HANA = require('../../../assets/sprites/npcs/citizens/female/Hana/Hana.png');
const IMG_NYRO = require('../../../assets/sprites/npcs/citizens/male/Nyro/Nyro.png');

// ---------------------------------------------------------------------------
// Alias sprite definitions
// ---------------------------------------------------------------------------

// npc_preserver_scout_f1 -> Reza (preserver scout, female alias)
const NpcPreserverScoutF1Sprite = makeAliasSprite('npc_preserver_scout_f1', IMG_REZA);

// npc_ridgewalker_scout -> Hark (ridgewalker scout variant)
const NpcRidgewalkerScoutSprite = makeAliasSprite('npc_ridgewalker_scout', IMG_HARK);

// npc_ridgewalker_elder -> Grym (ridgewalker elder variant)
const NpcRidgewalkerElderSprite = makeAliasSprite('npc_ridgewalker_elder', IMG_GRYM);

// npc_child_f1 -> Julz (same as npc_child_01)
const NpcChildF1Sprite = makeAliasSprite('npc_child_f1', IMG_JULZ);

// npc_frozen_festival_goer -> Meza (villager at frozen festival)
const NpcFrozenFestivalGoerSprite = makeAliasSprite('npc_frozen_festival_goer', IMG_MEZA);

// npc_ghost_f1 -> Seza (ghostly female villager)
const NpcGhostF1Sprite = makeAliasSprite('npc_ghost_f1', IMG_SEZA);

// npc_rootwalker_echo -> Hana (audiomancer echo)
const NpcRootwalkerEchoSprite = makeAliasSprite('npc_rootwalker_echo', IMG_HANA);

// npc_lira_frozen -> Hana (Lira in frozen state)
const NpcLiraFrozenSprite = makeAliasSprite('npc_lira_frozen', IMG_HANA);

// god_cantara -> Nyro (audiomancer as god avatar)
const GodCantaraSprite = makeAliasSprite('god_cantara', IMG_NYRO);

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const aliasSprites = [
  NpcPreserverScoutF1Sprite,
  NpcRidgewalkerScoutSprite,
  NpcRidgewalkerElderSprite,
  NpcChildF1Sprite,
  NpcFrozenFestivalGoerSprite,
  NpcGhostF1Sprite,
  NpcRootwalkerEchoSprite,
  NpcLiraFrozenSprite,
  GodCantaraSprite,
];
