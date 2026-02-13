import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-06',
  name: 'Arcane Barrier',
  description: 'Party-wide magic shield.',
  spCost: 20,
  power: 1,
  hitRate: 1,
  coefficient: { int: 0.5 },
})
export default class ArcaneBarrier {}
