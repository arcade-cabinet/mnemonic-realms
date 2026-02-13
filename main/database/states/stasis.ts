import { Effect, State } from '@rpgjs/database';

@State({
  id: 'ST-STASIS',
  name: 'Stasis',
  description: 'Cannot use memory-based class abilities.',
  effects: [Effect.CAN_NOT_SKILL],
})
export default class Stasis {}
