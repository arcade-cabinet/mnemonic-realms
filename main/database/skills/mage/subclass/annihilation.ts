import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-C2',
  name: 'Annihilation',
  description: 'Highest ST damage. DEF-ignoring with recoil.',
  spCost: 60,
  power: 4,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class Annihilation {
  // Formula: floor(INT * 4.0) ignores DEF. 15% of damage dealt is taken as recoil.
}
