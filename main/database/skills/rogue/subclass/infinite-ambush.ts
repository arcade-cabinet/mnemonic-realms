import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-C2',
  name: 'Infinite Ambush',
  description: 'Upgraded Temporal Ambush with three actions.',
  spCost: 55,
  power: 0,
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class InfiniteAmbush {}
