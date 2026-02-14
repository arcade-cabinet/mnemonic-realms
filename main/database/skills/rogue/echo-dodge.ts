import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-02',
  name: 'Echo Dodge',
  description: 'Passive evasion scaling with level. Cap 60%.',
  spCost: 0,
  power: 0, // This is a passive skill, not dealing damage or healing directly.
  hitRate: 1, // Irrelevant for a passive evasion skill.
  coefficient: { int: 0 }, // Irrelevant for a passive evasion skill, set to 0 to indicate no stat scaling for power.
})
export default class EchoDodge {
  // Formula: Passive: evasion = min(0.60, 0.15 + 0.02 * (level-1)) + memory_bonus
}
