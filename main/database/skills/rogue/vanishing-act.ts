import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-06',
  name: 'Vanishing Act',
  description: 'Stealth with double-damage break.',
  spCost: 22,
  power: 0, // This is a buff skill, not a direct damage or heal.
  hitRate: 1,
  coefficient: {}, // This skill does not scale with any stats directly.
})
export default class VanishingAct {
  // Formula: Invisible 2 turns. Immune ST. Next attack 2.0x. AoE still hits.
}
