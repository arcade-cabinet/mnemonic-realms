import { SeededRandom } from '../utils/seededRandom';

export type Alignment = 'light' | 'dark' | 'neutral';
export type SkillCategory = 'combat' | 'magic' | 'stealth' | 'support' | 'crafting';

export interface Skill {
  name: string;
  category: SkillCategory;
  power: number;
  description: string;
}

export interface CharacterClass {
  name: string;
  alignment: Alignment;
  primarySkills: SkillCategory[];
  masteryBonus: Record<SkillCategory, number>;
  startingSkills: Skill[];
  description: string;
}

const LIGHT_CLASS_NAMES = [
  'Paladin',
  'Cleric',
  'Guardian',
  'Templar',
  'Crusader',
  'Holy Knight',
  'Divine Archer',
  'Light Mage',
  'Healer',
  'Protector',
];

const DARK_CLASS_NAMES = [
  'Necromancer',
  'Shadow Assassin',
  'Warlock',
  'Death Knight',
  'Hexblade',
  'Dark Sorcerer',
  'Reaper',
  'Blood Mage',
  'Cursed One',
  'Void Walker',
];

const NEUTRAL_CLASS_NAMES = [
  'Ranger',
  'Monk',
  'Druid',
  'Bard',
  'Alchemist',
  'Wanderer',
  'Mercenary',
  'Scholar',
  'Tinkerer',
  'Beast Master',
];

const LIGHT_SKILLS = [
  {
    name: 'Holy Smite',
    category: 'combat' as SkillCategory,
    description: 'Strike with divine power',
  },
  {
    name: 'Divine Shield',
    category: 'support' as SkillCategory,
    description: 'Protect with holy light',
  },
  { name: 'Healing Touch', category: 'magic' as SkillCategory, description: 'Restore life force' },
  {
    name: 'Righteous Fury',
    category: 'combat' as SkillCategory,
    description: 'Channel divine wrath',
  },
  { name: 'Purifying Light', category: 'magic' as SkillCategory, description: 'Cleanse darkness' },
];

const DARK_SKILLS = [
  {
    name: 'Shadow Strike',
    category: 'stealth' as SkillCategory,
    description: 'Attack from the shadows',
  },
  { name: 'Life Drain', category: 'magic' as SkillCategory, description: 'Steal life essence' },
  {
    name: 'Curse of Weakness',
    category: 'magic' as SkillCategory,
    description: 'Enfeeble enemies',
  },
  { name: 'Dark Pact', category: 'support' as SkillCategory, description: 'Sacrifice for power' },
  { name: 'Summon Shadow', category: 'magic' as SkillCategory, description: 'Call forth darkness' },
];

const NEUTRAL_SKILLS = [
  {
    name: 'Precise Shot',
    category: 'combat' as SkillCategory,
    description: 'Strike with accuracy',
  },
  {
    name: "Nature's Blessing",
    category: 'support' as SkillCategory,
    description: 'Draw on natural power',
  },
  {
    name: 'Meditation',
    category: 'support' as SkillCategory,
    description: 'Restore inner balance',
  },
  {
    name: 'Craft Potion',
    category: 'crafting' as SkillCategory,
    description: 'Create useful elixirs',
  },
  { name: 'Swift Movement', category: 'stealth' as SkillCategory, description: 'Move with speed' },
];

/**
 * Deterministic class system generator
 */
export class ClassGenerator {
  private rng: SeededRandom;

  constructor(seed: string) {
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate a character class based on alignment
   */
  generateClass(alignment: Alignment): CharacterClass {
    let className: string;
    let skillPool: typeof LIGHT_SKILLS;

    switch (alignment) {
      case 'light':
        className = this.rng.pick(LIGHT_CLASS_NAMES);
        skillPool = LIGHT_SKILLS;
        break;
      case 'dark':
        className = this.rng.pick(DARK_CLASS_NAMES);
        skillPool = DARK_SKILLS;
        break;
      case 'neutral':
        className = this.rng.pick(NEUTRAL_CLASS_NAMES);
        skillPool = NEUTRAL_SKILLS;
        break;
    }

    // Determine primary skills (2-3 categories)
    const allCategories: SkillCategory[] = ['combat', 'magic', 'stealth', 'support', 'crafting'];
    const primaryCount = this.rng.randomInt(2, 3);
    const primarySkills = this.rng.shuffle(allCategories).slice(0, primaryCount);

    // Create mastery bonuses
    const masteryBonus: Record<SkillCategory, number> = {
      combat: 0,
      magic: 0,
      stealth: 0,
      support: 0,
      crafting: 0,
    };

    for (const skill of primarySkills) {
      masteryBonus[skill] = this.rng.randomInt(15, 30);
    }

    // Select starting skills (3-5 skills)
    const skillCount = this.rng.randomInt(3, 5);
    const startingSkills: Skill[] = this.rng
      .shuffle([...skillPool])
      .slice(0, skillCount)
      .map((skill) => ({
        ...skill,
        power: this.rng.randomInt(5, 15),
      }));

    const description = this.generateClassDescription(className, alignment, primarySkills);

    return {
      name: className,
      alignment,
      primarySkills,
      masteryBonus,
      startingSkills,
      description,
    };
  }

  /**
   * Generate a complete class system with multiple alignments
   */
  generateClassSystem(classCount: number = 9): CharacterClass[] {
    const classes: CharacterClass[] = [];
    const alignments: Alignment[] = ['light', 'dark', 'neutral'];

    for (let i = 0; i < classCount; i++) {
      const alignment = alignments[i % 3];
      classes.push(this.generateClass(alignment));
    }

    return classes;
  }

  /**
   * Generate class description
   */
  private generateClassDescription(
    name: string,
    alignment: Alignment,
    skills: SkillCategory[],
  ): string {
    const alignmentDescriptions = {
      light: 'devoted to righteousness and protection',
      dark: 'wielding forbidden power and shadow',
      neutral: 'balanced between all forces',
    };

    const skillDescriptions = {
      combat: 'martial prowess',
      magic: 'arcane mastery',
      stealth: 'cunning tactics',
      support: 'strategic support',
      crafting: 'creation and invention',
    };

    const skillText = skills.map((s) => skillDescriptions[s]).join(', ');
    return `The ${name} is ${alignmentDescriptions[alignment]}, excelling in ${skillText}.`;
  }
}
