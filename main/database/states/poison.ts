import { Effect, State } from '@rpgjs/database';

/**
 * Duration: 3 turns (managed by game logic, not the decorator).
 * Stackable: false (not a decorator property).
 */
@State({
  id: 'ST-POISON',
  name: 'Poison',
  description: 'Lose 5% max HP at end of each turn.',
  effects: [Effect.SLIP_DAMAGE],
})
export default class Poison {}
