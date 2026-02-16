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
export default class MemoryWave {
  // Formula: floor((INT * 1.2 - targetDEF * 0.4) * variance * elementMod) per target
}
