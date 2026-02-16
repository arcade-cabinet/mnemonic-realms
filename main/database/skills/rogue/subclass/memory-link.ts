import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-L2',
  name: 'Memory Link',
  description: 'Turns evasion into counter-attacks.',
  spCost: 18,
  power: 80, // Corresponds to ATK * 0.8 in the counter-attack formula
  hitRate: 1,
  coefficient: { str: 1 }, // Counter-attack scales with STR (ATK)
})
export default class MemoryLink {
  // Formula: For 3 turns, whenever the Rogue successfully evades an attack via Echo Dodge,
  // the attacker takes floor((ATK × 0.8 - attackerDEF × 0.8) × variance) counter-attack damage.
  // Triggers on each dodge.
}
