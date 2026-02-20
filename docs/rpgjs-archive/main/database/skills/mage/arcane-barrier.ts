import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-06',
  name: 'Arcane Barrier',
  description: 'Party-wide magic shield.',
  spCost: 20,
  power: 1, // Base power for a shield, scaled by coefficient
  hitRate: 1, // Shields do not miss
  coefficient: { int: 0.5 }, // Scales with INT * 0.5
})
export default class ArcaneBarrier {
  // Formula: Each ally receives a shield absorbing floor(INT × 0.5) damage. Lasts 2 turns.
}
