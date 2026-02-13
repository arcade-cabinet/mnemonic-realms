import { Skill } from '@rpgjs/database';
import { Poison } from '../states/poison';

@Skill({
  name: 'Poison Strike',
  description: 'A venomous attack that poisons the target',
  spCost: 8,
  power: 100,
  hitRate: 85,
  addStates: [{ rate: 0.6, state: Poison }],
})
export class PoisonStrike {}
