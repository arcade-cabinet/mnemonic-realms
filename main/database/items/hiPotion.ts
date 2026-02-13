import { Item } from '@rpgjs/database';

@Item({
  name: 'Hi-Potion',
  description: 'Restores 200 HP',
  price: 200,
  hpValue: 200,
  consumable: true,
})
export class HiPotion {}
