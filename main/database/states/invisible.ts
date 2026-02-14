import { State } from '@rpgjs/database';

@State({
  id: 'ST-INVISIBLE',
  name: 'Invisible',
  description: 'Immune to single-target attacks. Next attack deals 2.0x damage.',
  paramsModifier: {
    str: { rate: 1.0 }, // Represents a +100% increase in Strength, effectively doubling physical attack damage.
    // For magic attacks, 'int: { rate: 1.0 }' could be added if applicable.
  },
})
export default class Invisible {
  // Duration: 2 turns (managed by game logic, not the decorator)
  // Stackable: false (managed by game logic, not the decorator)
}
