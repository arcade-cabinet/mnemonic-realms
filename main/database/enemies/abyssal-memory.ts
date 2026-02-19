import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-DP-05',
  name: 'Abyssal Memory',
  description:
    "The most ancient dissolved memories, given form by the sheer density of the Deepest Memory deposit. They appear as shifting, surreal forms — a face that becomes a landscape that becomes a hand reaching upward. They're the world's oldest memories, predating every civilization, and they're powerful beyond anything the player has faced in the Depths. Fighting them feels like arguing with the concept of time itself.",
  parameters: {
    maxhp: { start: 250, end: 250 },
    str: { start: 35, end: 35 },
    int: { start: 38, end: 38 },
    dex: { start: 35, end: 35 },
    agi: { start: 18, end: 18 },
  },
  gain: {
    exp: 200,
    gold: 90,
  },
})
export default class AbyssalMemory {
  // Context:
  // - Zone: Depths Level 5 (The Deepest Memory)
  // - Fragment affinity: Awe / Neutral
  // Abilities:
  // - Primal Surge: Magic attack. Deals INT × 1.8 damage, random element. Targets one party member.
  // - Time Fold: AoE attack. Deals 12% of each target's max HP as fixed damage. Ignores DEF. 3-turn cooldown.
  // - Dissolution: Self-destruct when HP drops below 15%. Deals INT × 2.0 damage to all party members. Can be prevented by killing the Abyssal Memory in a single hit that takes it from above 15% to 0.
  // Drop table:
  // - C-HP-04: 10% chance
  // - C-SP-04: 10% chance
  // - C-SP-09: 5% chance
  // - no drop: 75% chance
}
