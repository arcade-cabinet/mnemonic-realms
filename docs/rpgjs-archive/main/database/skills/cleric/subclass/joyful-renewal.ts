import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-L2',
  name: 'Joyful Renewal',
  description: 'Emergency auto-heal for allies.',
  spCost: 30,
  power: 120, // Represents the 1.2 multiplier from the base healing formula, though actual effect is heal to 50% HP
  hitRate: 1, // Healing skills typically always hit
  coefficient: { int: 1 }, // Healing scales with INT
})
export default class JoyfulRenewal {
  // Formula: When any ally (not the Cleric themselves) drops below 15% HP,
  // instantly heal them to 50% HP. Does not consume the Cleric's turn.
  // Once per battle. Requires 30 SP available when triggered.
}
