import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-C1',
  name: 'Wrathful Oath',
  description: 'Converts fulfilled oaths into permanent ATK.',
  spCost: 0,
  power: 0,
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class WrathfulOath {
  // Formula: Passive: Each fulfilled oath grants +3% ATK (stacking).
}
