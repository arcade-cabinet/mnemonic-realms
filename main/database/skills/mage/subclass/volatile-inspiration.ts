import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-C1',
  name: 'Volatile Inspiration',
  description: 'Makes Eureka Moment a precision strike.',
  spCost: 0,
  power: 0, // This is a passive skill that modifies another skill, not a direct damage skill.
  hitRate: 1,
  coefficient: { int: 1 }, // Indicates it's related to magical abilities, even as a passive.
})
export default class VolatileInspiration {
  // Formula: Passive: Eureka Moment's random element is replaced with a guaranteed element matching the target's weakness (if one exists).
  // If the target has no elemental weakness, Eureka Moment deals +20% bonus damage instead.
}
