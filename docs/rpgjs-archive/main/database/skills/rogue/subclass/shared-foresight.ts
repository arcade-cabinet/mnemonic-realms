import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-L1',
  name: 'Shared Foresight',
  description: 'Shares evasion with party at half rate.',
  spCost: 0,
  power: 0, // This is a passive skill, so it has no direct power value for damage/healing.
  // hitRate: 1, // Default value, can be omitted for passive skills.
  coefficient: {}, // This is a passive skill, so it does not scale with stats for direct damage/healing.
})
export default class SharedForesight {
  // Formula: Passive: Echo Dodge's evasion bonus now applies to all allies at half effectiveness.
  // At L15, Rogue evasion = 43% → allies gain 21% evasion.
  // Maximum party evasion from this source: 30% (when Rogue reaches 60% cap).
}
