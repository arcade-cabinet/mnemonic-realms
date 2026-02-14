import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-07',
  name: 'Emotional Resonance',
  description: 'Ultimate: massive heal plus strongest buff.',
  spCost: 50,
  power: 200,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class EmotionalResonance {
  // Formula: floor(INT * 2.0 * variance) HP. Grant Inspired status (+20% all stats) to all allies for 3 turns.
}
