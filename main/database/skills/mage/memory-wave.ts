import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-02',
  name: 'Memory Wave',
  description: "AoE using last fragment's element.",
  spCost: 10,
  power: 120,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class MemoryWave {}
