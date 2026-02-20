import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-C1',
  name: 'Time Scar',
  description: 'Amplifies Foreshadow Strike with AGI debuff.',
  spCost: 0,
  power: 0, // This is a passive skill that modifies another skill and applies a state, not direct damage.
  hitRate: 1,
  coefficient: { str: 1 }, // Placeholder, as the effect modifies a STR-scaling skill.
})
export default class TimeScar {
  // Formula: Passive: Foreshadow Strike's pre-enemy multiplier increases from 1.8x to 2.2x.
  // Additionally, enemies hit by Foreshadow Strike have AGI reduced by 15% for 2 turns.
}
