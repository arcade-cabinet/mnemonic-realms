import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-C1',
  name: "Sorrow's Edge",
  description: 'Adds dark damage to every heal cast.',
  spCost: 0,
  power: 36,
  hitRate: 1,
  coefficient: { int: 1 },
  elements: ['dark'],
  variance: 0.1,
})
export default class SorrowsEdge {}
