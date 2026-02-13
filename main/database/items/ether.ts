import { Item } from '@rpgjs/database';

// Category: sp-recovery
// Max stack: 5
// Tier: 3
@Item({
  id: 'C-SP-04',
  name: 'Ether',
  description: 'Restores all SP.',
  price: 450,
  consumable: true,
})
export default class Ether {}
