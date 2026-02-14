import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-05',
  name: 'Phantom Flurry',
  description: 'Multi-hit with Weakness debuff.',
  spCost: 20,
  power: 60, // Represents 0.6 multiplier for ATK
  hitRate: 1,
  coefficient: { str: 1 }, // Scales with Strength (ATK)
})
export default class PhantomFlurry {
  // Formula: 3 independent hits, each dealing floor((ATK × 0.6 - targetDEF × 0.8) × variance × elementMod).
  // Each hit rolls accuracy independently. If all 3 connect, inflict Weakness (DEF -30%) for 2 turns.
}
