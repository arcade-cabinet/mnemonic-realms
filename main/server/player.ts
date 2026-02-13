import { Control, type RpgPlayer, type RpgPlayerHooks } from '@rpgjs/server';
import { Cleric } from '../database/classes/cleric';
import { Mage } from '../database/classes/mage';
import { Rogue } from '../database/classes/rogue';
import { Warrior } from '../database/classes/warrior';
import { Potion } from '../database/items/potion';
import { IronSword } from '../database/weapons/sword';
import { Alignment, Name, SkillMastery } from '../generation/ecs/components';
import { ProceduralWorld } from '../generation/ecs/world';
import { NameGenerator } from '../generation/generators/nameGenerator';

const DEFAULT_SEED = 'brave ancient warrior';

/** Mastery bonuses for each player-selectable class */
const CLASS_MASTERY: Record<string, Record<string, number>> = {
  warrior: { combat: 25, support: 10 },
  mage: { magic: 25, crafting: 10 },
  rogue: { stealth: 25, combat: 10 },
  cleric: { support: 25, magic: 10 },
};

/** Map class id to display name */
const CLASS_DISPLAY_NAME: Record<string, string> = {
  warrior: 'Warrior',
  mage: 'Mage',
  rogue: 'Rogue',
  cleric: 'Cleric',
};

// biome-ignore lint/suspicious/noExplicitAny: RPG-JS class types are untyped constructor references
const RPGJS_CLASS_MAP: Record<string, any> = {
  warrior: Warrior,
  mage: Mage,
  rogue: Rogue,
  cleric: Cleric,
};

export const player: RpgPlayerHooks = {
  async onConnected(player: RpgPlayer) {
    const gui = player.gui('title-screen');
    gui.open();

    const { seed, classId } = await new Promise<{ seed: string; classId: string }>((resolve) => {
      gui.on('seed-selected', resolve);
    });

    gui.close();
    applyProceduralStats(player, seed || DEFAULT_SEED, classId || 'warrior');
    applyStartingEquipment(player);
    player.setHitbox(20, 16);

    // Set class-specific sprite variant
    const playerClass = player.getVariable('class') || 'Warrior';
    const classGraphicMap: Record<string, string> = {
      Warrior: 'warrior',
      Mage: 'mage',
      Rogue: 'rogue',
      Cleric: 'cleric',
      'Dark Knight': 'warrior-dark',
      Necromancer: 'mage-dark',
      Assassin: 'rogue-dark',
      'Shadow Priest': 'cleric-dark',
    };
    player.setGraphic(classGraphicMap[playerClass] || 'hero');
    player.changeMap('overworld');
  },

  onInput(player: RpgPlayer, { input }: { input: string }) {
    if (input === Control.Back) {
      player.playSound('sfx-menu');
      player.callMainMenu();
    }
  },

  async onJoinMap(player: RpgPlayer) {
    // Sync HP/SP to client now that player is in a room
    player.hp = player.hp || player.param.maxHp;
    player.sp = player.sp || player.param.maxSp;
    player.syncChanges();

    player.gui('game-hud').open();

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
    player.recovery({ hp: 1, sp: 1 });
    player.playSound('sfx-levelup');
    player.showText(`Level Up! You are now level ${level}!`);
  },
};

function applyProceduralStats(player: RpgPlayer, seed: string, classId: string) {
  const world = new ProceduralWorld();
  const charId = world.createCharacter(seed);
  world.update();

  const entity = world.getEntity(charId);
  if (!entity) return;

  const nameComp = entity.getComponent(Name);
  const alignmentComp = entity.getComponent(Alignment);
  const masteryComp = entity.getComponent(SkillMastery);

  if (nameComp?.value) {
    player.name = nameComp.value;
  }

  const displayName = CLASS_DISPLAY_NAME[classId] || 'Warrior';

  player.setVariable('SEED', seed);
  player.setVariable('alignment', alignmentComp?.type || 'neutral');
  player.setVariable('class', displayName);

  // Assign the RPG-JS class — this triggers skillsToLearn for the player's level
  const rpgjsClass = RPGJS_CLASS_MAP[classId] || Warrior;
  try {
    player.setClass(rpgjsClass);
  } catch {
    // Class assignment may fail if already set
  }

  // Merge mastery bonuses: player-selected class + ECS seed-derived mastery
  const classMastery = CLASS_MASTERY[classId] || CLASS_MASTERY.warrior;
  const ecsMastery: Record<string, number> = {};
  if (masteryComp) {
    for (const key of ['combat', 'magic', 'stealth', 'support', 'crafting']) {
      const val = (masteryComp as unknown as Record<string, number>)[key] || 0;
      if (val > 0) ecsMastery[key] = val;
    }
  }

  // Combine: class mastery as base, ECS mastery as seed-specific bonus
  const combinedMastery: Record<string, number> = { ...classMastery };
  for (const [key, val] of Object.entries(ecsMastery)) {
    combinedMastery[key] = (combinedMastery[key] || 0) + Math.floor(val / 2);
  }

  const baseStats: Record<string, number> = {
    maxHp: 100,
    maxSp: 50,
    str: 10,
    int: 10,
    dex: 10,
    agi: 10,
  };

  // Boost stats based on combined mastery
  for (const [skill, bonus] of Object.entries(combinedMastery)) {
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

  // Set stat curves: start = procedural base, end = 10x at max level
  for (const [stat, value] of Object.entries(baseStats)) {
    player.addParameter(stat, { start: value, end: value * 10 });
  }
  // Set HP/SP to max after parameters are defined
  player.hp = player.param.maxHp;
  player.sp = player.param.maxSp;
}

function applyStartingEquipment(player: RpgPlayer) {
  try {
    player.addItem(IronSword, 1);
    player.addItem(Potion, 3);
    player.equip(IronSword);
  } catch {
    // Equipment system may not be fully available yet
  }
}
