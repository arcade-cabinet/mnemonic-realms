import { SeededRandom } from '../seededRandom';

export interface NPC {
  name: string;
  description: string;
  personality: string[];
  dialogue: string[];
  backstory: string;
  alignment: string;
  class: string;
}

export interface LootDrop {
  items: string[];
  gold: number;
  rarity: number;
}

/**
 * Deterministic NPC generator using ECS approach
 */
export class NPCGenerator {
  private rng: SeededRandom;

  constructor(seed: string) {
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate an NPC
   */
  generateNPC(): NPC {
    const alignmentTypes = ['light', 'dark', 'neutral'];
    const alignment = this.rng.pick(alignmentTypes);

    const personalityOptions = ['friendly', 'suspicious', 'wise', 'jovial', 'mysterious'];
    const personality = [this.rng.pick(personalityOptions)];

    const classNames = {
      light: ['Paladin', 'Cleric', 'Guardian'],
      dark: ['Necromancer', 'Shadow Assassin', 'Warlock'],
      neutral: ['Ranger', 'Monk', 'Druid'],
    };

    return {
      name: this.generateName(),
      description: this.generateDescription(),
      personality,
      dialogue: this.generateDialogue(),
      backstory: this.generateBackstory(),
      alignment,
      class: this.rng.pick(classNames[alignment as keyof typeof classNames]),
    };
  }

  private generateName(): string {
    const start = ['Ael', 'Bra', 'Cal', 'Dar', 'El', 'Far'];
    const end = ['ion', 'ath', 'ris', 'wen', 'dor', 'mir'];
    return this.rng.pick(start) + this.rng.pick(end);
  }

  private generateDescription(): string {
    const traits = ['imposing', 'mysterious', 'welcoming', 'intimidating', 'wise'];
    const features = ['scarred face', 'bright eyes', 'weathered hands', 'calm demeanor'];
    return `A ${this.rng.pick(traits)} figure with ${this.rng.pick(features)}.`;
  }

  private generateDialogue(): string[] {
    const greetings = ['Greetings, traveler.', 'Well met.', 'What brings you here?'];
    const statements = ['I have seen much in my time.', 'These lands hold many secrets.'];
    return [this.rng.pick(greetings), this.rng.pick(statements)];
  }

  private generateBackstory(): string {
    const origins = ['a distant kingdom', 'humble beginnings', 'noble lineage'];
    const events = ['great tragedy', 'heroic quest', 'dark secret'];
    return `From ${this.rng.pick(origins)}, marked by ${this.rng.pick(events)}.`;
  }
}

/**
 * Deterministic loot generator
 */
export class LootGenerator {
  private rng: SeededRandom;

  constructor(seed: string) {
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate a loot drop
   */
  generateLoot(difficulty: number = 1): LootDrop {
    const itemCount = this.rng.randomInt(1, Math.min(5, difficulty + 2));
    const items: string[] = [];

    for (let i = 0; i < itemCount; i++) {
      items.push(this.generateItem());
    }

    const goldAmount = this.rng.randomInt(difficulty * 10, difficulty * 50);
    const rarity = this.rng.randomInt(1, 10);

    return {
      items,
      gold: goldAmount,
      rarity,
    };
  }

  private generateItem(): string {
    const types = ['Weapon', 'Armor', 'Potion', 'Scroll', 'Gem', 'Artifact'];
    const adjectives = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythical'];
    const materials = ['Iron', 'Steel', 'Silver', 'Gold', 'Crystal', 'Obsidian'];

    const type = this.rng.pick(types);
    const adj = this.rng.pick(adjectives);
    const mat = this.rng.pick(materials);

    return `${adj} ${mat} ${type}`;
  }

  /**
   * Generate treasure chest contents
   */
  generateTreasureChest(): LootDrop {
    return this.generateLoot(this.rng.randomInt(3, 8));
  }

  /**
   * Generate boss loot
   */
  generateBossLoot(): LootDrop {
    const loot = this.generateLoot(10);
    loot.rarity = this.rng.randomInt(8, 10);
    loot.gold *= 5;
    return loot;
  }
}
