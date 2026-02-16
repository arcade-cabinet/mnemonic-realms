import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-06',
  name: 'Emotional Cascade',
  description: 'Party-wide cleanse with bonus healing.',
  spCost: 28,
  power: 0.3, // Represents the 0.3 multiplier for INT in the healing formula
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class EmotionalCascade {
  // Formula: Remove ALL debuffs from ALL allies. Each debuff removed heals the affected ally for floor(INT × 0.3 × variance).
}
