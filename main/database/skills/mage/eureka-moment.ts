import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-04',
  name: 'Eureka Moment',
  description: 'High-damage random-element spell.',
  spCost: 18,
  power: 250, // Corresponds to INT * 2.5 in the formula
  hitRate: 1,
  coefficient: { int: 1 }, // Scales with Intelligence
})
export default class EurekaMoment {
  // Formula: floor((INT * 2.5 - targetDEF * 0.4) * variance * elementMod)
  // This skill targets a random element and has a 30% bonus chance to hit a weakness.
}
