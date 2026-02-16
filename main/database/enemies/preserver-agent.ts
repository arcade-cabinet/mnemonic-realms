import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-PV-02',
  name: 'Preserver Agent',
  description:
    "More heavily armored Preservers in crystalline plate mail. Their faceplates are fully opaque — no features visible. They carry crystal halberds and deploy stasis fields that restrict movement. They're the Preservers' enforcers — less polite than Scouts, more focused on neutralization.",
  parameters: {
    maxhp: { start: 180, end: 180 },
    str: { start: 28, end: 28 },
    int: { start: 22, end: 22 },
    dex: { start: 28, end: 28 },
    agi: { start: 12, end: 12 },
  },
  gain: {
    exp: 150,
    gold: 60,
  },
})
export default class PreserverAgent {
  // Context:
  // - Zone: Hollow Ridge, Flickerveil, Resonance Fields
  // - Category: preserver
  // - Element: Neutral
  // - Fragment affinity: Calm / Neutral
  // Abilities:
  // - Stasis Halberd: ATK * 1.4, 30% chance to inflict Stasis
  // - Crystal Field: AoE AGI -20% for 3 turns, 4-turn CD
  // - Reinforced Stance: below 40% HP gains +25% DEF, Stasis chance -> 50%
  // Drop table:
  // - C-SC-04 (Stasis Breaker): 25% chance
  // - C-SC-03 (Fortify Tonic): 15% chance
  // - C-HP-02 (Potion): 10% chance
}
