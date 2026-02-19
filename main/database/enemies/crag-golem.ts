import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SL-08',
  name: 'Crag Golem',
  description:
    "Humanoid figures assembled from loose highland rock. They stand motionless near outcrops until the player comes within 3 tiles, then lumber forward with grinding stone steps. Their eyes are chips of amber Resonance Stone — they're animated by dissolved memory energy leaking from the nearby Wind Shrine. Slow and patient. Every swing of their stone fists sends gravel flying.",
  parameters: {
    maxhp: { start: 80, end: 80 },
    str: { start: 13, end: 13 },
    int: { start: 1, end: 1 },
    dex: { start: 15, end: 15 },
    agi: { start: 3, end: 3 },
  },
  gain: {
    exp: 50,
    gold: 20,
  },
})
export default class CragGolem {
  // Context:
  // - Zone: Sunridge
  // - Fragment affinity: Awe / Fire
  // Abilities:
  // - Stone Fist: Basic attack. Deals ATK × 1.3 physical damage. 15% chance to inflict Stun (skip next turn, 1 turn).
  // Drop table:
  // - C-BF-01: 8% chance
  // - C-SC-03: 12% chance
  // - C-HP-01: 15% chance
  // - no drop: 65% chance
}
