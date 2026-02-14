import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-04',
  name: 'Fury Blessing',
  description: 'Offensive buff for an ally. Cannot self-cast.',
  spCost: 16,
  power: 0, // This is a buff, not a direct damage or heal skill. Power is set to 0.
  hitRate: 1, // Buffs typically have a 100% hit rate.
  coefficient: { int: 1 }, // Cleric skills often scale with INT, even for buffs.
})
export default class FuryBlessing {
  // Formula: Target gains ATK +30% and INT +30% for 3 turns. Fury charges add (fury_charges × 2%) to both buffs.
}
