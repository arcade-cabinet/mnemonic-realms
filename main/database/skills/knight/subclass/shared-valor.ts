import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-L2',
  name: 'Shared Valor',
  description: 'Upgraded Remembered Valor with DEF buff and oath sharing.',
  spCost: 22,
  power: 0,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class SharedValor {}
