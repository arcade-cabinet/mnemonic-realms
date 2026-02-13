import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-03',
  name: 'Vow of Steel',
  description: 'Defensive stance with DEF boost. Disables flee.',
  spCost: 12,
  power: 0,
  hitRate: 1,
  coefficient: {},
})
export default class VowOfSteel {}
