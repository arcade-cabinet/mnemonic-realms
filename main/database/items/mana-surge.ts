import { Item } from '@rpgjs/database';

@Item({
  id: 'C-SP-03',
  name: 'Mana Surge',
  description: 'Restores a moderate amount of SP.',
  price: 160,
  consumable: true,
  // SP restoration: 120 (RPG-JS items do not have a native spValue property)
})
// Category: sp-recovery
// Max stack: 10
// Tier: 3
export default class ManaSurge {}
