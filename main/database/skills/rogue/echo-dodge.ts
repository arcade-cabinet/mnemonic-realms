import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-02',
  name: 'Echo Dodge',
  description: 'Passive evasion scaling with level. Cap 60%.',
  spCost: 0,
  power: 0,
  hitRate: 1,
  coefficient: { int: 0 },
})
export default class EchoDodge {}
