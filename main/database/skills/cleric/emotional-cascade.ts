import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-06',
  name: 'Emotional Cascade',
  description: 'Party-wide cleanse with bonus healing.',
  spCost: 28,
  power: 0.3,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class EmotionalCascade {}
