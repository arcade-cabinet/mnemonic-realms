import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-C2',
  name: 'Martyrdom',
  description: 'HP-to-healing conversion for the party.',
  spCost: 35,
  power: 150,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class Martyrdom {}
