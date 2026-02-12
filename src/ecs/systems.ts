import { System } from 'ecsy';
import { SeededRandom } from '../utils/seededRandom';
import {
  Alignment,
  Backstory,
  CharacterClass,
  Description,
  Dialogue,
  Name,
  Personality,
  Seed,
  SkillMastery,
} from './components';

/**
 * Name Generation System
 * Generates names for entities with Name and Seed components
 */
export class NameGenerationSystem extends System {
  static queries = {
    unnamedEntities: {
      components: [Name, Seed],
      listen: {
        added: true,
      },
    },
  };

  execute(): void {
    const entities = this.queries.unnamedEntities.added;
    if (!entities) return;

    for (const entity of entities) {
      const name = entity.getMutableComponent(Name);
      const seed = entity.getComponent(Seed);

      if (name && seed && !name.value) {
        const rng = new SeededRandom(seed.value);
        name.value = this.generateName(rng);
      }
    }
  }

  private generateName(rng: SeededRandom): string {
    const syllablesStart = ['ael', 'bra', 'cal', 'dar', 'el', 'far', 'gal', 'hal'];
    const syllablesMiddle = ['an', 'ben', 'cir', 'den', 'el', 'fin'];
    const syllablesEnd = ['a', 'as', 'en', 'er', 'ia', 'is', 'on', 'or'];

    const count = rng.randomInt(2, 3);
    let name = rng.pick(syllablesStart);

    for (let i = 1; i < count - 1; i++) {
      name += rng.pick(syllablesMiddle);
    }

    name += rng.pick(syllablesEnd);
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}

/**
 * Dialogue Generation System
 * Generates dialogue for NPCs with Dialogue, Personality, and Seed components
 */
export class DialogueGenerationSystem extends System {
  static queries = {
    needsDialogue: {
      components: [Dialogue, Personality, Seed],
      listen: {
        added: true,
      },
    },
  };

  execute(): void {
    const entities = this.queries.needsDialogue.added;
    if (!entities) return;

    for (const entity of entities) {
      const dialogue = entity.getMutableComponent(Dialogue);
      const personality = entity.getComponent(Personality);
      const seed = entity.getComponent(Seed);

      if (dialogue && personality && seed && (!dialogue.lines || dialogue.lines.length === 0)) {
        const rng = new SeededRandom(seed.value);
        dialogue.lines = this.generateDialogueLines(rng, personality.traits);
        dialogue.personality = personality.traits[0] || 'friendly';
      }
    }
  }

  private generateDialogueLines(rng: SeededRandom, traits: string[]): string[] {
    const greetings = ['Greetings, traveler.', 'Well met, stranger.', 'Ah, a visitor.'];
    const hooks = [
      'I have a task that needs doing.',
      'Perhaps you can help me.',
      'There is trouble here.',
    ];
    const farewells = ['Fare thee well.', 'Safe travels.', 'Until we meet again.'];

    return [rng.pick(greetings), rng.pick(hooks), rng.pick(farewells)];
  }
}

/**
 * Backstory Generation System
 */
export class BackstoryGenerationSystem extends System {
  static queries = {
    needsBackstory: {
      components: [Backstory, Seed, Alignment],
      listen: {
        added: true,
      },
    },
  };

  execute(): void {
    const entities = this.queries.needsBackstory.added;
    if (!entities) return;

    for (const entity of entities) {
      const backstory = entity.getMutableComponent(Backstory);
      const seed = entity.getComponent(Seed);
      const alignment = entity.getComponent(Alignment);

      if (backstory && seed && alignment && !backstory.text) {
        const rng = new SeededRandom(seed.value);
        backstory.text = this.generateBackstory(rng, alignment.type);
      }
    }
  }

  private generateBackstory(rng: SeededRandom, alignment: string): string {
    const origins = ['born in a distant land', 'orphaned at a young age', 'trained by masters'];
    const motivations = ['seeks redemption', 'pursues vengeance', 'protects the innocent'];

    return `Once ${rng.pick(origins)}, they now ${rng.pick(motivations)}.`;
  }
}

/**
 * Class Generation System
 */
export class ClassGenerationSystem extends System {
  static queries = {
    needsClass: {
      components: [CharacterClass, Alignment, SkillMastery, Seed],
      listen: {
        added: true,
      },
    },
  };

  execute(): void {
    const entities = this.queries.needsClass.added;
    if (!entities) return;

    for (const entity of entities) {
      const charClass = entity.getMutableComponent(CharacterClass);
      const alignment = entity.getComponent(Alignment);
      const mastery = entity.getMutableComponent(SkillMastery);
      const seed = entity.getComponent(Seed);

      if (charClass && alignment && mastery && seed && !charClass.name) {
        const rng = new SeededRandom(seed.value);
        this.assignClass(rng, charClass, alignment.type, mastery);
      }
    }
  }

  private assignClass(
    rng: SeededRandom,
    charClass: CharacterClass,
    alignment: string,
    mastery: SkillMastery,
  ): void {
    const lightClasses = ['Paladin', 'Cleric', 'Guardian'];
    const darkClasses = ['Necromancer', 'Shadow Assassin', 'Warlock'];
    const neutralClasses = ['Ranger', 'Monk', 'Druid'];

    let classes: string[];
    if (alignment === 'light') classes = lightClasses;
    else if (alignment === 'dark') classes = darkClasses;
    else classes = neutralClasses;

    charClass.name = rng.pick(classes);

    const categories = ['combat', 'magic', 'stealth', 'support', 'crafting'];
    charClass.primarySkills = rng.shuffle(categories).slice(0, rng.randomInt(2, 3));

    // Set mastery bonuses
    const masteryKeys = charClass.primarySkills.filter((s) => s in mastery);
    for (const skill of masteryKeys) {
      (mastery as unknown as Record<string, number>)[skill] = rng.randomInt(15, 30);
    }
  }
}

/**
 * Description Generation System
 */
export class DescriptionGenerationSystem extends System {
  static queries = {
    needsDescription: {
      components: [Description, Name, Seed],
      listen: {
        added: true,
      },
    },
  };

  execute(): void {
    const entities = this.queries.needsDescription.added;
    if (!entities) return;

    for (const entity of entities) {
      const description = entity.getMutableComponent(Description);
      const name = entity.getComponent(Name);
      const seed = entity.getComponent(Seed);

      if (description && name && seed && !description.value) {
        const rng = new SeededRandom(seed.value);
        description.value = this.generateDescription(rng, name.value, seed);
      }
    }
  }

  private generateDescription(rng: SeededRandom, name: string, seed: Seed): string {
    const adjectives = seed.adjectives.length > 0 ? seed.adjectives.join(' ') : 'mysterious';
    const descriptors = ['imposing', 'enigmatic', 'striking', 'memorable'];
    return `${name} has a ${adjectives} and ${rng.pick(descriptors)} presence.`;
  }
}
