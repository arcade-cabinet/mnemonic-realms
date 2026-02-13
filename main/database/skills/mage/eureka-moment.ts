import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-04',
  name: 'Eureka Moment',
  description: 'High-damage random-element spell.',
  spCost: 18,
  power: 250,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class EurekaMoment {}
