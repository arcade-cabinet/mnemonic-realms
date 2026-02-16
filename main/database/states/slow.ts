import { State } from '@rpgjs/database';

@State({
  id: 'ST-SLOW',
  name: 'Slow',
  description: 'Agility is halved.',
  paramsModifier: { agi: { rate: -0.5 } },
})
export default class Slow {
  // Status effect configured via @State decorator
}
// Duration: 2 turns (managed by game logic, not a decorator property)
// Stackable: false (not a decorator property)
