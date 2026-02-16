import { Item } from '@rpgjs/database';

// Category: healing
// Max stack: 10
// Tier: 1
@Item({
  id: 'C-HP-01',
  name: 'Minor Potion',
  description: 'Restores 50 HP to one character.',
  price: 30,
  hpValue: 50,
  consumable: true,
})
export default class MinorPotion {
  // Item properties configured via @Item decorator
}
