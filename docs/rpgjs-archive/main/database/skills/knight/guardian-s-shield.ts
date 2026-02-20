import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-02',
  name: "Guardian's Shield",
  description: 'Tank skill redirecting damage from an ally.',
  spCost: 8,
  power: 0, // This is a utility skill, not a direct damage or healing skill
  hitRate: 1, // Default hit rate, not applicable for this type of skill
  coefficient: {}, // This skill's effect does not scale with any character stat
})
export default class GuardiansShield {
  // Formula: 50% of all single-target damage aimed at the chosen ally this turn is redirected to the Knight at full value. AoE damage is not redirected. Does not stack (only one Guardian's Shield active per turn).
}
