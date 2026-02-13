import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-02',
  name: 'Sorrowful Cleanse',
  description: 'Debuff removal with fallback heal.',
  spCost: 8,
  power: 0.5,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class SorrowfulCleanse {}
