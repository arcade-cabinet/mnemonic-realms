import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-03',
  name: 'Inspired Shield',
  description: 'Self-barrier with adaptive element resistance.',
  spCost: 12,
  power: 0.6, // Represents the base multiplier for the shield's absorption value
  hitRate: 1, // Self-buffs always hit
  coefficient: { int: 1 }, // Scales with Intelligence
})
export default class InspiredShield {
  // Formula: Creates a magic barrier absorbing up to floor(INT × 0.6) damage. Lasts 2 turns.
  // The barrier's element adapts to the last attack that hit the Mage, gaining resistance.
}
