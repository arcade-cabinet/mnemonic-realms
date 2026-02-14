import { State } from '@rpgjs/database';

@State({
  id: 'ST-STEADFAST',
  name: 'Steadfast Wall',
  description: 'Absorbing all single-target physical attacks for allies at 70% damage.',
  // Duration: 1 turn (managed by game logic, not a decorator property)
  // Stackable: false (not a decorator property)
})
export default class SteadfastWall {}
