import { Control, type RpgPlayer, type RpgPlayerHooks } from '@rpgjs/server';
import { Alignment, CharacterClass, Name } from '../generation/ecs/components';
import { ProceduralWorld } from '../generation/ecs/world';
import { ClassGenerator } from '../generation/generators/classGenerator';
import { NameGenerator } from '../generation/generators/nameGenerator';

const DEFAULT_SEED = 'brave ancient warrior';

export const player: RpgPlayerHooks = {
  async onConnected(player: RpgPlayer) {
    const gui = player.gui('title-screen');
    gui.open();

    const { seed } = await new Promise<{ seed: string }>((resolve) => {
      gui.on('seed-selected', resolve);
    });

    gui.close();
    applyProceduralStats(player, seed || DEFAULT_SEED);
    player.setHitbox(20, 16);
    player.setGraphic('hero');
    player.changeMap('overworld');
  },

  onInput(player: RpgPlayer, { input }: { input: string }) {
    if (input === Control.Back) {
      player.callMainMenu();
    }
  },

  async onJoinMap(player: RpgPlayer) {
    if (player.getVariable('INTRO_DONE')) return;

    const seed = player.getVariable('SEED') || DEFAULT_SEED;
    const nameGen = new NameGenerator(seed);
    const placeName = nameGen.generatePlaceName();

    await player.showText(
      `You awaken in ${placeName}. The world reshapes itself around your memory...`,
    );
    await player.showText('Use arrow keys to move. Press SPACE to interact with NPCs.');
    player.setVariable('INTRO_DONE', true);
  },

  onLevelUp(player: RpgPlayer, level: number) {
    const seed = player.getVariable('SEED') || DEFAULT_SEED;
    const world = new ProceduralWorld();
    const _charId = world.createCharacter(`${seed}-level-${level}`);
    world.update();

    // Procedural stat gains per level
    player.param = {
      ...player.param,
      maxHp: (player.param.maxHp || 100) + 10 + level * 2,
      str: (player.param.str || 10) + Math.floor(level / 3),
      int: (player.param.int || 10) + Math.floor(level / 3),
      dex: (player.param.dex || 10) + Math.floor(level / 4),
      agi: (player.param.agi || 10) + Math.floor(level / 4),
    };
  },
};

function applyProceduralStats(player: RpgPlayer, seed: string) {
  const world = new ProceduralWorld();
  const charId = world.createCharacter(seed);
  world.update();

  const entity = world.getEntity(charId);
  if (!entity) return;

  const nameComp = entity.getComponent(Name);
  const classComp = entity.getComponent(CharacterClass);
  const alignmentComp = entity.getComponent(Alignment);

  if (nameComp?.value) {
    player.name = nameComp.value;
  }

  player.setVariable('SEED', seed);
  player.setVariable('alignment', alignmentComp?.type || 'neutral');
  player.setVariable('class', classComp?.name || 'Adventurer');

  // Apply class-based stat modifiers
  const classGen = new ClassGenerator(seed);
  const charClass = classGen.generateClass(alignmentComp?.type || 'neutral');

  const baseStats: Record<string, number> = {
    maxHp: 100,
    maxSp: 50,
    str: 10,
    int: 10,
    dex: 10,
    agi: 10,
  };

  // Boost stats based on class mastery
  for (const [skill, bonus] of Object.entries(charClass.masteryBonus)) {
    switch (skill) {
      case 'combat':
        baseStats.str += bonus;
        baseStats.maxHp += bonus * 2;
        break;
      case 'magic':
        baseStats.int += bonus;
        baseStats.maxSp += bonus * 2;
        break;
      case 'stealth':
        baseStats.dex += bonus;
        baseStats.agi += bonus;
        break;
      case 'support':
        baseStats.maxHp += bonus;
        baseStats.maxSp += bonus;
        break;
      case 'crafting':
        baseStats.dex += Math.floor(bonus / 2);
        baseStats.int += Math.floor(bonus / 2);
        break;
    }
  }

  player.param = baseStats;
  player.hp = baseStats.maxHp;
  player.sp = baseStats.maxSp;
}
