import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-L1',
  name: 'Beacon of Oaths',
  description: 'Passive party DEF aura scaling with oath count.',
  spCost: 0,
  power: 0,
  hitRate: 1,
  coefficient: {},
})
export default class BeaconOfOaths {}
