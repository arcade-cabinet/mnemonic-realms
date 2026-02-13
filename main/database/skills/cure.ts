import { Skill } from '@rpgjs/database';
import { Poison } from '../states/poison';

@Skill({
  name: 'Cure',
  description: 'Removes all status ailments',
  spCost: 6,
  removeStates: [Poison],
})
export class Cure {}
