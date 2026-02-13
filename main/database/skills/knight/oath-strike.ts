import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-01',
  name: 'Oath Strike',
  description: 'Basic attack scaling with active oaths.',
  spCost: 0,
  power: 120,
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class OathStrike {}
