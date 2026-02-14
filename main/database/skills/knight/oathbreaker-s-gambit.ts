import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-05',
  name: "Oathbreaker's Gambit",
  description: 'Sacrifice one oath for devastating ST strike.',
  spCost: 25,
  power: 300, // Corresponds to ATK * 3.0 in the formula
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class OathbreakersGambit {
  // Formula: floor((ATK * 3.0 - targetDEF * 0.8) * variance * elementMod)
}
