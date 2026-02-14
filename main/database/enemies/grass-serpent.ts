import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SL-02',
  name: 'Grass Serpent',
  description:
    'Long, sinuous creatures that hide in tall wheat. They ambush by lunging from the grass, their scales shimmering with muted green and gold.',
  parameters: {
    maxhp: { start: 45, end: 45 },
    str: { start: 8, end: 8 },
    int: { start: 2, end: 2 },
    dex: { start: 5, end: 5 },
    agi: { start: 10, end: 10 },
  },
  gain: {
    exp: 25,
    gold: 12,
    // items: [
    //   { nb: 1, item: Antidote, chance: 0.20 }, // Assuming Antidote is C-SC-01
    //   { nb: 1, item: MinorPotion, chance: 0.10 }, // Assuming MinorPotion is C-HP-01
    // ]
  },
})
export default class GrassSerpent {
  // Zone: Heartfield
  // Category: settled
  // Fragment affinity: Calm / Earth
  // Abilities:
  // - Lunge: ATK * 1.2 physical damage. If acts first in encounter (ambush), deals ATK * 1.5 instead.
  // - Coil: Self-buff. DEF +30% for 2 turns. Used when below 50% HP.
  // Drop table:
  // - C-SC-01 (Antidote): 20% chance
  // - C-HP-01 (Minor Potion): 10% chance
}
