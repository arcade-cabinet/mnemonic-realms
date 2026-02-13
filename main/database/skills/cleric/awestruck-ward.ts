import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-03',
  name: 'Awestruck Ward',
  description: 'Damage absorption shield scaling with awe.',
  spCost: 14,
  power: 80,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class AwestruckWard {}
