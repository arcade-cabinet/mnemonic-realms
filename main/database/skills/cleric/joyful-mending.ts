import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-01',
  name: 'Joyful Mending',
  description: 'ST heal scaling with joy charges.',
  spCost: 6,
  power: 120,
  hitRate: 1,
  coefficient: { int: 1 },
  variance: 10,
})
export default class JoyfulMending {}
