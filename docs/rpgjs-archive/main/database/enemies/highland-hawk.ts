import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SL-07',
  name: 'Highland Hawk',
  description:
    'Swift raptors with wingspans wider than the player is tall. Their feathers are wind-colored — gray-blue that shifts to silver at the tips. They dive-bomb from above, striking with talons before wheeling back into the sky. Between attacks they circle overhead, nearly untouchable.',
  parameters: {
    maxhp: { start: 45, end: 45 },
    str: { start: 11, end: 11 },
    int: { start: 3, end: 3 },
    dex: { start: 6, end: 6 },
    agi: { start: 18, end: 18 },
  },
  gain: {
    exp: 40,
    gold: 18,
  },
})
export default class HighlandHawk {
  // Context:
  // - Zone: Sunridge
  // - Fragment affinity: Fury / Wind
  // Abilities:
  // - Dive Strike: Physical attack. Deals ATK × 1.5 damage. If the Hawk acts first this turn, deals ATK × 1.8 instead (similar to the Rogue's Foreshadow mechanic — teaches the player how speed-based combat works).
  // - Evasive Climb: For 1 turn, the Hawk cannot be targeted by single-target physical attacks (it's circling out of range). AoE and magic still hit. Used every 3rd turn.
  // Drop table:
  // - C-SC-02: 10% chance
  // - C-SP-05: 15% chance
  // - no drop: 75% chance
}
