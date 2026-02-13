import { Item } from '@rpgjs/database';

// Category: special
// Max stack: 5
// Tier: 1
@Item({
  id: 'C-SP-05',
  name: 'Smoke Bomb',
  description: 'Guaranteed flee from non-boss encounters.',
  price: 40,
  consumable: true,
})
export default class SmokeBomb {}
