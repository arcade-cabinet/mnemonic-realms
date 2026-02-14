import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-DP-05',
  name: 'Abyssal Memory',
  description:
    "The most ancient dissolved memories, given form by the sheer density of the Deepest Memory deposit. They appear as shifting, surreal forms — a face that becomes a landscape that becomes a hand reaching upward. They're the world's oldest memories, predating every civilization, and they're powerful beyond anything the player has faced in the Depths.",
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
  // - Category: depths
  // - Element: Neutral
  // - Fragment affinity: Awe / Neutral
  // Abilities:
  // - Primal Surge: INT * 1.8 random element, single target
  // - Time Fold: AoE 12% max HP fixed damage, ignores DEF, 3-turn CD
  // - Dissolution: self-destruct below 15% HP, INT * 2.0 AoE (preventable with one-shot kill)
  // - Ancient Aura (passive): all status effects last 1 turn shorter
  // Drop table:
  // - C-HP-04 (Elixir): 10% chance
  // - C-SP-04 (Ether): 10% chance
  // - C-SP-09 (Dissolved Essence): 5% chance
}
