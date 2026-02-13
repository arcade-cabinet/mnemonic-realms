import { SeededRandom } from '../seededRandom';

const GREETINGS = [
  'Greetings, traveler.',
  'Well met, stranger.',
  'Ah, a visitor.',
  'Welcome, adventurer.',
  'Ho there!',
  'What brings you here?',
  'State your business.',
  'I bid you welcome.',
];

const QUEST_HOOKS = [
  'I have a task that needs doing.',
  'Perhaps you can help me with something.',
  'There is trouble in these parts.',
  'I seek someone brave enough for a dangerous quest.',
  'The realm faces a great threat.',
  'An ancient evil stirs.',
  'Legends speak of a powerful artifact.',
  'Dark forces gather in the shadows.',
];

const FAREWELL = [
  'Fare thee well.',
  'May fortune favor you.',
  'Safe travels.',
  'Until we meet again.',
  'Go with caution.',
  'The road ahead is perilous.',
  'May the light guide you.',
  'Farewell, brave one.',
];

const PERSONALITY_TRAITS = {
  friendly: [
    'I am glad to see a friendly face.',
    'You seem trustworthy.',
    'I sense goodness in you.',
  ],
  suspicious: [
    "I don't trust strangers easily.",
    'Prove yourself first.',
    'What are your true intentions?',
  ],
  wise: ['The old ways are not forgotten.', 'Knowledge is power.', 'Listen well to my words.'],
  jovial: ['Ha! A fine day for adventure!', 'Let us share a tale!', 'Life is full of wonders!'],
  mysterious: [
    'Things are not what they seem.',
    'The truth lies hidden.',
    'Some secrets are best left buried.',
  ],
};

/**
 * Deterministic dialogue generator
 */
export class DialogueGenerator {
  private rng: SeededRandom;

  constructor(seed: string) {
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate a greeting
   */
  generateGreeting(): string {
    return this.rng.pick(GREETINGS);
  }

  /**
   * Generate a quest hook
   */
  generateQuestHook(): string {
    return this.rng.pick(QUEST_HOOKS);
  }

  /**
   * Generate a farewell
   */
  generateFarewell(): string {
    return this.rng.pick(FAREWELL);
  }

  /**
   * Generate a complete dialogue based on personality
   */
  generateDialogue(personality: keyof typeof PERSONALITY_TRAITS): string[] {
    const greeting = this.generateGreeting();
    const personalityLine = this.rng.pick(PERSONALITY_TRAITS[personality]);
    const hook = this.generateQuestHook();
    const farewell = this.generateFarewell();

    return [greeting, personalityLine, hook, farewell];
  }

  /**
   * Generate a random dialogue with random personality
   */
  generateRandomDialogue(): { personality: string; lines: string[] } {
    const personalities = Object.keys(PERSONALITY_TRAITS) as Array<keyof typeof PERSONALITY_TRAITS>;
    const personality = this.rng.pick(personalities);
    const lines = this.generateDialogue(personality);

    return { personality, lines };
  }
}
