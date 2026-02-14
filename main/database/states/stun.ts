import { Effect, State } from '@rpgjs/database';

@State({
  id: 'ST-STUN',
  name: 'Stun',
  description: 'Cannot act.',
  effects: [Effect.CAN_NOT_SKILL, Effect.CAN_NOT_ITEM],
})
export default class Stun {
  // Duration: 1 turn (managed by game logic, not decorator)
  // Stackable: false (not a decorator property)
}
