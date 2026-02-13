import { Item } from '@rpgjs/database';
import Haste from '../states/haste';
import Slow from '../states/slow';

// Category: status-cure
// Max stack: 10
// Tier: 2
@Item({
  id: 'C-SC-02',
  name: 'Haste Charm',
  description: 'Cures Slow. Grants AGI +20% for 2 turns.',
  price: 60,
  consumable: true,
  removeStates: [Slow],
  addStates: [Haste],
})
export default class HasteCharm {}
