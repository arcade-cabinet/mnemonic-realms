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
  // - Zone: Hollow Ridge (Shattered Pass), Flickerveil (Resonance Archive), Resonance Fields (Cathedral perimeter)
  // - Fragment affinity: Calm / Neutral
  // Abilities:
  // - Stasis Halberd: Physical attack. Deals ATK × 1.4 damage. 30% chance to inflict Stasis.
  // - Crystal Field: AoE debuff. Creates a field that reduces all party members' AGI by 20% for 3 turns. No damage. 4-turn cooldown.
  // - Reinforced Stance: When the Agent drops below 40% HP, it gains +25% DEF permanently and its Stasis chance increases to 50%. One-time trigger.
  // Drop table:
  // - C-SC-04: 25% chance
  // - C-SC-03: 15% chance
  // - C-HP-02: 10% chance
  // - no drop: 50% chance
}
