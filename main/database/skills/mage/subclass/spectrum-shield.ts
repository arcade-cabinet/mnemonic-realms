import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-L2',
  name: 'Spectrum Shield',
  description: 'Strong ST shield with universal resistance.',
  spCost: 20,
  power: 100, // Represents 1.0x multiplier for INT
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class SpectrumShield {
  // Formula: Shield absorbs floor(INT * 1.0) damage on one ally.
  // The barrier automatically matches the element of any incoming attack (always counts as resistant — incoming damage of any element is reduced by 50% while the shield holds). Lasts 2 turns.
}
