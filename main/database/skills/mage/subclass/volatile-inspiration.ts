import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-C1',
  name: 'Volatile Inspiration',
  description: 'Makes Eureka Moment a precision strike.',
  spCost: 0,
  power: 0,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class VolatileInspiration {}
