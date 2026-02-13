import { Effect, State } from '@rpgjs/database';

@State({
  id: 'ST-STUN',
  name: 'Stun',
  description: 'Cannot act.',
  effects: [Effect.CAN_NOT_SKILL, Effect.CAN_NOT_ITEM],
})
export default class Stun {}
