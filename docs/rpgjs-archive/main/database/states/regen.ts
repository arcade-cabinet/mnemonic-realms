import { State } from '@rpgjs/database';

@State({
  id: 'ST-REGEN',
  name: 'Regen',
  description: 'Recover 5% max HP at start of each turn.',
})
export default class Regen {
  // Duration: 3 turns (managed by game logic, not decorator)
  // Stackable: false (not a decorator property)
}
