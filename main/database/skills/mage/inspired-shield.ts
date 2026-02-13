import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-03',
  name: 'Inspired Shield',
  description: 'Self-barrier with adaptive element resistance.',
  spCost: 12,
  power: 0.6,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class InspiredShield {}
