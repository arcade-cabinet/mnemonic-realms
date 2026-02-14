import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-01',
  name: 'Oath Strike',
  description: 'Basic attack scaling with active oaths.',
  spCost: 0,
  power: 120, // Corresponds to ATK * 1.2
  hitRate: 1,
  coefficient: { str: 1 }, // Scales with Strength (ATK)
})
export default class OathStrike {
  // Formula: floor((ATK * 1.2 * (1 + 0.05 * active_oaths) - targetDEF * 0.8) * variance * elementMod)
}
