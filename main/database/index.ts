// Actors

// Enemies
import { DarkKnight } from './actors/darkKnight';
import { Goblin } from './actors/goblin';
import { Hero } from './actors/hero';
import { Skeleton } from './actors/skeleton';
import { Slime } from './actors/slime';
import { Wolf } from './actors/wolf';
// Armor
import { SteelHelmet } from './armor/helmet';
import { LeatherArmor } from './armor/leather';
import { MysticRobe } from './armor/robe';
import { IronShield } from './armor/shield';
// Classes
import { Cleric } from './classes/cleric';
import { Mage } from './classes/mage';
import { Rogue } from './classes/rogue';
import { Warrior } from './classes/warrior';
// Items
import { Antidote } from './items/antidote';
import { Elixir } from './items/elixir';
import { HiPotion } from './items/hiPotion';
import { ManaPotion } from './items/manaPotion';
import { Potion } from './items/potion';
import { BattleScroll } from './items/scroll';
// Skills
import { Backstab } from './skills/backstab';
import { Berserk } from './skills/berserk';
import { Cure } from './skills/cure';
import { Fireball } from './skills/fireball';
import { Heal } from './skills/heal';
import { IceBolt } from './skills/iceBolt';
import { PoisonStrike } from './skills/poisonStrike';
import { PowerStrike } from './skills/powerStrike';
import { Slash } from './skills/slash';
// States
import { Poison } from './states/poison';
// Weapons
import { BattleAxe } from './weapons/axe';
import { Longbow } from './weapons/bow';
import { ShadowDagger } from './weapons/dagger';
import { ArcaneStaff } from './weapons/staff';
import { IronSword } from './weapons/sword';

export default {
  // Actors
  Hero,
  // Enemies
  Slime,
  Wolf,
  Skeleton,
  Goblin,
  DarkKnight,
  // Classes
  Warrior,
  Mage,
  Rogue,
  Cleric,
  // Weapons
  IronSword,
  Longbow,
  ArcaneStaff,
  ShadowDagger,
  BattleAxe,
  // Armor
  IronShield,
  SteelHelmet,
  MysticRobe,
  LeatherArmor,
  // Items
  Potion,
  HiPotion,
  ManaPotion,
  Antidote,
  Elixir,
  BattleScroll,
  // Skills
  Slash,
  PowerStrike,
  Fireball,
  Heal,
  Backstab,
  IceBolt,
  Cure,
  Berserk,
  PoisonStrike,
  // States
  Poison,
};

// Named exports for direct imports
export {
  Hero,
  Slime,
  Wolf,
  Skeleton,
  Goblin,
  DarkKnight,
  Warrior,
  Mage,
  Rogue,
  Cleric,
  IronSword,
  Longbow,
  ArcaneStaff,
  ShadowDagger,
  BattleAxe,
  IronShield,
  SteelHelmet,
  MysticRobe,
  LeatherArmor,
  Potion,
  HiPotion,
  ManaPotion,
  Antidote,
  Elixir,
  BattleScroll,
  Slash,
  PowerStrike,
  Fireball,
  Heal,
  Backstab,
  IceBolt,
  Cure,
  Berserk,
  PoisonStrike,
  Poison,
};
