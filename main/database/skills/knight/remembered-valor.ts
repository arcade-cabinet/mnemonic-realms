import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-04',
  name: 'Remembered Valor',
  description: 'Party ATK buff with conditional DEF from oaths.',
  spCost: 18,
  power: 0,
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class RememberedValor {
  // Formula: All allies ATK +20% 3 turns. 3+ oaths: also DEF +10%.
}
