import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-C1',
  name: 'Time Scar',
  description: 'Amplifies Foreshadow Strike with AGI debuff.',
  spCost: 0,
  power: 0,
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class TimeScar {}
