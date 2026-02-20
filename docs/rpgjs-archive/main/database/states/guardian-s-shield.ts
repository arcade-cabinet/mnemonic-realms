import { State } from '@rpgjs/database';

@State({
  id: 'ST-GUARDIAN',
  name: "Guardian's Shield",
  description: 'Redirects 50% of single-target damage from a chosen ally.',
  // Note: The actual damage redirection logic is handled by the game engine
  // or the skill that applies this state, as it's not a direct decorator property.
})
export default class GuardianShield {
  // Duration: 1 turn (managed by game logic, not a decorator property)
  // Stackable: false (managed by game logic, not a decorator property)
}
