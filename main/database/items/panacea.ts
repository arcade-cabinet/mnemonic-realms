import { Item } from '@rpgjs/database';

// Category: status-cure
// Max stack: 5
// Tier: 3
@Item({
  id: 'C-SC-05',
  name: 'Panacea',
  description: 'Cures all status effects on one character.',
  price: 200,
  consumable: true,
  removeStates: [],
})
export default class Panacea {}
