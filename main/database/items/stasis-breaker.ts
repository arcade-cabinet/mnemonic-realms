import { Item } from '@rpgjs/database';
// TODO: Import Stasis and StasisImmunity state classes
// import Stasis from '../states/stasis';
// import StasisImmunity from '../states/stasis-immunity';

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
  // TODO: Uncomment and add actual state classes when available
  // removeStates: [Stasis],
  // addStates: [{ state: StasisImmunity, rate: 1, turns: 3 }],
})
export default class StasisBreaker {
  // Item properties configured via @Item decorator
}
