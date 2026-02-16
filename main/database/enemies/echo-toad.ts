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
  // - Category: frontier
  // - Element: Water
  // - Fragment affinity: Awe / Water
  // Abilities:
  // - Resonant Croak: INT * 1.4 water AoE (all party), every other turn
  // - Echo Split: creates Echo Duplicate (HP 30, ATK 10, DEF 8, AGI 14), max 2
  // - Memory Drain: INT * 1.0 single target + drain 10 SP, used when 0 duplicates
  // Drop table:
  // - C-SP-02 (Mana Draught): 20% chance
  // - C-HP-02 (Potion): 10% chance
}
