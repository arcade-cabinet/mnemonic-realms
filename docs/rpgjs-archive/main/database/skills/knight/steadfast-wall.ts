import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-06',
  name: 'Steadfast Wall',
  description: 'Party-wide physical absorption for 1 turn.',
  spCost: 30,
  power: 0, // This skill does not deal damage or heal directly.
  hitRate: 1, // Effect is guaranteed to apply.
  coefficient: {}, // This skill's effect does not scale with stats in a standard way.
})
export default class SteadfastWall {
  // Formula: For 1 turn, the Knight absorbs ALL single-target physical attacks aimed at any ally.
  // Each absorbed attack deals 70% of its normal damage to the Knight.
  // AoE and magical attacks bypass this entirely.
}
