import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-PV-01',
  name: 'Preserver Scout',
  description:
    "Humanoid figures in pale blue-white robes with crystalline faceplates. They move with mechanical precision and speak in measured, polite tones even during combat. Their weapons are crystal staffs that project freezing beams. They genuinely believe they're protecting the world.",
  parameters: {
    maxhp: { start: 120, end: 120 },
    str: { start: 20, end: 20 },
    int: { start: 18, end: 18 },
    dex: { start: 22, end: 22 },
    agi: { start: 14, end: 14 },
  },
  gain: {
    exp: 120,
    gold: 50,
  },
})
export default class PreserverScout {
  // Context:
  // - Zone: Sunridge (Preserver Outpost), Shimmer Marsh (Stagnation Bog perimeter), all Frontier zones (rare patrol)
  // - Fragment affinity: Calm / Neutral
  // Abilities:
  // - Crystal Beam: Physical attack. Deals ATK × 1.3 damage. 20% chance to inflict Stasis.
  // - Preservation Protocol: Self-buff. DEF +30%, immunity to Weakness for 3 turns. Used on the Scout's first turn.
  // - Warning: Non-damaging. The Scout announces: "This is your last warning." Inflicts no damage but grants the player a visible "Stasis incoming" indicator on the Scout's next turn (Crystal Beam guaranteed to inflict Stasis). This is the game teaching the player to prepare for Stasis.
  // Drop table:
  // - C-SC-04: 30% chance
  // - C-HP-02: 15% chance
  // - no drop: 55% chance
}
