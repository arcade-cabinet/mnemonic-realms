import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-01',
  name: 'Foreshadow Strike',
  description: 'Basic attack with speed bonus damage.',
  spCost: 0,
  power: 180,
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class ForeshadowStrike {}
