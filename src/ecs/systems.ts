import { System } from 'ecsy';
import { SeededRandom } from '../utils/seededRandom';
import {
  Alignment,
  Backstory,
  CharacterClass,
  Description,
  Dialogue,
  DialogueArchetype,
  Name,
  NameArchetype,
  Personality,
  Seed,
  SkillMastery,
} from './components';
import {
  GREETING_STYLES,
  PERSONALITY_TRAITS,
  QUEST_HOOK_TYPES,
  SKILL_POOLS,
  STORY_TEMPLATES,
  SYLLABLE_POOLS,
} from './dataPools';

/**
 * Name Generation System
 * Generates names using archetype-indexed syllable pools
 */
export class NameGenerationSystem extends System {
  static queries = {
    unnamedEntities: {
      components: [Name, Seed, NameArchetype],
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
      const archetype = entity.getComponent(NameArchetype);

      if (name && seed && archetype && !name.value) {
        const rng = new SeededRandom(seed.value);
        const poolIndex = archetype.syllableSet % SYLLABLE_POOLS.length;
        const pool = SYLLABLE_POOLS[poolIndex];

        name.value = this.generateName(rng, pool);
      }
    }
  }

  private generateName(rng: SeededRandom, pool: (typeof SYLLABLE_POOLS)[0]): string {
    const count = rng.randomInt(2, 3);
    let name = rng.pick(pool.start);

    for (let i = 1; i < count - 1; i++) {
      name += rng.pick(pool.middle);
    }

    name += rng.pick(pool.end);
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}

/**
 * Dialogue Generation System
 * Generates dialogue using archetype-indexed greeting/quest pools
 */
export class DialogueGenerationSystem extends System {
  static queries = {
    needsDialogue: {
      components: [Dialogue, Personality, Seed, DialogueArchetype],
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
      const archetype = entity.getComponent(DialogueArchetype);

      if (
        dialogue &&
        personality &&
        seed &&
        archetype &&
        (!dialogue.lines || dialogue.lines.length === 0)
      ) {
        const rng = new SeededRandom(seed.value);
        const greetingIndex = archetype.greetingStyle % GREETING_STYLES.length;
        const questIndex = archetype.questHookType % QUEST_HOOK_TYPES.length;

        dialogue.lines = this.generateDialogueLines(
          rng,
          greetingIndex,
          questIndex,
          personality.traits,
        );
        dialogue.personality = personality.traits[0] || 'friendly';
      }
    }
  }

  private generateDialogueLines(
    rng: SeededRandom,
    greetingIndex: number,
    questIndex: number,
    traits: string[],
  ): string[] {
    const greeting = rng.pick(GREETING_STYLES[greetingIndex]);
    const quest = rng.pick(QUEST_HOOK_TYPES[questIndex]);

    const personalityKey = traits[0] as keyof typeof PERSONALITY_TRAITS;
    const personalityLine = PERSONALITY_TRAITS[personalityKey]
      ? rng.pick(PERSONALITY_TRAITS[personalityKey])
      : 'Greetings.';

    return [greeting, personalityLine, quest];
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

  private generateBackstory(rng: SeededRandom, _alignment: string): string {
    const template = rng.pick(STORY_TEMPLATES);
    const protagonists = ['a warrior', 'a mage', 'a rogue', 'a knight'];
    const protagonist = rng.pick(protagonists);

    return `${template.beginning} ${protagonist} ${template.action} ${template.ending}`;
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
    const classesKey = alignment as keyof typeof SKILL_POOLS;
    const classes = SKILL_POOLS[classesKey] || SKILL_POOLS.neutral;

    // Pick a random skill from the alignment pool as the class name base
    const skill = rng.pick(classes);
    charClass.name = skill.name;

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
