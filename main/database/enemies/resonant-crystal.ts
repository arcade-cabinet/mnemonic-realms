import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-DP-03',
  name: 'Resonant Crystal',
  description:
    "Living crystalline formations that grow from the cavern walls. They vibrate at frequencies that resonate with the Resonance Stones above, channeling concentrated sound energy into piercing attacks. They're beautiful — prismatic light refracts through their facets — and deadly. When struck, they ring like bells.",
  parameters: {
    maxhp: { start: 150, end: 150 },
    str: { start: 18, end: 18 },
    int: { start: 30, end: 30 },
    dex: { start: 28, end: 28 },
    agi: { start: 10, end: 10 },
  },
  gain: {
    exp: 120,
    gold: 55,
  },
})
export default class ResonantCrystal {
  // Context:
  // - Zone: Depths Level 3 (Resonant Caverns)
  // - Fragment affinity: Awe / Wind
  // Abilities:
  // - Sonic Shard: Magic attack. Deals INT × 1.5 wind-element damage to one target.
  // - Harmonic Burst: AoE magic. Deals INT × 1.0 damage to all targets. 20% chance to inflict Stun per target. 3-turn cooldown.
  // Drop table:
  // - C-SC-04: 15% chance
  // - C-SP-03: 8% chance
  // - no drop: 77% chance
}
