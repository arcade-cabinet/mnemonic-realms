import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-06',
  name: 'Steadfast Wall',
  description: 'Party-wide physical absorption for 1 turn.',
  spCost: 30,
  power: 0,
  hitRate: 1,
  coefficient: {},
})
export default class SteadfastWall {}
