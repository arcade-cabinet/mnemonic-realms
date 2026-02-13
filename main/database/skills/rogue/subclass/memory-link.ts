import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-L2',
  name: 'Memory Link',
  description: 'Turns evasion into counter-attacks.',
  spCost: 18,
  power: 80,
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class MemoryLink {}
