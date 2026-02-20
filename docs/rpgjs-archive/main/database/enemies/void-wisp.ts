import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SK-02',
  name: 'Void Wisp',
  description:
    'Dark inversions of the luminous wisps found elsewhere. Where other wisps glow with memory energy, Void Wisps are pockets of absence — dark spheres that absorb light around them. They drift toward solidified areas and consume the detail the player has broadcast, literally unpainting the world.',
  parameters: {
    maxhp: { start: 90, end: 90 },
    str: { start: 15, end: 15 },
    int: { start: 30, end: 30 },
    dex: { start: 20, end: 20 },
    agi: { start: 25, end: 25 },
  },
  gain: {
    exp: 150,
    gold: 55,
  },
})
export default class VoidWisp {
  // Context:
  // - Zone: Luminous Wastes
  // - Fragment affinity: Sorrow / Dark
  // Abilities:
  // - Void Pulse: Magic attack. Deals INT × 1.6 dark-element damage to one target. Ignores 20% of target's DEF.
  // - Vibrancy Drain: Does not deal damage. Instead, reduces the current zone's vibrancy by 2 points. If the Void Wisp is not defeated within 3 turns, it uses this again. This is the only enemy in the game that can reduce vibrancy.
  // Drop table:
  // - C-SP-03: 15% chance
  // - C-SP-06: 8% chance
  // - no drop: 77% chance
}
