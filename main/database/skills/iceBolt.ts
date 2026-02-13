import { Skill } from '@rpgjs/database';

@Skill({
  name: 'Ice Bolt',
  description: 'Launches a shard of magical ice',
  spCost: 10,
  power: 120,
  hitRate: 95,
})
export class IceBolt {}
