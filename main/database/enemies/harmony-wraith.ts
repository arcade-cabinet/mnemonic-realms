import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-11',
  name: 'Harmony Wraith',
  description:
    'Ghostly figures in flowing robes that drift above the grass, trailing wisps of amber light. They are the most intact remnants of the Choir of the First Dawn — dissolved musicians whose memories crystallized into semi-autonomous forms. They always appear in groups of 2-3 and coordinate their attacks through harmonic resonance. Each Wraith "sings" a different note, and their combined chord creates devastating effects.',
  parameters: {
    maxhp: { start: 100, end: 100 },
    str: { start: 12, end: 12 },
    int: { start: 22, end: 22 },
    dex: { start: 20, end: 20 },
    agi: { start: 18, end: 18 },
  },
  gain: {
    exp: 100,
    gold: 45,
  },
})
export default class HarmonyWraith {
  // Context:
  // - Zone: Resonance Fields
  // - Fragment affinity: Awe / Wind
  // Abilities:
  // - Harmonic Bolt: Magic attack. Deals INT × 1.3 wind-element damage. Damage increases by +15% for each other Harmony Wraith alive in the encounter (2 Wraiths = +15%, 3 = +30%).
  // - Chord of Binding: AoE debuff. Inflicts Slow on all party members. 50% accuracy per target. Only usable when 2+ Wraiths are alive. 4-turn cooldown.
  // - Resonant Heal: Heals one other Wraith for INT × 0.8 HP. Prioritizes the Wraith with the lowest HP. Used when an ally Wraith drops below 50%.
  // Drop table:
  // - C-SP-02: 20% chance
  // - C-BF-02: 8% chance
  // - no drop: 72% chance
}
