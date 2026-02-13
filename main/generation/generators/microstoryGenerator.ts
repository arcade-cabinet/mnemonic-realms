import { SeededRandom } from '../seededRandom';

const STORY_BEGINNINGS = [
  'Long ago, in a time now forgotten,',
  'It is said that in the age of heroes,',
  'The ancient texts tell of',
  'Legends speak of',
  'In the twilight of the old world,',
  'When the gods still walked among mortals,',
  'Before the great cataclysm,',
  'In the depths of history,',
];

const PROTAGONISTS = [
  'a brave warrior',
  'a cunning rogue',
  'a wise mage',
  'a noble knight',
  'a humble farmer',
  'a mysterious stranger',
  'a fallen hero',
  'a young apprentice',
  'a vengeful spirit',
  'an ancient dragon',
  'a cursed prince',
  'a forgotten god',
];

const ACTIONS = [
  'discovered a powerful artifact',
  'vanquished a great evil',
  'made a terrible sacrifice',
  'forged an unbreakable bond',
  'betrayed their closest ally',
  'sealed away a dark force',
  'unlocked forbidden knowledge',
  'broke an ancient curse',
];

const CONSEQUENCES = [
  'and the world was forever changed.',
  'but at a terrible cost.',
  'yet the truth was never known.',
  'and so the legend was born.',
  'though the tale is still told today.',
  'and peace was restored to the realm.',
  'but darkness still lingers.',
  'and the cycle begins anew.',
];

const LOCATIONS = [
  'the forgotten temple',
  'the shadow realm',
  'the crystal caves',
  'the abandoned citadel',
  'the eternal forest',
  'the sunken city',
  'the frozen wastes',
  'the burning desert',
  'the floating isles',
  'the underground kingdom',
  'the twilight shore',
  'the mystic grove',
];

const CONFLICTS = [
  'an eternal war between light and darkness',
  'a prophecy foretold in ancient runes',
  'a betrayal that shattered kingdoms',
  'a love that transcended death',
  'a curse that plagued generations',
  'a treasure that brought only ruin',
  'a choice between duty and desire',
  'a secret that could destroy the world',
];

/**
 * Deterministic microstory generator
 */
export class MicrostoryGenerator {
  private rng: SeededRandom;

  constructor(seed: string) {
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate a simple microstory
   */
  generateSimpleStory(): string {
    const beginning = this.rng.pick(STORY_BEGINNINGS);
    const protagonist = this.rng.pick(PROTAGONISTS);
    const action = this.rng.pick(ACTIONS);
    const consequence = this.rng.pick(CONSEQUENCES);

    return `${beginning} ${protagonist} ${action} ${consequence}`;
  }

  /**
   * Generate a location-based story
   */
  generateLocationStory(): string {
    const location = this.rng.pick(LOCATIONS);
    const conflict = this.rng.pick(CONFLICTS);
    const protagonist = this.rng.pick(PROTAGONISTS);
    const consequence = this.rng.pick(CONSEQUENCES);

    return `In ${location}, ${conflict} began when ${protagonist} arrived. ${consequence}`;
  }

  /**
   * Generate a quest backstory
   */
  generateQuestBackstory(): { title: string; story: string; objective: string } {
    const location = this.rng.pick(LOCATIONS);
    const conflict = this.rng.pick(CONFLICTS);
    const action = this.rng.pick(ACTIONS);

    const objectives = [
      'Retrieve the lost artifact',
      'Defeat the ancient evil',
      'Uncover the hidden truth',
      'Break the curse',
      'Restore balance to the realm',
      'Find the missing hero',
      'Prevent the prophecy',
      'Seal the portal',
    ];

    const title = this.rng.pick(objectives);
    const story = `Deep within ${location}, ${conflict}. You must venture forth and ${action.toLowerCase()}.`;
    const objective = title;

    return { title, story, objective };
  }

  /**
   * Generate an NPC backstory
   */
  generateNPCBackstory(): string {
    const origins = [
      'born in a distant land',
      'orphaned at a young age',
      'trained by a legendary master',
      'cursed by dark magic',
      'blessed by the gods',
      'the last of their kind',
      'a survivor of a great war',
      'haunted by their past',
    ];

    const motivations = [
      'seeks redemption',
      'pursues vengeance',
      'searches for truth',
      'protects the innocent',
      'hoards ancient knowledge',
      'fears their destiny',
      'hides a dark secret',
      'yearns for home',
    ];

    const origin = this.rng.pick(origins);
    const motivation = this.rng.pick(motivations);

    return `Once ${origin}, they now ${motivation}.`;
  }
}
