import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-03',
  name: 'Shadow Step',
  description: 'Setup skill for guaranteed next hit.',
  spCost: 10,
  power: 0,
  hitRate: 1,
  coefficient: {},
})
export default class ShadowStep {}
