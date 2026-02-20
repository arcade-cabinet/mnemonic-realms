import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-08',
  name: 'Flicker Wisp',
  description:
    "Evolved Forest Wisps adapted to the Flickerveil's unstable reality. These are larger, brighter, and more aggressive. They pulse between two states — a bright golden orb and a dim, nearly invisible outline — matching the forest's flickering nature. Their attacks carry light-element energy that dazzles and disorients.",
  parameters: {
    maxhp: { start: 75, end: 75 },
    str: { start: 5, end: 5 },
    int: { start: 24, end: 24 },
    dex: { start: 12, end: 12 },
    agi: { start: 20, end: 20 },
  },
  gain: {
    exp: 70,
    gold: 30,
  },
})
export default class FlickerWisp {
  // Context:
  // - Zone: Flickerveil
  // - Fragment affinity: Awe / Light
  // Abilities:
  // - Prismatic Bolt: Magic attack. Deals INT × 1.5 light-element damage. Single target.
  // - Dazzle Flash: AoE debuff. 30% chance per party member to inflict Stun (skip next turn). No damage. 4-turn cooldown.
  // Drop table:
  // - C-SP-02: 20% chance
  // - no drop: 80% chance
}
