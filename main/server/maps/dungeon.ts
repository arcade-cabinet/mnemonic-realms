import { EventData, MapData, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { NameGenerator } from '../../generation/generators/nameGenerator';
import { LootGenerator } from '../../generation/generators/npcGenerator';
import { SeededRandom } from '../../generation/seededRandom';

function createChestEvent(seed: string, index: number) {
  const lootGen = new LootGenerator(`${seed}-chest-${index}`);
  const rng = new SeededRandom(`${seed}-chest-${index}`);
  const difficulty = rng.randomInt(1, 5);
  const loot = lootGen.generateLoot(difficulty);

  @EventData({
    name: `chest-${index}`,
    hitbox: { width: 32, height: 16 },
  })
  class ChestEvent extends RpgEvent {
    onInit() {
      this.setGraphic('chest');
    }

    async onAction(player: RpgPlayer) {
      const varName = `chest-${this.map?.id}-${index}`;
      if (player.getVariable(varName)) {
        await player.showText('The chest is empty.');
        return;
      }

      player.gold += loot.gold;

      const itemDesc = loot.items.length > 0 ? loot.items.join(', ') : 'nothing';
      await player.showText(`You found ${loot.gold} gold and: ${itemDesc}!`);
      player.setVariable(varName, true);
    }
  }

  return ChestEvent;
}

function createBossEvent(seed: string) {
  const nameGen = new NameGenerator(`${seed}-boss`);
  const bossName = nameGen.generateCharacterWithTitle();
  const rng = new SeededRandom(`${seed}-boss`);
  const bossHp = rng.randomInt(80, 150);
  const bossAtk = rng.randomInt(10, 20);

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

      const playerStr = player.param?.str || 10;
      const playerDex = player.param?.dex || 5;
      const rounds = Math.ceil(bossHp / Math.max(1, playerStr));
      const totalDamage = rounds * Math.max(1, bossAtk - playerDex);

      if (player.hp > totalDamage) {
        player.hp -= totalDamage;
        const xpReward = 100 + bossHp;
        const goldReward = rng.randomInt(100, 300);
        player.exp += xpReward;
        player.gold += goldReward;
        player.setVariable('BOSS_DEFEATED', true);

        await player.showText(`After an epic ${rounds}-round battle, you defeated ${bossName}!`);
        await player.showText(`+${xpReward} XP, +${goldReward} gold!`);
        this.remove();
      } else {
        player.hp = 1;
        await player.showText(`${bossName} is too powerful! You barely escape with your life.`);
        await player.showText('Gain more experience and return when you are stronger.');
      }
    }
  }

  return BossEvent;
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

    // Spawn chests
    const chestCount = rng.randomInt(2, 4);
    for (let i = 0; i < chestCount; i++) {
      const Chest = createChestEvent(seed, i);
      events.push({
        x: rng.randomInt(2, 18) * 32,
        y: rng.randomInt(2, 18) * 32,
        event: Chest,
      });
    }

    // Spawn boss at the far end
    const Boss = createBossEvent(seed);
    events.push({
      x: 15 * 32,
      y: 15 * 32,
      event: Boss,
    });

    this.createDynamicEvent(events);
  }
}
