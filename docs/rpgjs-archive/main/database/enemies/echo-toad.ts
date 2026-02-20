import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-02',
  name: 'Echo Toad',
  description:
    'Large, bloated amphibians whose croaks carry dissolved memory energy. Their skin shimmers with reflected memory-light, and their eyes glow amber. When they croak, the sound hangs in the air as a visible ripple. Their most dangerous trick: they can split into duplicates made of solidified sound.',
  parameters: {
    maxhp: { start: 90, end: 90 },
    str: { start: 15, end: 15 },
    int: { start: 18, end: 18 },
    dex: { start: 18, end: 18 },
    agi: { start: 14, end: 14 },
  },
  gain: {
    exp: 75,
    gold: 35,
  },
})
export default class EchoToad {
  // Context:
  // - Zone: Shimmer Marsh
  // - Fragment affinity: Awe / Water
  // Abilities:
  // - Resonant Croak: Magic attack. Deals INT × 1.4 water-element damage to all party members. Used every other turn.
  // - Echo Split: Creates 1 Echo Duplicate (HP 30, ATK 10, DEF 8, AGI 14). The duplicate attacks with a basic croak (INT × 0.8 single target). Max 2 duplicates active. Duplicates yield no rewards.
  // - Memory Drain: Single target. Deals INT × 1.0 damage and drains 10 SP from the target. Used when the Toad has 0 active duplicates.
  // Drop table:
  // - C-SP-02: 20% chance
  // - C-HP-02: 10% chance
  // - no drop: 70% chance
}
