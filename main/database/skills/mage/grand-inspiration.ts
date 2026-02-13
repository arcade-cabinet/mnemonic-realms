import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-07',
  name: 'Grand Inspiration',
  description: 'Ultimate: dual-element AoE.',
  spCost: 55,
  power: 300,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class GrandInspiration {}
