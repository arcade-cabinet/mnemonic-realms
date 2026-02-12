import { SeededRandom } from '../utils/seededRandom';

const SYLLABLES = {
  start: [
    'ael',
    'bra',
    'cal',
    'dar',
    'el',
    'far',
    'gal',
    'hal',
    'ith',
    'jor',
    'kal',
    'lor',
    'mar',
    'nar',
    'or',
    'pyr',
    'qua',
    'ral',
    'sar',
    'tar',
    'ul',
    'val',
    'wyr',
    'xal',
    'yor',
    'zar',
  ],
  middle: [
    'an',
    'ben',
    'cir',
    'den',
    'el',
    'fin',
    'gan',
    'hen',
    'ion',
    'jin',
    'kor',
    'len',
    'mir',
    'nen',
    'on',
    'par',
    'qil',
    'ren',
    'sen',
    'ten',
    'un',
    'vin',
    'wen',
    'xen',
    'yon',
    'zen',
  ],
  end: [
    'a',
    'as',
    'en',
    'er',
    'ia',
    'is',
    'on',
    'or',
    'us',
    'ath',
    'eth',
    'ith',
    'oth',
    'uth',
    'ax',
    'ex',
    'ix',
    'ox',
    'ux',
    'al',
    'el',
    'il',
    'ol',
    'ul',
  ],
};

const TITLES = [
  'the Brave',
  'the Wise',
  'the Swift',
  'the Strong',
  'the Cunning',
  'the Noble',
  'the Ancient',
  'the Young',
  'the Fierce',
  'the Gentle',
  'the Bold',
  'the Clever',
  'the Mysterious',
  'the Wanderer',
  'the Guardian',
  'Shadowblade',
  'Lightbringer',
  'Stormcaller',
  'Earthshaker',
  'Flameheart',
  'Frostborn',
  'Nightwhisper',
  'Dawnseeker',
  'Stargazer',
  'Moonwalker',
];

const PLACE_PREFIXES = [
  'Shadow',
  'Light',
  'Dark',
  'Bright',
  'Ancient',
  'Lost',
  'Forgotten',
  'Hidden',
  'Sacred',
  'Cursed',
  'Blessed',
  'Mystic',
  'Crystal',
  'Iron',
  'Silver',
  'Golden',
  'Emerald',
  'Crimson',
  'Azure',
  'Obsidian',
];

const PLACE_SUFFIXES = [
  'vale',
  'holm',
  'wood',
  'mere',
  'shire',
  'ton',
  'keep',
  'hold',
  'ford',
  'haven',
  'port',
  'burg',
  'dale',
  'glen',
  'fall',
  'peak',
  'crest',
  'ridge',
  'gate',
  'watch',
];

/**
 * Deterministic name generator
 */
export class NameGenerator {
  private rng: SeededRandom;

  constructor(seed: string) {
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate a character name
   */
  generateCharacterName(): string {
    const syllableCount = this.rng.randomInt(2, 3);
    let name = this.rng.pick(SYLLABLES.start);

    for (let i = 1; i < syllableCount - 1; i++) {
      name += this.rng.pick(SYLLABLES.middle);
    }

    name += this.rng.pick(SYLLABLES.end);

    // Capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  /**
   * Generate a character name with title
   */
  generateCharacterWithTitle(): string {
    const name = this.generateCharacterName();
    const title = this.rng.pick(TITLES);
    return `${name} ${title}`;
  }

  /**
   * Generate a place name
   */
  generatePlaceName(): string {
    const prefix = this.rng.pick(PLACE_PREFIXES);
    const suffix = this.rng.pick(PLACE_SUFFIXES);
    return `${prefix}${suffix}`;
  }

  /**
   * Generate an item name
   */
  generateItemName(type: 'weapon' | 'armor' | 'potion' | 'artifact'): string {
    const adjectives = [
      'Ancient',
      'Legendary',
      'Mystical',
      'Enchanted',
      'Cursed',
      'Blessed',
      'Divine',
      'Infernal',
      'Radiant',
      'Shadow',
    ];
    const materials = [
      'Steel',
      'Iron',
      'Silver',
      'Gold',
      'Crystal',
      'Obsidian',
      'Mythril',
      'Adamantine',
    ];

    const adj = this.rng.pick(adjectives);
    const mat = this.rng.pick(materials);

    const itemTypes = {
      weapon: ['Sword', 'Axe', 'Bow', 'Staff', 'Dagger', 'Spear', 'Mace', 'Hammer'],
      armor: ['Helm', 'Chestplate', 'Gauntlets', 'Greaves', 'Shield', 'Bracers'],
      potion: ['Elixir', 'Draught', 'Tonic', 'Brew', 'Philtre', 'Essence'],
      artifact: ['Amulet', 'Ring', 'Crown', 'Scepter', 'Orb', 'Tome', 'Relic'],
    };

    const itemType = this.rng.pick(itemTypes[type]);
    return `${adj} ${mat} ${itemType}`;
  }
}
