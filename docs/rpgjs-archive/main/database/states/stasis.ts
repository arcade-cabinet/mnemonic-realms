import { Effect, State } from '@rpgjs/database';

@State({
  id: 'ST-STASIS',
  name: 'Stasis',
  description: 'Cannot use memory-based class abilities.',
  effects: [Effect.CAN_NOT_SKILL], // Represents inability to use class abilities
})
export default class Stasis {
  // Duration: 2 turns (managed by game logic, not a decorator property)
  // Stackable: false (not a decorator property)
}
