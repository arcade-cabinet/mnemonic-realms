import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-C1',
  name: "Sorrow's Edge",
  description: 'Adds dark damage to every heal cast.',
  spCost: 0,
  power: 36, // Represents 30% of the standard healing INT multiplier (0.3 * 1.2 = 0.36)
  hitRate: 1,
  coefficient: { int: 1 }, // Scales with INT, as healing does
  elements: ['dark'],
  variance: 0.1, // Standard damage variance (90%-110%)
})
export default class SorrowsEdge {
  // Formula: Passive: heals deal 30% as dark damage to a random enemy.
  // Technical Damage Formula for this skill's output: floor((INT * 0.36 - targetDEF * 0.4) * variance * elementMod)
}
