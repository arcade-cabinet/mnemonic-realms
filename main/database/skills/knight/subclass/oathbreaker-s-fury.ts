import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-C2',
  name: "Oathbreaker's Fury",
  description: "AoE Oathbreaker's Gambit. Sacrifices one oath.",
  spCost: 35,
  power: 250, // Corresponds to the 2.5 multiplier for ATK in the formula
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class OathbreakersFury {
  // Formula: floor((ATK * 2.5 - targetDEF * 0.8) * variance * elementMod) AoE
}
