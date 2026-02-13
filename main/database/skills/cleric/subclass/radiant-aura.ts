import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-L1',
  name: 'Radiant Aura',
  description: 'Passive party-wide HP regeneration.',
  spCost: 0,
  power: 0,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class RadiantAura {}
