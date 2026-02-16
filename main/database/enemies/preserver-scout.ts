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
  // - Zone: Sunridge (Preserver Outpost), Shimmer Marsh, all Frontier zones (rare)
  // - Category: preserver
  // - Element: Neutral
  // - Fragment affinity: Calm / Neutral
  // Abilities:
  // - Crystal Beam: ATK * 1.3, 20% chance to inflict Stasis
  // - Preservation Protocol: DEF +30%, immunity to Weakness, 3 turns, used first turn
  // - Warning: telegraphs next guaranteed Stasis (teaches player to prepare)
  // Drop table:
  // - C-SC-04 (Stasis Breaker): 30% chance
  // - C-HP-02 (Potion): 15% chance
}
