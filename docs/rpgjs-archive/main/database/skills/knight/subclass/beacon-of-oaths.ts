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
export default class BeaconOfOaths {
  // Formula: Passive: All allies gain +10% DEF passively while the Knight is conscious (HP > 0).
  // If the Knight has 3+ active oaths, the bonus doubles to +20% DEF.
}
