import { Item } from '@rpgjs/database';

@Item({
  name: 'Potion',
  description: 'Restores 50 HP',
  price: 50,
  hpValue: 50,
  consumable: true,
})
export class Potion {}
