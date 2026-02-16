import { Weapon } from '@rpgjs/database';

// Special effect: Memory Wave AoE radius includes back-row enemies
// Intended for: mage
// Weapon category: wand
// Tier: 2
@Weapon({
  id: 'W-WD-05',
  name: 'Resonance Tuner',
  description:
    'A wand that amplifies magical resonance, extending the reach of Memory Wave to back-row enemies.',
  price: 650,
  atk: 1, // Minimum ATK for a weapon
  paramsModifier: {
    int: { value: 27 },
  },
})
export default class ResonanceTuner {
  // Weapon stats configured via @Weapon decorator
}
