import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-05',
  name: 'Elemental Storm',
  description: 'Powerful AoE with element selection.',
  spCost: 24,
  power: 150, // Corresponds to INT * 1.5
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class ElementalStorm {
  // Formula: floor((INT * 1.5 - targetDEF * 0.4) * variance * elementMod). Weakness: 2.0x.
}
