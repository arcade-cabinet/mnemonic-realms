/**
 * Auto-generated spritesheet bindings for purchased pixel art. DO NOT hand-edit.
 *
 * Sprite formats:
 *   - Characters/NPCs (64x496): 4 cols x 31 rows @ 16x16, walk rows 0/4/8/12
 *   - Small enemies (64x128): 4 cols x 8 rows @ 16x16, walk rows 0/2/4/6
 *   - Medium enemies (64x224): 4 cols x 14 rows @ 16x16, walk rows 0/2/4/6
 *   - Boss dragon (2304x96): 24 frames @ 96x96, single horizontal strip
 */

import { Spritesheet, Animation, Direction } from '@rpgjs/client';

// ---------------------------------------------------------------------------
// Helper: direction -> walk-row offset for multi-direction sheets
// ---------------------------------------------------------------------------
const dirRow = (dir: number, rowsPerDir: number): number =>
  ({
    [Direction.Down]: 0,
    [Direction.Left]: rowsPerDir,
    [Direction.Right]: rowsPerDir * 2,
    [Direction.Up]: rowsPerDir * 3,
  })[dir] ?? 0;

// ---------------------------------------------------------------------------
// Factory: 4-column walk/stand sprite (characters, NPCs, enemies)
// ---------------------------------------------------------------------------
function makeWalkSprite(
  id: string,
  image: any,
  totalRows: number,
  rowsPerDir: number,
) {
  return Spritesheet({
    id,
    image,
    framesWidth: 4,
    framesHeight: totalRows,
    textures: {
      [Animation.Stand]: {
        animations: (dir: number) => [
          [{ time: 0, frameX: 0, frameY: dirRow(dir, rowsPerDir) }],
        ],
      },
      [Animation.Walk]: {
        animations: (dir: number) => [
          [
            { time: 0, frameX: 0, frameY: dirRow(dir, rowsPerDir) },
            { time: 5, frameX: 1, frameY: dirRow(dir, rowsPerDir) },
            { time: 10, frameX: 2, frameY: dirRow(dir, rowsPerDir) },
            { time: 15, frameX: 3, frameY: dirRow(dir, rowsPerDir) },
            { time: 20 },
          ],
        ],
      },
    },
  })(class {});
}

// ---------------------------------------------------------------------------
// Factory: boss horizontal strip (single row, 96x96 frames)
// ---------------------------------------------------------------------------
function makeBossSprite(id: string, image: any, totalFrames: number) {
  const frames: { time: number; frameX?: number; frameY?: number }[] = [];
  for (let i = 0; i < totalFrames; i++) {
    frames.push({ time: i * 5, frameX: i, frameY: 0 });
  }
  frames.push({ time: totalFrames * 5 });

  return Spritesheet({
    id,
    image,
    framesWidth: totalFrames,
    framesHeight: 1,
    textures: {
      [Animation.Stand]: {
        animations: () => [frames],
      },
      [Animation.Walk]: {
        animations: () => [frames],
      },
    },
  })(class {});
}

// ===========================================================================
//  Image imports (require for RPG-JS Vite plugin)
// ===========================================================================

// Players
const IMG_PLAYER_KNIGHT = require('../../../assets/sprites/players/warriors/caped_warrior_16x16.png');
const IMG_PLAYER_MAGE = require('../../../assets/sprites/players/mages/Mage_Hooded_BROWN.png');
const IMG_PLAYER_ROGUE = require('../../../assets/sprites/players/rogues/Hooded_Rogue_Non-Combat_Daggers_Equipped.png');
const IMG_PLAYER_CLERIC = require('../../../assets/sprites/players/mages/Mage_Fem_Red.png');

// Named NPC citizens — female
const IMG_HANA = require('../../../assets/sprites/npcs/citizens/female/Hana/Hana.png');
const IMG_JULZ = require('../../../assets/sprites/npcs/citizens/female/Julz/Julz.png');
const IMG_KHALI = require('../../../assets/sprites/npcs/citizens/female/Khali/Khali.png');
const IMG_MEZA = require('../../../assets/sprites/npcs/citizens/female/Meza/Meza.png');
const IMG_NEL = require('../../../assets/sprites/npcs/citizens/female/Nel/Nel.png');
const IMG_SEZA = require('../../../assets/sprites/npcs/citizens/female/Seza/Seza.png');
const IMG_VASH = require('../../../assets/sprites/npcs/citizens/female/Vash/Vash.png');

// Named NPC citizens — male
const IMG_ARTUN = require('../../../assets/sprites/npcs/citizens/male/Artun/Artun.png');
const IMG_GRYM = require('../../../assets/sprites/npcs/citizens/male/Grym/Grym.png');
const IMG_HARK = require('../../../assets/sprites/npcs/citizens/male/Hark/Hark.png');
const IMG_JANIK = require('../../../assets/sprites/npcs/citizens/male/Janik/Janik.png');
const IMG_NYRO = require('../../../assets/sprites/npcs/citizens/male/Nyro/Nyro.png');
const IMG_REZA = require('../../../assets/sprites/npcs/citizens/male/Reza/Reza.png');
const IMG_SEREK = require('../../../assets/sprites/npcs/citizens/male/Serek/Serek.png');

// Guards
const IMG_GUARD_SWORDSMAN = require('../../../assets/sprites/npcs/guards/Guard_Swordsman.png');
const IMG_GUARD_SPEARMAN = require('../../../assets/sprites/npcs/guards/Guard_Spearman.png');
const IMG_GUARD_ARCHER = require('../../../assets/sprites/npcs/guards/Guard_Archer_Non-Combat.png');

// Enemies
const IMG_SLIME = require('../../../assets/sprites/enemies/slime.png');
const IMG_ORC_SOLDIER = require('../../../assets/sprites/enemies/orc_soldier.png');
const IMG_ORC_CHAMPION = require('../../../assets/sprites/enemies/orc_champion.png');
const IMG_GOBLIN = require('../../../assets/sprites/enemies/goblin.png');
const IMG_SKELLY = require('../../../assets/sprites/enemies/skelly.png');
const IMG_SKELLY_ARCHER = require('../../../assets/sprites/enemies/skelly_archer.png');
const IMG_MUMMY = require('../../../assets/sprites/enemies/mummy.png');
const IMG_ZOMBIE_BURSTER = require('../../../assets/sprites/enemies/zombie_burster.png');
const IMG_WRAITH = require('../../../assets/sprites/enemies/wraith.png');

// Bosses
const IMG_DRAGON_WALK = require('../../../assets/sprites/bosses/green-dragon/dragon_WALK_green.png');

// ===========================================================================
//  Sprite definitions — 64x496 character sheets (31 rows, 4 rows per dir)
// ===========================================================================
const CHAR_ROWS = 31;
const CHAR_ROWS_PER_DIR = 4;

// ---- Players ----
const PlayerKnightSprite = makeWalkSprite('sprite-player-knight', IMG_PLAYER_KNIGHT, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const PlayerMageSprite = makeWalkSprite('sprite-player-mage', IMG_PLAYER_MAGE, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const PlayerRogueSprite = makeWalkSprite('sprite-player-rogue', IMG_PLAYER_ROGUE, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const PlayerClericSprite = makeWalkSprite('sprite-player-cleric', IMG_PLAYER_CLERIC, CHAR_ROWS, CHAR_ROWS_PER_DIR);

// ---- Named NPCs ----
// Hana -> npc_lira | Artun -> npc_callum | Grym -> npc_curator | Khali -> npc_maren
// Hark -> npc_torvan | Nyro -> npc_ren | Nel -> npc_petra | Janik -> npc_aric
// Julz -> npc_elyn | Reza -> npc_solen | Vash -> npc_wynn
const NpcLiraSprite = makeWalkSprite('npc_lira', IMG_HANA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcCallumSprite = makeWalkSprite('npc_callum', IMG_ARTUN, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcCuratorSprite = makeWalkSprite('npc_curator', IMG_GRYM, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcMarenSprite = makeWalkSprite('npc_maren', IMG_KHALI, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcTorvanSprite = makeWalkSprite('npc_torvan', IMG_HARK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcRenSprite = makeWalkSprite('npc_ren', IMG_NYRO, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcPetraSprite = makeWalkSprite('npc_petra', IMG_NEL, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcAricSprite = makeWalkSprite('npc_aric', IMG_JANIK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcElynSprite = makeWalkSprite('npc_elyn', IMG_JULZ, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcSolenSprite = makeWalkSprite('npc_solen', IMG_REZA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcWynnSprite = makeWalkSprite('npc_wynn', IMG_VASH, CHAR_ROWS, CHAR_ROWS_PER_DIR);

// ---- Template NPCs (reuse citizen sprites) ----
const NpcVillagerSprite = makeWalkSprite('npc_villager', IMG_MEZA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcVillagerM1Sprite = makeWalkSprite('npc_villager_m1', IMG_SEREK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcVillagerF1Sprite = makeWalkSprite('npc_villager_f1', IMG_SEZA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcVillagerM2Sprite = makeWalkSprite('npc_villager_m2', IMG_NYRO, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcVillagerM3Sprite = makeWalkSprite('npc_villager_m3', IMG_HARK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcVillagerM4Sprite = makeWalkSprite('npc_villager_m4', IMG_REZA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcVillagerF2Sprite = makeWalkSprite('npc_villager_f2', IMG_VASH, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcMerchantSprite = makeWalkSprite('npc_merchant', IMG_GRYM, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcMerchantM1Sprite = makeWalkSprite('npc_merchant_m1', IMG_JANIK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcMerchantM2Sprite = makeWalkSprite('npc_merchant_m2', IMG_SEREK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcFarmerSprite = makeWalkSprite('npc_farmer', IMG_ARTUN, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcFarmerM1Sprite = makeWalkSprite('npc_farmer_m1', IMG_HARK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcFarmerF1Sprite = makeWalkSprite('npc_farmer_f1', IMG_KHALI, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcFarmerM2Sprite = makeWalkSprite('npc_farmer_m2', IMG_REZA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcScholarSprite = makeWalkSprite('npc_scholar', IMG_NYRO, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcGuardSprite = makeWalkSprite('npc_guard', IMG_GUARD_SWORDSMAN, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcGuardM1Sprite = makeWalkSprite('npc_guard_m1', IMG_GUARD_SPEARMAN, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcGuardM2Sprite = makeWalkSprite('npc_guard_m2', IMG_GUARD_ARCHER, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcChildSprite = makeWalkSprite('npc_child', IMG_NEL, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcChild01Sprite = makeWalkSprite('npc_child_01', IMG_JULZ, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcElderF1Sprite = makeWalkSprite('npc_elder_f1', IMG_SEZA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcElderM1Sprite = makeWalkSprite('npc_elder_m1', IMG_GRYM, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcElderM2Sprite = makeWalkSprite('npc_elder_m2', IMG_ARTUN, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcFisherM1Sprite = makeWalkSprite('npc_fisher_m1', IMG_SEREK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcInnkeeperF1Sprite = makeWalkSprite('npc_innkeeper_f1', IMG_MEZA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcKeeperF1Sprite = makeWalkSprite('npc_keeper_f1', IMG_KHALI, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcResearcherF1Sprite = makeWalkSprite('npc_researcher_f1', IMG_HANA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcRidgewalkerM1Sprite = makeWalkSprite('npc_ridgewalker_m1', IMG_HARK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcRidgewalkerM2Sprite = makeWalkSprite('npc_ridgewalker_m2', IMG_JANIK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcRidgewalkerF1Sprite = makeWalkSprite('npc_ridgewalker_f1', IMG_VASH, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcShopkeepF1Sprite = makeWalkSprite('npc_shopkeep_f1', IMG_NEL, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcShopkeepF2Sprite = makeWalkSprite('npc_shopkeep_f2', IMG_JULZ, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcWoodcutterM1Sprite = makeWalkSprite('npc_woodcutter_m1', IMG_ARTUN, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcWoodcutterM2Sprite = makeWalkSprite('npc_woodcutter_m2', IMG_REZA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcWoodcutterF1Sprite = makeWalkSprite('npc_woodcutter_f1', IMG_SEZA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcAudiomancerM1Sprite = makeWalkSprite('npc_audiomancer_m1', IMG_NYRO, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcAudiomancerM2Sprite = makeWalkSprite('npc_audiomancer_m2', IMG_SEREK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcAudiomancerF1Sprite = makeWalkSprite('npc_audiomancer_f1', IMG_HANA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcAudiomancerF2Sprite = makeWalkSprite('npc_audiomancer_f2', IMG_MEZA, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcPreserverCaptainSprite = makeWalkSprite('npc_preserver_captain', IMG_JANIK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcPreserverAgentSprite = makeWalkSprite('npc_preserver_agent', IMG_HARK, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcPreserverEliteSprite = makeWalkSprite('npc_preserver_elite', IMG_GRYM, CHAR_ROWS, CHAR_ROWS_PER_DIR);
const NpcPreserverScoutSprite = makeWalkSprite('npc_preserver_scout', IMG_REZA, CHAR_ROWS, CHAR_ROWS_PER_DIR);

// ===========================================================================
//  Enemies — small (64x128, 8 rows, 2 rows per direction)
// ===========================================================================
const SMALL_ROWS = 8;
const SMALL_ROWS_PER_DIR = 2;

// Slimes (e-sl-01 through e-sl-08) -> slime.png
const EnemyESl01Sprite = makeWalkSprite('sprite-enemy-e-sl-01', IMG_SLIME, SMALL_ROWS, SMALL_ROWS_PER_DIR);
const EnemyESl02Sprite = makeWalkSprite('sprite-enemy-e-sl-02', IMG_SLIME, SMALL_ROWS, SMALL_ROWS_PER_DIR);
const EnemyESl03Sprite = makeWalkSprite('sprite-enemy-e-sl-03', IMG_SLIME, SMALL_ROWS, SMALL_ROWS_PER_DIR);
const EnemyESl04Sprite = makeWalkSprite('sprite-enemy-e-sl-04', IMG_SLIME, SMALL_ROWS, SMALL_ROWS_PER_DIR);
const EnemyESl05Sprite = makeWalkSprite('sprite-enemy-e-sl-05', IMG_SLIME, SMALL_ROWS, SMALL_ROWS_PER_DIR);
const EnemyESl06Sprite = makeWalkSprite('sprite-enemy-e-sl-06', IMG_SLIME, SMALL_ROWS, SMALL_ROWS_PER_DIR);
const EnemyESl07Sprite = makeWalkSprite('sprite-enemy-e-sl-07', IMG_SLIME, SMALL_ROWS, SMALL_ROWS_PER_DIR);
const EnemyESl08Sprite = makeWalkSprite('sprite-enemy-e-sl-08', IMG_SLIME, SMALL_ROWS, SMALL_ROWS_PER_DIR);

// ===========================================================================
//  Enemies — medium (64x224, 14 rows, 2 rows per direction for walk)
// ===========================================================================
const MED_ROWS = 14;
const MED_ROWS_PER_DIR = 2;

// Frontier orcs (e-fr-01..05) -> orc_soldier, (e-fr-06..08) -> orc_champion, (e-fr-09..11) -> goblin
const EnemyEFr01Sprite = makeWalkSprite('sprite-enemy-e-fr-01', IMG_ORC_SOLDIER, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEFr02Sprite = makeWalkSprite('sprite-enemy-e-fr-02', IMG_ORC_SOLDIER, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEFr03Sprite = makeWalkSprite('sprite-enemy-e-fr-03', IMG_ORC_SOLDIER, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEFr04Sprite = makeWalkSprite('sprite-enemy-e-fr-04', IMG_ORC_SOLDIER, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEFr05Sprite = makeWalkSprite('sprite-enemy-e-fr-05', IMG_ORC_SOLDIER, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEFr06Sprite = makeWalkSprite('sprite-enemy-e-fr-06', IMG_ORC_CHAMPION, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEFr07Sprite = makeWalkSprite('sprite-enemy-e-fr-07', IMG_ORC_CHAMPION, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEFr08Sprite = makeWalkSprite('sprite-enemy-e-fr-08', IMG_ORC_CHAMPION, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEFr09Sprite = makeWalkSprite('sprite-enemy-e-fr-09', IMG_GOBLIN, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEFr10Sprite = makeWalkSprite('sprite-enemy-e-fr-10', IMG_GOBLIN, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEFr11Sprite = makeWalkSprite('sprite-enemy-e-fr-11', IMG_GOBLIN, MED_ROWS, MED_ROWS_PER_DIR);

// Skeletons (e-sk-01..03) -> skelly, (e-sk-04..06) -> skelly_archer
const EnemyESk01Sprite = makeWalkSprite('sprite-enemy-e-sk-01', IMG_SKELLY, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyESk02Sprite = makeWalkSprite('sprite-enemy-e-sk-02', IMG_SKELLY, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyESk03Sprite = makeWalkSprite('sprite-enemy-e-sk-03', IMG_SKELLY, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyESk04Sprite = makeWalkSprite('sprite-enemy-e-sk-04', IMG_SKELLY_ARCHER, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyESk05Sprite = makeWalkSprite('sprite-enemy-e-sk-05', IMG_SKELLY_ARCHER, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyESk06Sprite = makeWalkSprite('sprite-enemy-e-sk-06', IMG_SKELLY_ARCHER, MED_ROWS, MED_ROWS_PER_DIR);

// Deep enemies (e-dp-01..02) -> mummy, (e-dp-03..05) -> zombie_burster
const EnemyEDp01Sprite = makeWalkSprite('sprite-enemy-e-dp-01', IMG_MUMMY, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEDp02Sprite = makeWalkSprite('sprite-enemy-e-dp-02', IMG_MUMMY, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEDp03Sprite = makeWalkSprite('sprite-enemy-e-dp-03', IMG_ZOMBIE_BURSTER, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEDp04Sprite = makeWalkSprite('sprite-enemy-e-dp-04', IMG_ZOMBIE_BURSTER, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEDp05Sprite = makeWalkSprite('sprite-enemy-e-dp-05', IMG_ZOMBIE_BURSTER, MED_ROWS, MED_ROWS_PER_DIR);

// Preserver wraiths (e-pv-01..04) -> wraith
const EnemyEPv01Sprite = makeWalkSprite('sprite-enemy-e-pv-01', IMG_WRAITH, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEPv02Sprite = makeWalkSprite('sprite-enemy-e-pv-02', IMG_WRAITH, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEPv03Sprite = makeWalkSprite('sprite-enemy-e-pv-03', IMG_WRAITH, MED_ROWS, MED_ROWS_PER_DIR);
const EnemyEPv04Sprite = makeWalkSprite('sprite-enemy-e-pv-04', IMG_WRAITH, MED_ROWS, MED_ROWS_PER_DIR);

// ===========================================================================
//  Bosses — dragon horizontal strip (2304x96 = 24 frames @ 96x96)
// ===========================================================================
const DRAGON_FRAMES = 24;

const BossB01Sprite = makeBossSprite('sprite-boss-b-01', IMG_DRAGON_WALK, DRAGON_FRAMES);
const BossB02Sprite = makeBossSprite('sprite-boss-b-02', IMG_DRAGON_WALK, DRAGON_FRAMES);
const BossB03Sprite = makeBossSprite('sprite-boss-b-03', IMG_DRAGON_WALK, DRAGON_FRAMES);
const BossB04Sprite = makeBossSprite('sprite-boss-b-04', IMG_DRAGON_WALK, DRAGON_FRAMES);
const BossB05Sprite = makeBossSprite('sprite-boss-b-05', IMG_DRAGON_WALK, DRAGON_FRAMES);

// ===========================================================================
//  Export all sprites for client module registration
// ===========================================================================
export const generatedSprites = [
  // Players
  PlayerKnightSprite,
  PlayerMageSprite,
  PlayerRogueSprite,
  PlayerClericSprite,
  // Named NPCs
  NpcLiraSprite,
  NpcCallumSprite,
  NpcCuratorSprite,
  NpcMarenSprite,
  NpcTorvanSprite,
  NpcRenSprite,
  NpcPetraSprite,
  NpcAricSprite,
  NpcElynSprite,
  NpcSolenSprite,
  NpcWynnSprite,
  // Template NPCs
  NpcVillagerSprite,
  NpcVillagerM1Sprite,
  NpcVillagerF1Sprite,
  NpcVillagerM2Sprite,
  NpcVillagerM3Sprite,
  NpcVillagerM4Sprite,
  NpcVillagerF2Sprite,
  NpcMerchantSprite,
  NpcMerchantM1Sprite,
  NpcMerchantM2Sprite,
  NpcFarmerSprite,
  NpcFarmerM1Sprite,
  NpcFarmerF1Sprite,
  NpcFarmerM2Sprite,
  NpcScholarSprite,
  NpcGuardSprite,
  NpcGuardM1Sprite,
  NpcGuardM2Sprite,
  NpcChildSprite,
  NpcChild01Sprite,
  NpcElderF1Sprite,
  NpcElderM1Sprite,
  NpcElderM2Sprite,
  NpcFisherM1Sprite,
  NpcInnkeeperF1Sprite,
  NpcKeeperF1Sprite,
  NpcResearcherF1Sprite,
  NpcRidgewalkerM1Sprite,
  NpcRidgewalkerM2Sprite,
  NpcRidgewalkerF1Sprite,
  NpcShopkeepF1Sprite,
  NpcShopkeepF2Sprite,
  NpcWoodcutterM1Sprite,
  NpcWoodcutterM2Sprite,
  NpcWoodcutterF1Sprite,
  NpcAudiomancerM1Sprite,
  NpcAudiomancerM2Sprite,
  NpcAudiomancerF1Sprite,
  NpcAudiomancerF2Sprite,
  NpcPreserverCaptainSprite,
  NpcPreserverAgentSprite,
  NpcPreserverEliteSprite,
  NpcPreserverScoutSprite,
  // Enemies — slimes
  EnemyESl01Sprite,
  EnemyESl02Sprite,
  EnemyESl03Sprite,
  EnemyESl04Sprite,
  EnemyESl05Sprite,
  EnemyESl06Sprite,
  EnemyESl07Sprite,
  EnemyESl08Sprite,
  // Enemies — frontier
  EnemyEFr01Sprite,
  EnemyEFr02Sprite,
  EnemyEFr03Sprite,
  EnemyEFr04Sprite,
  EnemyEFr05Sprite,
  EnemyEFr06Sprite,
  EnemyEFr07Sprite,
  EnemyEFr08Sprite,
  EnemyEFr09Sprite,
  EnemyEFr10Sprite,
  EnemyEFr11Sprite,
  // Enemies — skeletons
  EnemyESk01Sprite,
  EnemyESk02Sprite,
  EnemyESk03Sprite,
  EnemyESk04Sprite,
  EnemyESk05Sprite,
  EnemyESk06Sprite,
  // Enemies — deep
  EnemyEDp01Sprite,
  EnemyEDp02Sprite,
  EnemyEDp03Sprite,
  EnemyEDp04Sprite,
  EnemyEDp05Sprite,
  // Enemies — preserver wraiths
  EnemyEPv01Sprite,
  EnemyEPv02Sprite,
  EnemyEPv03Sprite,
  EnemyEPv04Sprite,
  // Bosses
  BossB01Sprite,
  BossB02Sprite,
  BossB03Sprite,
  BossB04Sprite,
  BossB05Sprite,
];
