import { State } from '@rpgjs/database';

@State({
  id: 'ST-INSPIRED',
  name: 'Inspired',
  description: 'All stats increased by 20%.',
  paramsModifier: {
    str: { rate: 0.2 },
    int: { rate: 0.2 },
    dex: { rate: 0.2 },
    agi: { rate: 0.2 },
    maxhp: { rate: 0.2 },
    maxsp: { rate: 0.2 },
  },
})
export default class Inspired {
  // Duration: 3 turns (managed by game logic, not decorator)
  // Stackable: false (not a decorator property)
}
