import { EventData, MapData, Move, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { Antidote } from '../../database/items/antidote';
import { HiPotion } from '../../database/items/hiPotion';
import { ManaPotion } from '../../database/items/manaPotion';
import { Potion } from '../../database/items/potion';
import { Longbow } from '../../database/weapons/bow';
import { ShadowDagger } from '../../database/weapons/dagger';
import { DialogueGenerator } from '../../generation/generators/dialogueGenerator';
import { NameGenerator } from '../../generation/generators/nameGenerator';
import { SeededRandom } from '../../generation/seededRandom';

// Procedural NPC factory
function createProceduralNPC(seed: string, index: number) {
  const nameGen = new NameGenerator(`${seed}-npc-${index}`);
  const dialogueGen = new DialogueGenerator(`${seed}-npc-${index}`);
  const npcName = nameGen.generateCharacterWithTitle();
  const dialogue = dialogueGen.generateRandomDialogue();

  const graphicOptions = ['npc-villager', 'npc-merchant', 'npc-elder'];
  const rng = new SeededRandom(`${seed}-npc-graphic-${index}`);
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
      for (const line of dialogue.lines) {
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

// Combat-enabled enemy factory
function createCombatEnemy(seed: string, index: number) {
  const nameGen = new NameGenerator(`${seed}-enemy-${index}`);
  const enemyName = nameGen.generateCharacterName();
  const rng = new SeededRandom(`${seed}-enemy-${index}`);
  const difficulty = rng.randomInt(1, 5);

  const baseHp = 20 + difficulty * 15;
  const baseAtk = 3 + difficulty * 3;
  const baseDef = 1 + difficulty;
  const baseAgi = 3 + difficulty;
  const xpReward = 10 + difficulty * 8;
  const goldReward = rng.randomInt(5, 15) * difficulty;

  @EventData({
    name: `enemy-${index}`,
    hitbox: { width: 32, height: 16 },
  })
  class CombatEnemyEvent extends RpgEvent {
    onInit() {
      this.setGraphic('enemy');
      this.speed = 1;
      this.frequency = 300;
      this.infiniteMoveRoute([Move.tileRandom()]);
    }

    async onAction(player: RpgPlayer) {
      player.playSound('sfx-attack');
      // Open combat GUI with enemy data
      player.gui('combat-gui').open({
        enemyName,
        enemyMaxHp: baseHp,
        enemyAtk: baseAtk,
        enemyDef: baseDef,
        enemyAgi: baseAgi,
        isBoss: false,
        xpReward,
        goldReward,
        eventId: this.id,
      });

      // biome-ignore lint/suspicious/noExplicitAny: RPG-JS GUI event callback typing
      const result = await new Promise<any>((resolve) => {
        player.gui('combat-gui').on('combat-result', resolve);
      });

      player.gui('combat-gui').close();

      if (result.victory) {
        player.playSound('sfx-victory');
        player.exp += xpReward;
        player.gold += goldReward;

        // Random loot drop
        const lootRng = new SeededRandom(`${seed}-loot-${index}-${Date.now()}`);
        if (lootRng.random() < 0.4) {
          player.addItem(Potion, 1);
          player.playSound('sfx-item');
          await player.showText(`${enemyName} dropped a Potion!`);
        }

        this.remove();
      } else {
        // Player defeated
        player.hp = 1;
        player.playSound('sfx-hit');
        player.gui('game-over').open();
      }
    }
  }

  return CombatEnemyEvent;
}

@MapData({
  id: 'overworld',
  file: require('./tmx/overworld.tmx'),
  name: 'Overworld',
  sounds: ['bgm-overworld'],
})
export class OverworldMap extends RpgMap {
  onLoad() {
    // Procedural terrain generation happens at the Tiled map level
  }

  async onJoin(player: RpgPlayer) {
    const seed = player.getVariable('SEED') || 'brave ancient warrior';
    const rng = new SeededRandom(seed);

    // biome-ignore lint/suspicious/noExplicitAny: RPG-JS createDynamicEvent expects untyped event class
    const events: Array<{ x: number; y: number; event: any }> = [];

    // Spawn procedural NPCs in village area (5-11, 5-8) and scattered
    const npcCount = rng.randomInt(3, 5);
    for (let i = 0; i < npcCount; i++) {
      const NPC = createProceduralNPC(seed, i);
      events.push({
        x: rng.randomInt(5, 10) * 32,
        y: rng.randomInt(5, 8) * 32,
        event: NPC,
      });
    }

    // Spawn combat enemies along paths and in open areas
    const enemyCount = rng.randomInt(3, 6);
    for (let i = 0; i < enemyCount; i++) {
      const Enemy = createCombatEnemy(seed, i);
      events.push({
        x: rng.randomInt(10, 35) * 32,
        y: rng.randomInt(10, 35) * 32,
        event: Enemy,
      });
    }

    // Spawn shop NPC in village
    const Shop = createShopNPC(seed);
    events.push({
      x: 7 * 32,
      y: 6 * 32,
      event: Shop,
    });

    // Spawn quest NPCs near village
    const QuestNPC = createQuestNPC(seed);
    events.push({
      x: 6 * 32,
      y: 9 * 32,
      event: QuestNPC,
    });

    const BossQuestNPC = createBossQuestNPC(seed);
    events.push({
      x: 10 * 32,
      y: 9 * 32,
      event: BossQuestNPC,
    });

    // Spawn dungeon entrance near bottom-right (along the path)
    const DungeonEntrance = createDungeonEntrance();
    events.push({
      x: 30 * 32,
      y: 30 * 32,
      event: DungeonEntrance,
    });

    this.createDynamicEvent(events);
  }
}
