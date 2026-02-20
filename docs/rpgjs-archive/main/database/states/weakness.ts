import { State } from '@rpgjs/database';

@State({
  id: 'ST-WEAKNESS',
  name: 'Weakness',
  description: 'Defense is reduced by 30%.',
  paramsModifier: {
    dex: { rate: -0.3 }, // DEF maps to 'dex' in RPG-JS params
  },
})
export default class Weakness {
  // Status effect configured via @State decorator
}
// Duration: 2 turns (managed by game logic, not a decorator property)
// Stackable: false (not a decorator property)
