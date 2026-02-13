/**
 * Auto-generated spritesheet bindings from GenAI pipeline.
 * Regenerate with: pnpm exec tsx gen/scripts/integrate-assets.ts sprites
 */

import { Presets, Spritesheet } from '@rpgjs/client';

const { RMSpritesheet } = Presets;

// Standard character sprites: 96x256 (3 frames x 4 directions, 32x64 per frame)
const CHAR_SHEET = { width: 96, height: 256, ...RMSpritesheet(3, 4) };
// Boss sprites: 192x256 (3 frames x 4 directions, 64x64 per frame)
const BOSS_SHEET = { width: 192, height: 256, ...RMSpritesheet(3, 4) };

@Spritesheet({
  id: 'sprite-player-knight',
  image: require('../../../assets/sprites/sprite_player_knight.webp'),
  ...CHAR_SHEET,
})
export class PlayerKnightSprite {}

@Spritesheet({
  id: 'sprite-player-mage',
  image: require('../../../assets/sprites/sprite_player_mage.webp'),
  ...CHAR_SHEET,
})
export class PlayerMageSprite {}

@Spritesheet({
  id: 'sprite-player-rogue',
  image: require('../../../assets/sprites/sprite_player_rogue.webp'),
  ...CHAR_SHEET,
})
export class PlayerRogueSprite {}

@Spritesheet({
  id: 'sprite-player-cleric',
  image: require('../../../assets/sprites/sprite_player_cleric.webp'),
  ...CHAR_SHEET,
})
export class PlayerClericSprite {}

@Spritesheet({
  id: 'sprite-npc-lira',
  image: require('../../../assets/sprites/sprite_npc_lira.webp'),
  ...CHAR_SHEET,
})
export class NpcLiraSprite {}

@Spritesheet({
  id: 'sprite-npc-callum',
  image: require('../../../assets/sprites/sprite_npc_callum.webp'),
  ...CHAR_SHEET,
})
export class NpcCallumSprite {}

@Spritesheet({
  id: 'sprite-npc-curator',
  image: require('../../../assets/sprites/sprite_npc_curator.webp'),
  ...CHAR_SHEET,
})
export class NpcCuratorSprite {}

@Spritesheet({
  id: 'sprite-npc-maren',
  image: require('../../../assets/sprites/sprite_npc_maren.webp'),
  ...CHAR_SHEET,
})
export class NpcMarenSprite {}

@Spritesheet({
  id: 'sprite-npc-torvan',
  image: require('../../../assets/sprites/sprite_npc_torvan.webp'),
  ...CHAR_SHEET,
})
export class NpcTorvanSprite {}

@Spritesheet({
  id: 'sprite-npt-villager',
  image: require('../../../assets/sprites/sprite_npc_villager.webp'),
  ...CHAR_SHEET,
})
export class NptVillagerSprite {}

@Spritesheet({
  id: 'sprite-npt-merchant',
  image: require('../../../assets/sprites/sprite_npc_merchant.webp'),
  ...CHAR_SHEET,
})
export class NptMerchantSprite {}

@Spritesheet({
  id: 'sprite-npt-farmer',
  image: require('../../../assets/sprites/sprite_npc_farmer.webp'),
  ...CHAR_SHEET,
})
export class NptFarmerSprite {}

@Spritesheet({
  id: 'sprite-npt-scholar',
  image: require('../../../assets/sprites/sprite_npc_scholar.webp'),
  ...CHAR_SHEET,
})
export class NptScholarSprite {}

@Spritesheet({
  id: 'sprite-npt-guard',
  image: require('../../../assets/sprites/sprite_npc_guard.webp'),
  ...CHAR_SHEET,
})
export class NptGuardSprite {}

@Spritesheet({
  id: 'sprite-npt-child',
  image: require('../../../assets/sprites/sprite_npc_child.webp'),
  ...CHAR_SHEET,
})
export class NptChildSprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sl-01',
  image: require('../../../assets/sprites/sprite_enemy_e-sl-01.webp'),
  ...CHAR_SHEET,
})
export class EnemyESl01Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sl-02',
  image: require('../../../assets/sprites/sprite_enemy_e-sl-02.webp'),
  ...CHAR_SHEET,
})
export class EnemyESl02Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sl-03',
  image: require('../../../assets/sprites/sprite_enemy_e-sl-03.webp'),
  ...CHAR_SHEET,
})
export class EnemyESl03Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sl-04',
  image: require('../../../assets/sprites/sprite_enemy_e-sl-04.webp'),
  ...CHAR_SHEET,
})
export class EnemyESl04Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sl-05',
  image: require('../../../assets/sprites/sprite_enemy_e-sl-05.webp'),
  ...CHAR_SHEET,
})
export class EnemyESl05Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sl-06',
  image: require('../../../assets/sprites/sprite_enemy_e-sl-06.webp'),
  ...CHAR_SHEET,
})
export class EnemyESl06Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sl-07',
  image: require('../../../assets/sprites/sprite_enemy_e-sl-07.webp'),
  ...CHAR_SHEET,
})
export class EnemyESl07Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sl-08',
  image: require('../../../assets/sprites/sprite_enemy_e-sl-08.webp'),
  ...CHAR_SHEET,
})
export class EnemyESl08Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-fr-01',
  image: require('../../../assets/sprites/sprite_enemy_e-fr-01.webp'),
  ...CHAR_SHEET,
})
export class EnemyEFr01Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-fr-02',
  image: require('../../../assets/sprites/sprite_enemy_e-fr-02.webp'),
  ...CHAR_SHEET,
})
export class EnemyEFr02Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-fr-03',
  image: require('../../../assets/sprites/sprite_enemy_e-fr-03.webp'),
  ...CHAR_SHEET,
})
export class EnemyEFr03Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-fr-04',
  image: require('../../../assets/sprites/sprite_enemy_e-fr-04.webp'),
  ...CHAR_SHEET,
})
export class EnemyEFr04Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-fr-05',
  image: require('../../../assets/sprites/sprite_enemy_e-fr-05.webp'),
  ...CHAR_SHEET,
})
export class EnemyEFr05Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-fr-06',
  image: require('../../../assets/sprites/sprite_enemy_e-fr-06.webp'),
  ...CHAR_SHEET,
})
export class EnemyEFr06Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-fr-07',
  image: require('../../../assets/sprites/sprite_enemy_e-fr-07.webp'),
  ...CHAR_SHEET,
})
export class EnemyEFr07Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-fr-08',
  image: require('../../../assets/sprites/sprite_enemy_e-fr-08.webp'),
  ...CHAR_SHEET,
})
export class EnemyEFr08Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-fr-09',
  image: require('../../../assets/sprites/sprite_enemy_e-fr-09.webp'),
  ...CHAR_SHEET,
})
export class EnemyEFr09Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-fr-10',
  image: require('../../../assets/sprites/sprite_enemy_e-fr-10.webp'),
  ...CHAR_SHEET,
})
export class EnemyEFr10Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-fr-11',
  image: require('../../../assets/sprites/sprite_enemy_e-fr-11.webp'),
  ...CHAR_SHEET,
})
export class EnemyEFr11Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sk-01',
  image: require('../../../assets/sprites/sprite_enemy_e-sk-01.webp'),
  ...CHAR_SHEET,
})
export class EnemyESk01Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sk-02',
  image: require('../../../assets/sprites/sprite_enemy_e-sk-02.webp'),
  ...CHAR_SHEET,
})
export class EnemyESk02Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sk-03',
  image: require('../../../assets/sprites/sprite_enemy_e-sk-03.webp'),
  ...CHAR_SHEET,
})
export class EnemyESk03Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sk-04',
  image: require('../../../assets/sprites/sprite_enemy_e-sk-04.webp'),
  ...CHAR_SHEET,
})
export class EnemyESk04Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sk-05',
  image: require('../../../assets/sprites/sprite_enemy_e-sk-05.webp'),
  ...CHAR_SHEET,
})
export class EnemyESk05Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-sk-06',
  image: require('../../../assets/sprites/sprite_enemy_e-sk-06.webp'),
  ...CHAR_SHEET,
})
export class EnemyESk06Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-dp-01',
  image: require('../../../assets/sprites/sprite_enemy_e-dp-01.webp'),
  ...CHAR_SHEET,
})
export class EnemyEDp01Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-dp-02',
  image: require('../../../assets/sprites/sprite_enemy_e-dp-02.webp'),
  ...CHAR_SHEET,
})
export class EnemyEDp02Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-dp-03',
  image: require('../../../assets/sprites/sprite_enemy_e-dp-03.webp'),
  ...CHAR_SHEET,
})
export class EnemyEDp03Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-dp-04',
  image: require('../../../assets/sprites/sprite_enemy_e-dp-04.webp'),
  ...CHAR_SHEET,
})
export class EnemyEDp04Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-dp-05',
  image: require('../../../assets/sprites/sprite_enemy_e-dp-05.webp'),
  ...CHAR_SHEET,
})
export class EnemyEDp05Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-pv-01',
  image: require('../../../assets/sprites/sprite_enemy_e-pv-01.webp'),
  ...CHAR_SHEET,
})
export class EnemyEPv01Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-pv-02',
  image: require('../../../assets/sprites/sprite_enemy_e-pv-02.webp'),
  ...CHAR_SHEET,
})
export class EnemyEPv02Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-pv-03',
  image: require('../../../assets/sprites/sprite_enemy_e-pv-03.webp'),
  ...CHAR_SHEET,
})
export class EnemyEPv03Sprite {}

@Spritesheet({
  id: 'sprite-enemy-e-pv-04',
  image: require('../../../assets/sprites/sprite_enemy_e-pv-04.webp'),
  ...CHAR_SHEET,
})
export class EnemyEPv04Sprite {}

@Spritesheet({
  id: 'sprite-boss-b-01',
  image: require('../../../assets/sprites/sprite_boss_b-01.webp'),
  ...BOSS_SHEET,
})
export class BossB01Sprite {}

@Spritesheet({
  id: 'sprite-boss-b-02',
  image: require('../../../assets/sprites/sprite_boss_b-02.webp'),
  ...BOSS_SHEET,
})
export class BossB02Sprite {}

@Spritesheet({
  id: 'sprite-boss-b-03',
  image: require('../../../assets/sprites/sprite_boss_b-03.webp'),
  ...BOSS_SHEET,
})
export class BossB03Sprite {}

@Spritesheet({
  id: 'sprite-boss-b-04',
  image: require('../../../assets/sprites/sprite_boss_b-04.webp'),
  ...BOSS_SHEET,
})
export class BossB04Sprite {}

@Spritesheet({
  id: 'sprite-boss-b-05',
  image: require('../../../assets/sprites/sprite_boss_b-05.webp'),
  ...BOSS_SHEET,
})
export class BossB05Sprite {}

export const generatedSprites = [
  PlayerKnightSprite,
  PlayerMageSprite,
  PlayerRogueSprite,
  PlayerClericSprite,
  NpcLiraSprite,
  NpcCallumSprite,
  NpcCuratorSprite,
  NpcMarenSprite,
  NpcTorvanSprite,
  NptVillagerSprite,
  NptMerchantSprite,
  NptFarmerSprite,
  NptScholarSprite,
  NptGuardSprite,
  NptChildSprite,
  EnemyESl01Sprite,
  EnemyESl02Sprite,
  EnemyESl03Sprite,
  EnemyESl04Sprite,
  EnemyESl05Sprite,
  EnemyESl06Sprite,
  EnemyESl07Sprite,
  EnemyESl08Sprite,
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
  EnemyESk01Sprite,
  EnemyESk02Sprite,
  EnemyESk03Sprite,
  EnemyESk04Sprite,
  EnemyESk05Sprite,
  EnemyESk06Sprite,
  EnemyEDp01Sprite,
  EnemyEDp02Sprite,
  EnemyEDp03Sprite,
  EnemyEDp04Sprite,
  EnemyEDp05Sprite,
  EnemyEPv01Sprite,
  EnemyEPv02Sprite,
  EnemyEPv03Sprite,
  EnemyEPv04Sprite,
  BossB01Sprite,
  BossB02Sprite,
  BossB03Sprite,
  BossB04Sprite,
  BossB05Sprite,
];
