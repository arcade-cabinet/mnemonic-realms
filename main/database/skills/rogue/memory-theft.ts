import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-04',
  name: 'Memory Theft',
  description: 'Damage plus stat theft. Bosses: 5%.',
  spCost: 14,
  power: 1,
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class MemoryTheft {}
