import { Item } from '@rpgjs/database';

// Category: healing
// Max stack: 10
// Tier: 2
@Item({
  id: 'C-HP-02',
  name: 'Potion',
  description: 'Restores a moderate amount of HP.',
  price: 80,
  hpValue: 120,
  consumable: true,
})
export default class Potion {
  // Item properties configured via @Item decorator
}
