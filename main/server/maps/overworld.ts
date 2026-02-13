import { EventData, MapData, Move, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { Antidote } from '../../database/items/antidote';
import { HiPotion } from '../../database/items/hiPotion';
import { ManaPotion } from '../../database/items/manaPotion';
import { Potion } from '../../database/items/potion';
import { Longbow } from '../../database/weapons/bow';
import { ShadowDagger } from '../../database/weapons/dagger';
import {
  GREETING_STYLES,
  PERSONALITY_TRAITS,
  QUEST_HOOK_TYPES,
} from '../../generation/ecs/dataPools';
import { NameGenerator } from '../../generation/generators/nameGenerator';
import { SeededRandom } from '../../generation/seededRandom';
import { setupCombatListeners } from '../combatHelpers';
import { generateOverworldTiles } from './mapGenerator';

// Procedural NPC factory — uses ECS PERSONALITY_TRAITS and GREETING_STYLES
function createProceduralNPC(seed: string, index: number) {
  const nameGen = new NameGenerator(`${seed}-npc-${index}`);
  const npcName = nameGen.generateCharacterWithTitle();
  const rng = new SeededRandom(`${seed}-npc-${index}`);

  // Select personality and greeting style from ECS data pools
  const personalityKeys = Object.keys(PERSONALITY_TRAITS) as Array<keyof typeof PERSONALITY_TRAITS>;
  const personalityKey = rng.pick(personalityKeys);
  const greetingStyleIndex = rng.randomInt(0, GREETING_STYLES.length - 1);
  const questHookIndex = rng.randomInt(0, QUEST_HOOK_TYPES.length - 1);

  const greeting = rng.pick(GREETING_STYLES[greetingStyleIndex]);
  const personalityLine = rng.pick(PERSONALITY_TRAITS[personalityKey]);
  const questHook = rng.pick(QUEST_HOOK_TYPES[questHookIndex]);

  const dialogueLines = [greeting, personalityLine, questHook];

  const graphicOptions = ['npc-villager', 'npc-merchant', 'npc-elder'];
  const graphic = rng.pick(graphicOptions);

  @EventData({
    name: `npc-${index}`,
    hitbox: { width: 32, height: 16 },
  })
  class ProceduralNPCEvent extends RpgEvent {
    onInit() {
      this.setGraphic(graphic);
      this.speed = 1;
      this.frequency = 200;
      this.infiniteMoveRoute([Move.tileRandom()]);
    }

    async onAction(player: RpgPlayer) {
      for (const line of dialogueLines) {
        await player.showText(`[${npcName}]: ${line}`, { talkWith: this });
      }
    }
  }

  return ProceduralNPCEvent;
}

// Shop NPC factory
function createShopNPC(seed: string) {
  const nameGen = new NameGenerator(`${seed}-shopkeeper`);
  const shopName = nameGen.generateCharacterWithTitle();

  @EventData({
    name: 'shop-npc',
    hitbox: { width: 32, height: 16 },
  })
  class ShopNPCEvent extends RpgEvent {
    onInit() {
      this.setGraphic('npc-merchant');
    }

    async onAction(player: RpgPlayer) {
      await player.showText(`[${shopName}]: Welcome, traveler! Browse my wares.`, {
        talkWith: this,
      });
      player.callShop([
        { item: Potion },
        { item: HiPotion },
        { item: ManaPotion },
        { item: Antidote },
        { item: Longbow },
        { item: ShadowDagger },
      ]);
    }
  }

  return ShopNPCEvent;
}

// Quest NPC: fetch quest
function createQuestNPC(seed: string) {
  const nameGen = new NameGenerator(`${seed}-questgiver`);
  const questGiverName = nameGen.generateCharacterWithTitle();
  const rng = new SeededRandom(`${seed}-quest`);
  const questItems = [
    'Ancient Relic',
    'Dragon Scale',
    'Crystal Shard',
    'Shadow Orb',
    'Holy Emblem',
  ];
  const questItem = rng.pick(questItems);
  const goldReward = rng.randomInt(50, 200);

  @EventData({
    name: 'quest-npc',
    hitbox: { width: 32, height: 16 },
  })
  class QuestNPCEvent extends RpgEvent {
    onInit() {
      this.setGraphic('npc-elder');
    }

    async onAction(player: RpgPlayer) {
      const questState = player.getVariable('FETCH_QUEST');

      if (questState === 'complete') {
        await player.showText(
          `[${questGiverName}]: Thank you, brave hero! You have saved us all.`,
          { talkWith: this },
        );
        return;
      }

      if (questState === 'active') {
        const hasItem = player.getVariable('BOSS_DEFEATED');
        if (hasItem) {
          player.gold += goldReward;
          player.exp += 50;
          player.setVariable('FETCH_QUEST', 'complete');
          await player.showText(
            `[${questGiverName}]: You found the ${questItem}! Here is your reward: ${goldReward} gold!`,
            { talkWith: this },
          );
        } else {
          await player.showText(
            `[${questGiverName}]: Please, you must find the ${questItem} in the dungeon depths!`,
            { talkWith: this },
          );
        }
        return;
      }

      // Give quest
      await player.showText(
        `[${questGiverName}]: Brave adventurer! I need you to retrieve the ${questItem} from the dungeon.`,
        { talkWith: this },
      );
      await player.showText(
        `[${questGiverName}]: Defeat the dungeon boss and I shall reward you with ${goldReward} gold.`,
        { talkWith: this },
      );
      player.setVariable('FETCH_QUEST', 'active');
    }
  }

  return QuestNPCEvent;
}

// Boss quest NPC
function createBossQuestNPC(seed: string) {
  const nameGen = new NameGenerator(`${seed}-captain`);
  const captainName = nameGen.generateCharacterWithTitle();
  const goldReward = 300;

  @EventData({
    name: 'boss-quest-npc',
    hitbox: { width: 32, height: 16 },
  })
  class BossQuestNPCEvent extends RpgEvent {
    onInit() {
      this.setGraphic('npc-villager');
    }

    async onAction(player: RpgPlayer) {
      const questState = player.getVariable('BOSS_QUEST');

      if (questState === 'complete') {
        await player.showText(`[${captainName}]: You are a true hero of the realm!`, {
          talkWith: this,
        });
        return;
      }

      if (questState === 'active') {
        if (player.getVariable('BOSS_DEFEATED')) {
          player.gold += goldReward;
          player.exp += 100;
          player.setVariable('BOSS_QUEST', 'complete');
          await player.showText(
            `[${captainName}]: The boss has been slain! You have earned ${goldReward} gold and the realm's eternal gratitude!`,
            { talkWith: this },
          );
        } else {
          await player.showText(
            `[${captainName}]: The dungeon boss still lives. You must defeat it!`,
            { talkWith: this },
          );
        }
        return;
      }

      await player.showText(
        `[${captainName}]: A terrible evil lurks in the dungeon. Will you slay the boss for me?`,
        { talkWith: this },
      );
      await player.showText(
        `[${captainName}]: I shall reward you handsomely — ${goldReward} gold pieces!`,
        { talkWith: this },
      );
      player.setVariable('BOSS_QUEST', 'active');
    }
  }

  return BossQuestNPCEvent;
}

// Dungeon entrance event
function createDungeonEntrance() {
  @EventData({
    name: 'dungeon-entrance',
    hitbox: { width: 32, height: 32 },
  })
  class DungeonEntranceEvent extends RpgEvent {
    onInit() {
      this.setGraphic('chest'); // Will replace with cave graphic later
    }

    async onPlayerTouch(player: RpgPlayer) {
      await player.showText('Descending into the depths...');
      player.changeMap('dungeon');
    }
  }

  return DungeonEntranceEvent;
}

// Database enemy definitions with stats — seed picks which enemy type spawns
const ENEMY_TYPES = [
  { name: 'Slime', graphic: 'enemy', hp: 20, atk: 4, def: 3, agi: 3, xp: 5, gold: 3 },
  { name: 'Shadow Wolf', graphic: 'enemy', hp: 40, atk: 8, def: 7, agi: 9, xp: 15, gold: 8 },
  { name: 'Goblin', graphic: 'enemy', hp: 35, atk: 7, def: 8, agi: 7, xp: 12, gold: 10 },
  { name: 'Skeleton', graphic: 'enemy', hp: 50, atk: 10, def: 6, agi: 5, xp: 20, gold: 12 },
];

// Combat-enabled enemy factory — stats from database actors
function createCombatEnemy(seed: string, index: number) {
  const rng = new SeededRandom(`${seed}-enemy-${index}`);
  const enemyType = rng.pick(ENEMY_TYPES);

  @EventData({
    name: `enemy-${index}`,
    hitbox: { width: 32, height: 16 },
  })
  class CombatEnemyEvent extends RpgEvent {
    onInit() {
      this.setGraphic(enemyType.graphic);
      this.speed = 1;
      this.frequency = 300;
      this.infiniteMoveRoute([Move.tileRandom()]);
    }

    async onAction(player: RpgPlayer) {
      player.playSound('sfx-attack');
      const gui = player.gui('combat-gui');

      // Set up server-side combat interaction listeners
      setupCombatListeners(player, gui);

      gui.open({
        enemyName: enemyType.name,
        enemyMaxHp: enemyType.hp,
        enemyAtk: enemyType.atk,
        enemyDef: enemyType.def,
        enemyAgi: enemyType.agi,
        isBoss: false,
        xpReward: enemyType.xp,
        goldReward: enemyType.gold,
        eventId: this.id,
      });

      // biome-ignore lint/suspicious/noExplicitAny: RPG-JS GUI event callback typing
      const result = await new Promise<any>((resolve) => {
        gui.on('combat-result', resolve);
      });

      gui.close();

      if (result.victory) {
        player.playSound('sfx-victory');
        player.exp += enemyType.xp;
        player.gold += enemyType.gold;

        // Random loot drop
        const lootRng = new SeededRandom(`${seed}-loot-${index}-${Date.now()}`);
        if (lootRng.random() < 0.4) {
          player.addItem(Potion, 1);
          player.playSound('sfx-item');
          await player.showText(`${enemyType.name} dropped a Potion!`);
        }

        this.remove();
      } else {
        player.hp = 1;
        player.playSound('sfx-hit');
        player.gui('game-over').open();
      }
    }
  }

  return CombatEnemyEvent;
}

// Track whether the map has already been procedurally generated
let overworldGenerated = false;
let cachedVillageCenter = { x: 15, y: 15 };
let cachedDungeonEntrance = { x: 30, y: 30 };

@MapData({
  id: 'overworld',
  file: require('./tmx/overworld.tmx'),
  name: 'Overworld',
  sounds: ['bgm-overworld'],
})
export class OverworldMap extends RpgMap {
  onLoad() {
    // Static TMX loads as baseline; tiles are replaced procedurally on first player join
  }

  async onJoin(player: RpgPlayer) {
    const seed = player.getVariable('SEED') || 'brave ancient warrior';

    // Generate procedural terrain on first join
    if (!overworldGenerated) {
      const mapData = generateOverworldTiles(seed);
      cachedVillageCenter = mapData.villageCenter;
      cachedDungeonEntrance = mapData.dungeonEntrance;

      // Apply generated tiles to the map using setTile()
      for (let y = 0; y < 40; y++) {
        for (let x = 0; x < 40; x++) {
          const idx = y * 40 + x;
          const gid = mapData.ground[idx];
          const collides = mapData.collision[idx] === 1;

          this.setTile(x, y, 'ground', { gid });
          this.setTile(x, y, 'collision', {
            gid: collides ? 1 : 0,
            properties: collides ? { collision: true } : {},
          });
        }
      }

      overworldGenerated = true;
    }

    const rng = new SeededRandom(seed);
    const vc = cachedVillageCenter;
    const dc = cachedDungeonEntrance;

    // biome-ignore lint/suspicious/noExplicitAny: RPG-JS createDynamicEvent expects untyped event class
    const events: Array<{ x: number; y: number; event: any }> = [];

    // Spawn procedural NPCs near the village center
    const npcCount = rng.randomInt(3, 5);
    for (let i = 0; i < npcCount; i++) {
      const NPC = createProceduralNPC(seed, i);
      events.push({
        x: (vc.x + rng.randomInt(-2, 2)) * 32,
        y: (vc.y + rng.randomInt(-2, 2)) * 32,
        event: NPC,
      });
    }

    // Spawn combat enemies scattered across the map but away from village
    const enemyCount = rng.randomInt(3, 6);
    for (let i = 0; i < enemyCount; i++) {
      const Enemy = createCombatEnemy(seed, i);
      // Place enemies in second and third quadrants, along path area
      const ex = rng.randomInt(Math.min(vc.x + 5, 35), Math.min(dc.x + 3, 38));
      const ey = rng.randomInt(Math.min(vc.y + 5, 35), Math.min(dc.y + 3, 38));
      events.push({
        x: ex * 32,
        y: ey * 32,
        event: Enemy,
      });
    }

    // Spawn shop NPC in village
    const Shop = createShopNPC(seed);
    events.push({
      x: (vc.x + 1) * 32,
      y: (vc.y + 1) * 32,
      event: Shop,
    });

    // Spawn quest NPCs near village
    const QuestNPC = createQuestNPC(seed);
    events.push({
      x: (vc.x - 2) * 32,
      y: (vc.y + 2) * 32,
      event: QuestNPC,
    });

    const BossQuestNPC = createBossQuestNPC(seed);
    events.push({
      x: (vc.x + 2) * 32,
      y: (vc.y + 2) * 32,
      event: BossQuestNPC,
    });

    // Spawn dungeon entrance at procedurally determined position
    const DungeonEntrance = createDungeonEntrance();
    events.push({
      x: dc.x * 32,
      y: dc.y * 32,
      event: DungeonEntrance,
    });

    this.createDynamicEvent(events);
  }
}
