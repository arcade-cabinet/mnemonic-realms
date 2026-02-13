import { Component, Types } from 'ecsy';

// Core identity components
export class Name extends Component<Name> {
  value!: string;
}
Name.schema = {
  value: { type: Types.String, default: '' },
};

export class Description extends Component<Description> {
  value!: string;
}
Description.schema = {
  value: { type: Types.String, default: '' },
};

// Alignment and personality
export class Alignment extends Component<Alignment> {
  type!: 'light' | 'dark' | 'neutral';
  value!: number; // -100 to 100
}
Alignment.schema = {
  type: { type: Types.String, default: 'neutral' },
  value: { type: Types.Number, default: 0 },
};

export class Personality extends Component<Personality> {
  traits!: string[];
}
Personality.schema = {
  traits: { type: Types.Array, default: [] },
};

// Character/NPC specific
export class Dialogue extends Component<Dialogue> {
  lines!: string[];
  personality!: string;
}
Dialogue.schema = {
  lines: { type: Types.Array, default: [] },
  personality: { type: Types.String, default: 'friendly' },
};

export class Backstory extends Component<Backstory> {
  text!: string;
}
Backstory.schema = {
  text: { type: Types.String, default: '' },
};

// Class and skills
export class CharacterClass extends Component<CharacterClass> {
  name!: string;
  primarySkills!: string[];
}
CharacterClass.schema = {
  name: { type: Types.String, default: '' },
  primarySkills: { type: Types.Array, default: [] },
};

export class Skill extends Component<Skill> {
  name!: string;
  category!: string;
  power!: number;
  description!: string;
}
Skill.schema = {
  name: { type: Types.String, default: '' },
  category: { type: Types.String, default: 'combat' },
  power: { type: Types.Number, default: 1 },
  description: { type: Types.String, default: '' },
};

export class SkillMastery extends Component<SkillMastery> {
  combat!: number;
  magic!: number;
  stealth!: number;
  support!: number;
  crafting!: number;
}
SkillMastery.schema = {
  combat: { type: Types.Number, default: 0 },
  magic: { type: Types.Number, default: 0 },
  stealth: { type: Types.Number, default: 0 },
  support: { type: Types.Number, default: 0 },
  crafting: { type: Types.Number, default: 0 },
};

// Location and environment
export class Location extends Component<Location> {
  type!: string;
  coordinates!: { x: number; y: number };
}
Location.schema = {
  type: { type: Types.String, default: 'plains' },
  coordinates: { type: Types.JSON, default: { x: 0, y: 0 } },
};

export class Terrain extends Component<Terrain> {
  type!: string;
  difficulty!: number;
  resources!: string[];
  hazards!: string[];
}
Terrain.schema = {
  type: { type: Types.String, default: 'plains' },
  difficulty: { type: Types.Number, default: 1 },
  resources: { type: Types.Array, default: [] },
  hazards: { type: Types.Array, default: [] },
};

// Room/Dungeon
export class Room extends Component<Room> {
  type!: string;
  difficulty!: number;
  connections!: number;
  contents!: string[];
}
Room.schema = {
  type: { type: Types.String, default: 'combat' },
  difficulty: { type: Types.Number, default: 1 },
  connections: { type: Types.Number, default: 1 },
  contents: { type: Types.Array, default: [] },
};

// Loot and items
export class Item extends Component<Item> {
  type!: string;
  rarity!: number;
  value!: number;
}
Item.schema = {
  type: { type: Types.String, default: 'common' },
  rarity: { type: Types.Number, default: 1 },
  value: { type: Types.Number, default: 1 },
};

export class Loot extends Component<Loot> {
  items!: string[];
  gold!: number;
}
Loot.schema = {
  items: { type: Types.Array, default: [] },
  gold: { type: Types.Number, default: 0 },
};

// Seed information
export class Seed extends Component<Seed> {
  value!: string;
  adjectives!: string[];
  noun!: string;
}
Seed.schema = {
  value: { type: Types.String, default: '' },
  adjectives: { type: Types.Array, default: [] },
  noun: { type: Types.String, default: '' },
};

// Word pool archetypes - stores references to word categories
export class NameArchetype extends Component<NameArchetype> {
  syllableSet!: number; // Index into syllable pools
  titleCategory!: number; // Index into title categories
}
NameArchetype.schema = {
  syllableSet: { type: Types.Number, default: 0 },
  titleCategory: { type: Types.Number, default: 0 },
};

export class DialogueArchetype extends Component<DialogueArchetype> {
  greetingStyle!: number;
  questHookType!: number;
}
DialogueArchetype.schema = {
  greetingStyle: { type: Types.Number, default: 0 },
  questHookType: { type: Types.Number, default: 0 },
};

export class TerrainArchetype extends Component<TerrainArchetype> {
  biomeId!: number;
  resourceTier!: number;
}
TerrainArchetype.schema = {
  biomeId: { type: Types.Number, default: 0 },
  resourceTier: { type: Types.Number, default: 0 },
};

export class RoomArchetype extends Component<RoomArchetype> {
  layoutType!: number;
  dangerLevel!: number;
}
RoomArchetype.schema = {
  layoutType: { type: Types.Number, default: 0 },
  dangerLevel: { type: Types.Number, default: 0 },
};
