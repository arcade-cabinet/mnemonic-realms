import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-07',
  name: 'Grand Inspiration',
  description: 'Ultimate: dual-element AoE.',
  spCost: 55,
  power: 300, // Corresponds to INT * 3.0
  hitRate: 1,
  coefficient: { int: 1 }, // Specifies INT as the primary scaling stat
})
export default class GrandInspiration {
  // Formula: floor((INT * 3.0 - targetDEF * 0.4) * variance * elementMod) AoE. Dual weakness.
}
