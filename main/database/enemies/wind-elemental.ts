import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-04',
  name: 'Wind Elemental',
  description:
    "Churning vortices of mountain air and scattered debris — pebbles, leaves, snow crystals all spinning in a contained cyclone. They're born from Kinesis's dormant dream of motion, perpetually swirling at the ridgeline. They attack in groups and coordinate their wind patterns to create cross-drafts that buffet the party.",
  parameters: {
    maxhp: { start: 100, end: 100 },
    str: { start: 18, end: 18 },
    int: { start: 16, end: 16 },
    dex: { start: 16, end: 16 },
    agi: { start: 24, end: 24 },
  },
  gain: {
    exp: 80,
    gold: 38,
  },
})
export default class WindElemental {
  // Context:
  // - Zone: Hollow Ridge
  // - Category: frontier
  // - Element: Wind
  // - Fragment affinity: Fury / Wind
  // Abilities:
  // - Gust Slash: ATK * 1.3 wind-element single target
  // - Crosswind: INT * 1.0 wind AoE (all party), only when 2+ Wind Elementals present
  // - Updraft: buff ally AGI +30% for 2 turns, targets slowest ally
  // Drop table:
  // - C-SC-02 (Haste Charm): 15% chance
  // - C-BF-04 (Haste Seed): 10% chance
}
