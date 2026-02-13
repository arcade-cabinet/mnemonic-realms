import { Item } from '@rpgjs/database';
import { Poison } from '../states/poison';

@Item({
  name: 'Antidote',
  description: 'Cures poison',
  price: 30,
  consumable: true,
  removeStates: [Poison],
})
export class Antidote {}
