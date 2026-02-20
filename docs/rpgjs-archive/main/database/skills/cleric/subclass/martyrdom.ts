import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-C2',
  name: 'Martyrdom',
  description: 'HP-to-healing conversion for the party.',
  spCost: 35,
  power: 150, // Represents the base "strength" of the healing, even if the actual amount is derived from HP sacrifice.
  hitRate: 1, // Healing skills typically always hit.
  coefficient: { int: 1 }, // Healing scales with INT.
})
export default class Martyrdom {
  // Formula: Sacrifice 40% HP. Allies healed 150% of sacrificed. Below 10% triggers Inspired.
}
