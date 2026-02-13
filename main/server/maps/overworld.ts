import { EventData, MapData, Move, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { DialogueGenerator } from '../../generation/generators/dialogueGenerator';
import { NameGenerator } from '../../generation/generators/nameGenerator';
import { SeededRandom } from '../../generation/seededRandom';

// Procedural NPC factory
function createProceduralNPC(seed: string, index: number) {
  const nameGen = new NameGenerator(`${seed}-npc-${index}`);
  const dialogueGen = new DialogueGenerator(`${seed}-npc-${index}`);
  const npcName = nameGen.generateCharacterWithTitle();
  const dialogue = dialogueGen.generateRandomDialogue();

  const graphicOptions = ['female13', 'male1_1', 'male4_1'];
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

// Procedural enemy factory
function createProceduralEnemy(seed: string, index: number) {
  const nameGen = new NameGenerator(`${seed}-enemy-${index}`);
  const enemyName = nameGen.generateCharacterName();
  const rng = new SeededRandom(`${seed}-enemy-${index}`);
  const difficulty = rng.randomInt(1, 5);

  @EventData({
    name: `enemy-${index}`,
    hitbox: { width: 32, height: 16 },
  })
  class ProceduralEnemyEvent extends RpgEvent {
    onInit() {
      this.setGraphic('enemy');
      this.speed = 1;
      this.frequency = 300;
      this.infiniteMoveRoute([Move.tileRandom()]);
    }

    async onAction(player: RpgPlayer) {
      const playerStr = player.param?.str || 10;
      const playerHp = player.hp || 100;
      const enemyHp = 20 + difficulty * 15;
      const enemyAtk = 3 + difficulty * 2;
      const xpReward = 10 + difficulty * 5;

      const damageDealt = Math.max(1, playerStr - difficulty);
      const damageTaken = Math.max(1, enemyAtk - (player.param?.dex || 5));

      if (damageDealt >= enemyHp) {
        // Player wins
        player.hp = Math.max(1, playerHp - Math.floor(damageTaken / 2));
        player.exp += xpReward;
        player.gold += rng.randomInt(5, 20) * difficulty;

        await player.showText(`You defeated ${enemyName}! (+${xpReward} XP, +${player.gold} gold)`);

        // Remove defeated enemy
        this.remove();
      } else {
        // Combat exchange
        const rounds = Math.ceil(enemyHp / Math.max(1, damageDealt));
        const totalDamage = rounds * damageTaken;
        player.hp = Math.max(1, playerHp - totalDamage);
        player.exp += xpReward;

        await player.showText(
          `After ${rounds} rounds, you defeated ${enemyName}! You took ${totalDamage} damage. (+${xpReward} XP)`,
        );

        this.remove();
      }
    }
  }

  return ProceduralEnemyEvent;
}

@MapData({
  id: 'overworld',
  file: require('./tmx/overworld.tmx'),
  name: 'Overworld',
})
export class OverworldMap extends RpgMap {
  onLoad() {
    // Procedural terrain generation happens at the Tiled map level
  }

  async onJoin(player: RpgPlayer) {
    const seed = player.getVariable('SEED') || 'brave ancient warrior';
    const rng = new SeededRandom(seed);

    // Spawn procedural NPCs
    const npcCount = rng.randomInt(3, 6);
    // biome-ignore lint/suspicious/noExplicitAny: RPG-JS createDynamicEvent expects untyped event class
    const events: Array<{ x: number; y: number; event: any }> = [];

    for (let i = 0; i < npcCount; i++) {
      const NPC = createProceduralNPC(seed, i);
      events.push({
        x: rng.randomInt(3, 27) * 32,
        y: rng.randomInt(3, 27) * 32,
        event: NPC,
      });
    }

    // Spawn procedural enemies
    const enemyCount = rng.randomInt(2, 5);
    for (let i = 0; i < enemyCount; i++) {
      const Enemy = createProceduralEnemy(seed, i);
      events.push({
        x: rng.randomInt(3, 27) * 32,
        y: rng.randomInt(3, 27) * 32,
        event: Enemy,
      });
    }

    this.createDynamicEvent(events);
  }
}
