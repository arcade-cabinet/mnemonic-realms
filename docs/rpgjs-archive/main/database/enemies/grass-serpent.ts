import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SL-02',
  name: 'Grass Serpent',
  description:
    'Long, sinuous creatures that hide in the tall wheat. They ambush by lunging from the grass — the player gets a brief shadow warning on the tile before the attack. Their scales shimmer with muted green and gold, and they hiss with a sound like wind through stalks.',
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
  },
})
export default class GrassSerpent {
  // Context:
  // - Zone: Heartfield
  // - Fragment affinity: Calm / Earth
  // Abilities:
  // - Lunge: Basic attack. Deals ATK × 1.2 physical damage. This is the ambush attack — if the Grass Serpent acts first in the encounter (likely due to high AGI), Lunge deals ATK × 1.5 instead.
  // - Coil: Self-buff. DEF +30% for 2 turns. Used when below 50% HP.
  // Drop table:
  // - C-SC-01: 20% chance
  // - C-HP-01: 10% chance
  // - no drop: 70% chance
}
