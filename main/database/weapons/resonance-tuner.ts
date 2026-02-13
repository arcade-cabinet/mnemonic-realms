import { Weapon } from '@rpgjs/database';

// Tier: 2
@Weapon({
  id: 'W-WD-05',
  name: 'Resonance Tuner',
  description:
    'A wand that amplifies magical resonance, extending the reach of Memory Wave to back-row enemies.',
  price: 650,
  atk: 1,
  paramsModifier: {
    int: { value: 27 },
  },
})
export default class ResonanceTuner {}
