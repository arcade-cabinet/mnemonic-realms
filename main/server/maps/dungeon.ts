import { EventData, MapData, Move, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { Antidote } from '../../database/items/antidote';
import { HiPotion } from '../../database/items/hiPotion';
import { ManaPotion } from '../../database/items/manaPotion';
import { Potion } from '../../database/items/potion';
import { BattleScroll } from '../../database/items/scroll';
import { BattleAxe } from '../../database/weapons/axe';
import { NameGenerator } from '../../generation/generators/nameGenerator';
import { SeededRandom } from '../../generation/seededRandom';
import { setupCombatListeners } from '../combatHelpers';
import { type DungeonRoom, generateDungeonTiles } from './mapGenerator';

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

      player.playSound('sfx-item');
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

// Dungeon enemies are tougher — Skeleton and Goblin with scaled stats
const DUNGEON_ENEMY_TYPES = [
  { name: 'Skeleton', graphic: 'enemy', hp: 50, atk: 10, def: 6, agi: 5, xp: 20, gold: 12 },
  { name: 'Goblin', graphic: 'enemy', hp: 35, atk: 7, def: 8, agi: 7, xp: 12, gold: 10 },
  { name: 'Shadow Wolf', graphic: 'enemy', hp: 40, atk: 8, def: 7, agi: 9, xp: 15, gold: 8 },
];

// Dungeon enemies get a difficulty multiplier on top of base database stats
function createDungeonEnemy(seed: string, index: number) {
  const rng = new SeededRandom(`${seed}-dungeon-enemy-${index}`);
  const base = rng.pick(DUNGEON_ENEMY_TYPES);
  const scale = 1 + rng.randomInt(1, 3) * 0.3; // 1.3x to 1.9x scaling

  const enemyName = `Dungeon ${base.name}`;
  const hp = Math.floor(base.hp * scale);
  const atk = Math.floor(base.atk * scale);
  const def = Math.floor(base.def * scale);
  const agi = Math.floor(base.agi * scale);
  const xp = Math.floor(base.xp * scale);
  const gold = Math.floor(base.gold * scale);

  @EventData({
    name: `dungeon-enemy-${index}`,
    hitbox: { width: 32, height: 16 },
  })
  class DungeonEnemyEvent extends RpgEvent {
    onInit() {
      this.setGraphic(scale > 1.6 ? 'enemy-strong' : base.graphic);
      this.speed = 1;
      this.frequency = 250;
      this.infiniteMoveRoute([Move.tileRandom()]);
    }

    async onAction(player: RpgPlayer) {
      player.playSound('sfx-attack');
      const gui = player.gui('combat-gui');

      setupCombatListeners(player, gui);

      gui.open({
        enemyName,
        enemyMaxHp: hp,
        enemyAtk: atk,
        enemyDef: def,
        enemyAgi: agi,
        isBoss: false,
        xpReward: xp,
        goldReward: gold,
        eventId: this.id,
      });

      // biome-ignore lint/suspicious/noExplicitAny: RPG-JS GUI event callback typing
      const result = await new Promise<any>((resolve) => {
        gui.on('combat-result', resolve);
      });

      gui.close();

      if (result.victory) {
        player.playSound('sfx-victory');
        player.exp += xp;
        player.gold += gold;
        this.remove();
      } else {
        player.hp = 1;
        player.playSound('sfx-hit');
        player.gui('game-over').open();
      }
    }
  }

  return DungeonEnemyEvent;
}

// Boss stats based on Dark Knight database actor, with seed-based name
function createBossEvent(seed: string) {
  const nameGen = new NameGenerator(`${seed}-boss`);
  const bossName = nameGen.generateCharacterWithTitle();
  const rng = new SeededRandom(`${seed}-boss`);

  // Dark Knight base: HP 120, STR 18, DEX 10, AGI 8, XP 50, Gold 40
  // Scale up for boss encounter
  const bossHp = 120 + rng.randomInt(30, 80);
  const bossAtk = 18 + rng.randomInt(0, 5);
  const bossDef = 10 + rng.randomInt(0, 3);
  const bossAgi = 8 + rng.randomInt(0, 2);
  const xpReward = 50 + bossHp;
  const goldReward = 40 + rng.randomInt(60, 160);

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
      player.playSound('sfx-attack');

      const gui = player.gui('combat-gui');
      setupCombatListeners(player, gui);

      gui.open({
        enemyName: bossName,
        enemyMaxHp: bossHp,
        enemyAtk: bossAtk,
        enemyDef: bossDef,
        enemyAgi: bossAgi,
        isBoss: true,
        xpReward,
        goldReward,
        eventId: this.id,
      });

      // biome-ignore lint/suspicious/noExplicitAny: RPG-JS GUI event callback typing
      const result = await new Promise<any>((resolve) => {
        gui.on('combat-result', resolve);
      });

      gui.close();

      if (result.victory) {
        player.playSound('sfx-victory');
        player.exp += xpReward;
        player.gold += goldReward;
        player.setVariable('BOSS_DEFEATED', true);

        // Drop unique weapon
        player.addItem(BattleAxe, 1);
        player.playSound('sfx-item');
        await player.showText(`${bossName} dropped the Battle Axe!`);

        await player.showText(`After an epic battle, you defeated ${bossName}!`);
        this.remove();

        // Show victory screen
        player.gui('victory-screen').open();
      } else {
        player.hp = 1;
        player.gui('game-over').open();
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

// Helper to pick a random position inside a room (avoiding edges)
function randomRoomPos(room: DungeonRoom, rng: SeededRandom): { x: number; y: number } {
  return {
    x: rng.randomInt(room.x + 1, room.x + room.w - 2),
    y: rng.randomInt(room.y + 1, room.y + room.h - 2),
  };
}

// Track whether dungeon has been generated
let dungeonGenerated = false;
let cachedRooms: DungeonRoom[] = [];
let cachedEntranceRoom: DungeonRoom = { x: 2, y: 2, w: 6, h: 5, type: 'entrance' };
let cachedBossRoom: DungeonRoom = { x: 22, y: 22, w: 6, h: 6, type: 'boss' };

@MapData({
  id: 'dungeon',
  file: require('./tmx/dungeon.tmx'),
  name: 'Dungeon',
  sounds: ['bgm-dungeon'],
})
export class DungeonMap extends RpgMap {
  async onJoin(player: RpgPlayer) {
    const seed = player.getVariable('SEED') || 'brave ancient warrior';

    // Generate procedural dungeon on first join
    if (!dungeonGenerated) {
      const dungeonData = generateDungeonTiles(seed);
      cachedRooms = dungeonData.rooms;
      cachedEntranceRoom = dungeonData.entranceRoom;
      cachedBossRoom = dungeonData.bossRoom;

      // Apply generated tiles to the map using setTile()
      for (let y = 0; y < 30; y++) {
        for (let x = 0; x < 30; x++) {
          const idx = y * 30 + x;
          const gid = dungeonData.ground[idx];
          const collides = dungeonData.collision[idx] === 1;

          this.setTile(x, y, 'ground', { gid });
          this.setTile(x, y, 'collision', {
            gid: collides ? 1 : 0,
            properties: collides ? { collision: true } : {},
          });
        }
      }

      dungeonGenerated = true;
    }

    const rng = new SeededRandom(`${seed}-dungeon`);
    // biome-ignore lint/suspicious/noExplicitAny: RPG-JS createDynamicEvent expects untyped event class
    const events: Array<{ x: number; y: number; event: any }> = [];

    // Spawn dungeon exit in entrance room
    const Exit = createDungeonExit();
    const exitPos = randomRoomPos(cachedEntranceRoom, rng);
    events.push({
      x: exitPos.x * 32,
      y: exitPos.y * 32,
      event: Exit,
    });

    // Spawn dungeon enemies in combat rooms
    const combatRooms = cachedRooms.filter((r) => r.type === 'combat');
    const enemyCount = rng.randomInt(3, 5);
    for (let i = 0; i < enemyCount; i++) {
      const Enemy = createDungeonEnemy(seed, i);
      const room = combatRooms[i % combatRooms.length] || cachedRooms[1] || cachedEntranceRoom;
      const pos = randomRoomPos(room, rng);
      events.push({
        x: pos.x * 32,
        y: pos.y * 32,
        event: Enemy,
      });
    }

    // Spawn chests in treasure rooms (or any non-entrance, non-boss room)
    const treasureRooms = cachedRooms.filter(
      (r) => r.type === 'treasure' || (r.type !== 'entrance' && r.type !== 'boss'),
    );
    const chestCount = rng.randomInt(2, 4);
    for (let i = 0; i < chestCount; i++) {
      const Chest = createChestEvent(seed, i);
      const room = treasureRooms[i % treasureRooms.length] || cachedRooms[1] || cachedEntranceRoom;
      const pos = randomRoomPos(room, rng);
      events.push({
        x: pos.x * 32,
        y: pos.y * 32,
        event: Chest,
      });
    }

    // Spawn boss in boss room
    const Boss = createBossEvent(seed);
    const bossPos = randomRoomPos(cachedBossRoom, rng);
    events.push({
      x: bossPos.x * 32,
      y: bossPos.y * 32,
      event: Boss,
    });

    this.createDynamicEvent(events);
  }
}
