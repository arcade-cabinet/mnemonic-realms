import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-07',
  name: 'Unbroken Promise',
  description: 'Last stand auto-heal with ATK boost.',
  spCost: 40,
  power: 0,
  hitRate: 1,
  coefficient: { maxhp: 0.35 },
})
export default class UnbrokenPromise {}
