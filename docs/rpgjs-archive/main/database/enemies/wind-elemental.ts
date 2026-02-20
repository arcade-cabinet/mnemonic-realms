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
  // - Fragment affinity: Fury / Wind
  // Abilities:
  // - Gust Slash: Physical attack. Deals ATK × 1.3 wind-element damage to one target.
  // - Crosswind: AoE magic attack. Deals INT × 1.0 wind-element damage to all party members. Only used when 2+ Wind Elementals are in the encounter (they combine their wind).
  // - Updraft: Buff one ally. Target gains AGI +30% for 2 turns. Used on the slowest ally in the encounter.
  // Drop table:
  // - C-SC-02: 15% chance
  // - C-BF-04: 10% chance
  // - no drop: 75% chance
}
