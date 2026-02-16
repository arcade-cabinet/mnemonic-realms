import { Item } from '@rpgjs/database';
// TODO: Create a Stasis state class and import it.
// import Stasis from '../states/stasis';

/**
 * Category: special
 * Max stack: 5
 * Tier: 3
 */
@Item({
  id: 'C-SP-07',
  name: 'Stasis Shard',
  description: 'Freeze one non-boss enemy for 2 turns (cannot act).',
  price: 150,
  consumable: true,
  // TODO: Uncomment and add the Stasis state class once created.
  // addStates: [Stasis],
})
export default class StasisShard {
  // Item properties configured via @Item decorator
}
