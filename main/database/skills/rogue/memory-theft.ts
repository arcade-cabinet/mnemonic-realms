import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-04',
  name: 'Memory Theft',
  description: 'Damage plus stat theft. Bosses: 5%.',
  spCost: 14,
  power: 1, // Corresponds to the '1.0' multiplier for ATK in the formula
  hitRate: 1,
  coefficient: { str: 1 }, // Scales with Strength (ATK)
})
export default class MemoryTheft {
  // Formula: floor((ATK × 1.0 - targetDEF × 0.8) × variance) damage.
  // On hit, reduces the enemy's highest stat by 10% for 3 turns and grants the Rogue +10% to the corresponding stat for 3 turns.
  // Against bosses: stat reduction is 5% and buff is +5%.
}
