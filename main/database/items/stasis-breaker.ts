import { Item } from '@rpgjs/database';

/**
 * Category: status-cure
 * Max stack: 10
 * Tier: 2
 */
@Item({
  id: 'C-SC-04',
  name: 'Stasis Breaker',
  description: 'Cure Stasis. Grant immunity to Stasis for 3 turns.',
  price: 120,
  consumable: true,
})
export default class StasisBreaker {}
