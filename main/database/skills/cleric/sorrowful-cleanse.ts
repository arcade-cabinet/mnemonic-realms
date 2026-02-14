import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-02',
  name: 'Sorrowful Cleanse',
  description: 'Debuff removal with fallback heal.',
  spCost: 8,
  power: 0.5, // Base power for the fallback heal (INT * 0.5)
  hitRate: 1,
  coefficient: { int: 1 }, // Scales with INT for healing
})
export default class SorrowfulCleanse {
  // Formula: Remove one debuff from the target (Poison, Slow, Weakness, Stasis, Stun).
  // If no debuff is present, heals for floor(INT × 0.5 × variance) instead.
  // Sorrow charges add a bonus heal on successful cleanse: sorrow_charges × 5% of target's max HP.
}
