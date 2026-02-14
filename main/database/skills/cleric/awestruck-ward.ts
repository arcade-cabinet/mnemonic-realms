import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-03',
  name: 'Awestruck Ward',
  description: 'Damage absorption shield scaling with awe.',
  spCost: 14,
  power: 80, // Represents 0.8 multiplier for INT
  hitRate: 1, // Shields typically don't miss
  coefficient: { int: 1 }, // Scales with INT
})
export default class AwestruckWard {
  // Formula: Shield absorbs up to floor(INT * 0.8 * (1 + awe_charges * 0.03)) damage. Lasts 3 turns.
}
