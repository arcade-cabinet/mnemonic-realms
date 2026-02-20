import { Item } from '@rpgjs/database';

// Category: healing
// Max stack: 10
// Tier: 3
@Item({
  id: 'C-HP-03',
  name: 'High Potion',
  description: 'Restores a significant amount of HP.',
  price: 180,
  hpValue: 250,
  consumable: true,
})
export default class HighPotion {
  // Item properties configured via @Item decorator
}
