import { Item } from '@rpgjs/database';
// TODO: Import the Poison state class, e.g., import Poison from '../states/poison';

/**
 * Category: status-cure
 * Max stack: 10
 * Tier: 1
 */
@Item({
  id: 'C-SC-01',
  name: 'Antidote',
  description: 'Cures poison.',
  price: 20,
  consumable: true,
  // removeStates: [Poison], // Uncomment and import Poison state when available
})
export default class Antidote {
  // Item properties configured via @Item decorator
}
