import { Item } from '@rpgjs/database';

@Item({
  id: 'C-SP-03',
  name: 'Mana Surge',
  description: 'Restores a moderate amount of SP.',
  price: 160,
  consumable: true,
})
// Category: sp-recovery
// Max stack: 10
// Tier: 3
export default class ManaSurge {}
