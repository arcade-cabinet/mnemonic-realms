/**
 * ECS Data Pools - Component-based data accessed by archetype indices
 * Replaces giant constant arrays with structured, queryable data
 */

// Syllable pools for name generation (indexed by NameArchetype)
export const SYLLABLE_POOLS = [
  // Pool 0: Classic fantasy
  {
    start: ['ael', 'bra', 'cal', 'dar', 'el', 'far', 'gal', 'hal'],
    middle: ['an', 'ben', 'cir', 'den', 'el', 'fin', 'gan', 'hen'],
    end: ['a', 'as', 'en', 'er', 'ia', 'is', 'on', 'or'],
  },
  // Pool 1: Dark/shadow theme
  {
    start: ['mor', 'nex', 'sha', 'vor', 'zar', 'kha', 'mal', 'dra'],
    middle: ['goth', 'drak', 'mor', 'nex', 'sha', 'zul', 'khar', 'mal'],
    end: ['ax', 'ix', 'oth', 'uth', 'ael', 'oth', 'ur', 'on'],
  },
  // Pool 2: Light/celestial theme
  {
    start: ['aur', 'cel', 'lun', 'sol', 'stel', 'rae', 'luz', 'alba'],
    middle: ['ian', 'iel', 'aria', 'ora', 'ina', 'ela', 'isa', 'ana'],
    end: ['el', 'ia', 'is', 'a', 'yn', 'iel', 'or', 'ar'],
  },
  // Pool 3: Nature/wild theme
  {
    start: ['syl', 'thorn', 'moss', 'oak', 'ash', 'wil', 'fern', 'briar'],
    middle: ['van', 'wen', 'ren', 'leaf', 'wood', 'root', 'brook', 'glen'],
    end: ['is', 'a', 'yn', 'en', 'ara', 'wood', 'leaf', 'root'],
  },
];

// Title categories (indexed by NameArchetype)
export const TITLE_CATEGORIES = [
  // Category 0: Heroic
  ['the Brave', 'the Bold', 'the Valiant', 'the Noble', 'the True'],
  // Category 1: Dark
  ['the Cursed', 'the Shadow', 'the Fallen', 'Nightblade', 'Darkbane'],
  // Category 2: Wise
  ['the Ancient', 'the Wise', 'the Sage', 'Lorekeep', 'Truthseeker'],
  // Category 3: Wild
  ['the Untamed', 'Stormcaller', 'Earthshaker', 'the Feral', 'Wildheart'],
];

// Greeting styles (indexed by DialogueArchetype)
export const GREETING_STYLES = [
  // Style 0: Formal
  ['Greetings, traveler.', 'Well met, stranger.', 'I bid you welcome.'],
  // Style 1: Suspicious
  ['State your business.', 'What brings you here?', 'Speak quickly.'],
  // Style 2: Friendly
  ['Hello friend!', 'Welcome, adventurer!', 'Good to see you!'],
  // Style 3: Mystical
  ['The fates have brought you.', 'I sensed your coming.', 'Destiny unfolds.'],
];

// Quest hook types (indexed by DialogueArchetype)
export const QUEST_HOOK_TYPES = [
  // Type 0: Urgent threat
  ['Darkness gathers nearby.', 'Evil stirs in the depths.', 'Time grows short.'],
  // Type 1: Lost item
  ['I seek a lost artifact.', 'Something precious was stolen.', 'An heirloom is missing.'],
  // Type 2: Rescue mission
  ['Someone needs help.', 'Lives are at stake.', 'Innocents are in danger.'],
  // Type 3: Ancient mystery
  ['Legends speak of secrets.', 'The ancients left clues.', 'A mystery awaits.'],
];

// Biome configurations (indexed by TerrainArchetype)
export const BIOME_CONFIGS = [
  // Biome 0: Plains
  { type: 'plains', resources: ['Wheat', 'Grass'], hazards: ['Bandits'] },
  // Biome 1: Forest
  { type: 'forest', resources: ['Timber', 'Berries'], hazards: ['Wolves'] },
  // Biome 2: Mountain
  { type: 'mountain', resources: ['Iron Ore', 'Gems'], hazards: ['Avalanches'] },
  // Biome 3: Desert
  { type: 'desert', resources: ['Sand Glass', 'Spices'], hazards: ['Sandstorms'] },
  // Biome 4: Swamp
  { type: 'swamp', resources: ['Herbs', 'Bog Iron'], hazards: ['Disease'] },
  // Biome 5: Tundra
  { type: 'tundra', resources: ['Furs', 'Ice Crystals'], hazards: ['Blizzards'] },
  // Biome 6: Volcano
  { type: 'volcano', resources: ['Obsidian', 'Sulfur'], hazards: ['Lava Flows'] },
  // Biome 7: Ocean
  { type: 'ocean', resources: ['Fish', 'Pearls'], hazards: ['Storms'] },
];

// Room layout types (indexed by RoomArchetype)
export const ROOM_LAYOUT_TYPES = [
  // Layout 0: Treasure
  { type: 'treasure', contents: ['Gold', 'Jewels', 'Artifacts'] },
  // Layout 1: Combat
  { type: 'combat', contents: ['Enemies', 'Weapons', 'Armor'] },
  // Layout 2: Puzzle
  { type: 'puzzle', contents: ['Runes', 'Mechanisms', 'Seals'] },
  // Layout 3: Trap
  { type: 'trap', contents: ['Spike Pits', 'Darts', 'Flames'] },
  // Layout 4: Shop
  { type: 'shop', contents: ['Merchant', 'Goods', 'Wares'] },
  // Layout 5: Rest
  { type: 'rest', contents: ['Beds', 'Food', 'Water'] },
  // Layout 6: Boss
  { type: 'boss', contents: ['Boss Enemy', 'Throne', 'Altar'] },
  // Layout 7: Secret
  { type: 'secret', contents: ['Hidden Treasure', 'Relic', 'Portal'] },
];

// Class archetypes based on alignment
export const CLASS_ARCHETYPES = {
  light: ['Paladin', 'Cleric', 'Guardian', 'Templar'],
  dark: ['Necromancer', 'Shadow Assassin', 'Warlock', 'Hexblade'],
  neutral: ['Ranger', 'Monk', 'Druid', 'Mercenary'],
};

// Skill pools by category
export const SKILL_POOLS = {
  light: [
    { name: 'Holy Smite', category: 'combat', description: 'Divine power strike' },
    { name: 'Divine Shield', category: 'support', description: 'Holy protection' },
    { name: 'Healing Touch', category: 'magic', description: 'Restore life' },
  ],
  dark: [
    { name: 'Shadow Strike', category: 'stealth', description: 'Attack from shadows' },
    { name: 'Life Drain', category: 'magic', description: 'Steal life essence' },
    { name: 'Dark Pact', category: 'support', description: 'Sacrifice for power' },
  ],
  neutral: [
    { name: 'Precise Shot', category: 'combat', description: 'Accurate strike' },
    { name: 'Nature Blessing', category: 'support', description: 'Natural power' },
    { name: 'Swift Movement', category: 'stealth', description: 'Enhanced speed' },
  ],
};

// Personality traits mapped to word patterns
export const PERSONALITY_TRAITS = {
  friendly: ['I am glad to see you.', 'You seem trustworthy.'],
  suspicious: ["I don't trust strangers.", 'Prove yourself first.'],
  wise: ['Knowledge is power.', 'Listen well.'],
  jovial: ['Ha! A fine day!', 'Let us share a tale!'],
  mysterious: ['Things are not what they seem.', 'Secrets lie hidden.'],
};

// Story templates for microstories
export const STORY_TEMPLATES = [
  { beginning: 'Long ago,', action: 'discovered', ending: 'and the world changed.' },
  { beginning: 'It is said that', action: 'vanquished', ending: 'but at terrible cost.' },
  { beginning: 'Legends speak of', action: 'sealed away', ending: 'yet darkness lingers.' },
  { beginning: 'In ancient times,', action: 'forged', ending: 'and so the legend was born.' },
];
