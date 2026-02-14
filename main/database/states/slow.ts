import { State } from '@rpgjs/database';

@State({
  id: 'ST-SLOW',
  name: 'Slow',
  description: 'Agility is halved.',
  paramsModifier: { agi: { rate: -0.5 } },
})
export default class Slow {}
// Duration: 2 turns (managed by game logic, not a decorator property)
// Stackable: false (not a decorator property)
