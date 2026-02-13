import { Item } from '@rpgjs/database';

@Item({
  name: 'Mana Potion',
  description: 'Restores 50 SP',
  price: 80,
  spValue: 50,
  consumable: true,
})
export class ManaPotion {}
