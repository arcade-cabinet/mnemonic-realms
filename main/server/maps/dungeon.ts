import { EventData, MapData, Move, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { Antidote } from '../../database/items/antidote';
import { HiPotion } from '../../database/items/hiPotion';
import { ManaPotion } from '../../database/items/manaPotion';
import { Potion } from '../../database/items/potion';
import { BattleScroll } from '../../database/items/scroll';
import { BattleAxe } from '../../database/weapons/axe';
import { NameGenerator } from '../../generation/generators/nameGenerator';
import { SeededRandom } from '../../generation/seededRandom';

function createChestEvent(seed: string, index: number) {
  const rng = new SeededRandom(`${seed}-chest-${index}`);
  const goldAmount = rng.randomInt(20, 80);
  const itemDrops = ['Potion', 'Hi-Potion', 'Mana Potion', 'Battle Scroll', 'Antidote'];
  const droppedItem = rng.pick(itemDrops);

  @EventData({
    name: `chest-${index}`,
    hitbox: { width: 32, height: 16 },
  })
  class ChestEvent extends RpgEvent {
    onInit() {
      this.setGraphic('chest');
    }

    async onAction(player: RpgPlayer) {
      const varName = `chest-dungeon-${index}`;
      if (player.getVariable(varName)) {
        await player.showText('The chest is empty.');
        return;
      }

      player.gold += goldAmount;

      // Give an actual database item
      // biome-ignore lint/suspicious/noExplicitAny: RPG-JS item class typing
      const itemMap: Record<string, any> = {
        Potion,
        'Hi-Potion': HiPotion,
        'Mana Potion': ManaPotion,
        'Battle Scroll': BattleScroll,
        Antidote,
      };
      const itemClass = itemMap[droppedItem];
      if (itemClass) {
        player.addItem(itemClass, 1);
      }

      await player.showText(`You found ${goldAmount} gold and a ${droppedItem}!`);
      player.setVariable(varName, true);
    }
  }

  return ChestEvent;
}

function createDungeonEnemy(seed: string, index: number) {
  const nameGen = new NameGenerator(`${seed}-dungeon-enemy-${index}`);
  const enemyName = nameGen.generateCharacterName();
  const rng = new SeededRandom(`${seed}-dungeon-enemy-${index}`);
  const difficulty = rng.randomInt(3, 7); // Dungeon enemies are tougher

  const baseHp = 30 + difficulty * 20;
  const baseAtk = 5 + difficulty * 3;
  const baseDef = 2 + difficulty;
  const baseAgi = 3 + difficulty;
  const xpReward = 20 + difficulty * 10;
  const goldReward = rng.randomInt(10, 25) * difficulty;

  @EventData({
    name: `dungeon-enemy-${index}`,
    hitbox: { width: 32, height: 16 },
  })
  class DungeonEnemyEvent extends RpgEvent {
    onInit() {
      this.setGraphic('enemy');
      this.speed = 1;
      this.frequency = 250;
      this.infiniteMoveRoute([Move.tileRandom()]);
    }

    async onAction(player: RpgPlayer) {
      player.gui('combat-gui').open();
      player.emit('combat-start', {
        enemyName: `Dungeon ${enemyName}`,
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
        player.exp += xpReward;
        player.gold += goldReward;
        this.remove();
      } else {
        player.hp = 1;
        player.gui('game-over').open();
        player.emit('show-game-over', {});
      }
    }
  }

  return DungeonEnemyEvent;
}

function createBossEvent(seed: string) {
  const nameGen = new NameGenerator(`${seed}-boss`);
  const bossName = nameGen.generateCharacterWithTitle();
  const rng = new SeededRandom(`${seed}-boss`);
  const bossHp = rng.randomInt(150, 250);
  const bossAtk = rng.randomInt(15, 25);
  const bossDef = rng.randomInt(8, 15);
  const bossAgi = rng.randomInt(5, 10);

  @EventData({
    name: 'boss',
    hitbox: { width: 32, height: 32 },
  })
  class BossEvent extends RpgEvent {
    onInit() {
      this.setGraphic('boss');
    }

    async onAction(player: RpgPlayer) {
      if (player.getVariable('BOSS_DEFEATED')) {
        await player.showText('The chamber is silent. The boss has been vanquished.');
        return;
      }

      await player.showText(`${bossName} blocks your path! Prepare for battle!`);

      player.gui('combat-gui').open();
      player.emit('combat-start', {
        enemyName: bossName,
        enemyMaxHp: bossHp,
        enemyAtk: bossAtk,
        enemyDef: bossDef,
        enemyAgi: bossAgi,
        isBoss: true,
        xpReward: 100 + bossHp,
        goldReward: rng.randomInt(200, 500),
        eventId: this.id,
      });

      // biome-ignore lint/suspicious/noExplicitAny: RPG-JS GUI event callback typing
      const result = await new Promise<any>((resolve) => {
        player.gui('combat-gui').on('combat-result', resolve);
      });

      player.gui('combat-gui').close();

      if (result.victory) {
        player.exp += result.xp || 200;
        player.gold += result.gold || 300;
        player.setVariable('BOSS_DEFEATED', true);

        // Drop unique weapon
        player.addItem(BattleAxe, 1);
        await player.showText(`${bossName} dropped the Battle Axe!`);

        await player.showText(`After an epic battle, you defeated ${bossName}!`);
        this.remove();

        // Show victory screen
        player.gui('victory-screen').open();
        player.emit('show-victory', {});
      } else {
        player.hp = 1;
        player.gui('game-over').open();
        player.emit('show-game-over', {});
      }
    }
  }

  return BossEvent;
}

// Dungeon exit
function createDungeonExit() {
  @EventData({
    name: 'dungeon-exit',
    hitbox: { width: 32, height: 32 },
  })
  class DungeonExitEvent extends RpgEvent {
    onInit() {
      this.setGraphic('chest'); // Will replace with stairs graphic later
    }

    async onPlayerTouch(player: RpgPlayer) {
      await player.showText('Ascending to the surface...');
      player.changeMap('overworld');
    }
  }

  return DungeonExitEvent;
}

@MapData({
  id: 'dungeon',
  file: require('./tmx/dungeon.tmx'),
  name: 'Dungeon',
})
export class DungeonMap extends RpgMap {
  async onJoin(player: RpgPlayer) {
    const seed = player.getVariable('SEED') || 'brave ancient warrior';
    const rng = new SeededRandom(`${seed}-dungeon`);
    // biome-ignore lint/suspicious/noExplicitAny: RPG-JS createDynamicEvent expects untyped event class
    const events: Array<{ x: number; y: number; event: any }> = [];

    // Spawn dungeon exit in entrance room (top-left)
    const Exit = createDungeonExit();
    events.push({
      x: 3 * 32,
      y: 3 * 32,
      event: Exit,
    });

    // Spawn dungeon enemies in rooms
    // Room positions: central hall (14-21, 10-15), mid-left (2-7, 12-16), pre-boss (12-17, 20-24)
    const enemyRooms = [
      { minX: 15, maxX: 20, minY: 11, maxY: 14 },
      { minX: 3, maxX: 6, minY: 13, maxY: 15 },
      { minX: 13, maxX: 16, minY: 21, maxY: 23 },
    ];
    const enemyCount = rng.randomInt(3, 5);
    for (let i = 0; i < enemyCount; i++) {
      const Enemy = createDungeonEnemy(seed, i);
      const room = enemyRooms[i % enemyRooms.length];
      events.push({
        x: rng.randomInt(room.minX, room.maxX) * 32,
        y: rng.randomInt(room.minY, room.maxY) * 32,
        event: Enemy,
      });
    }

    // Spawn chests in side rooms
    // Side room (12-18, 2-6), bottom-left (2-7, 22-27)
    const chestRooms = [
      { minX: 13, maxX: 17, minY: 3, maxY: 5 },
      { minX: 3, maxX: 6, minY: 23, maxY: 26 },
    ];
    const chestCount = rng.randomInt(2, 4);
    for (let i = 0; i < chestCount; i++) {
      const Chest = createChestEvent(seed, i);
      const room = chestRooms[i % chestRooms.length];
      events.push({
        x: rng.randomInt(room.minX, room.maxX) * 32,
        y: rng.randomInt(room.minY, room.maxY) * 32,
        event: Chest,
      });
    }

    // Spawn boss in boss room (bottom-right, 22-28, 22-28)
    const Boss = createBossEvent(seed);
    events.push({
      x: 25 * 32,
      y: 25 * 32,
      event: Boss,
    });

    this.createDynamicEvent(events);
  }
}
