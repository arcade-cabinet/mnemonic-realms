import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-04',
  name: 'Fury Blessing',
  description: 'Offensive buff for an ally. Cannot self-cast.',
  spCost: 16,
  power: 0,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class FuryBlessing {}
