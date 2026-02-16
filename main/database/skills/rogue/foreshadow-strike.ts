import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-01',
  name: 'Foreshadow Strike',
  description: 'Basic attack with speed bonus damage.',
  spCost: 0,
  power: 180, // Represents the base power for the pre-enemy bonus (1.8x)
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class ForeshadowStrike {
  // Formula:
  // If target has NOT acted this turn: floor((ATK * 1.8 - targetDEF * 0.8) * variance * elementMod)
  // If target HAS acted this turn: floor((ATK * 1.3 - targetDEF * 0.8) * variance * elementMod)
}
