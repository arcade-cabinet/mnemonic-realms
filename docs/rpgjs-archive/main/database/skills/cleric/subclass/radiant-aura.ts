import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-L1',
  name: 'Radiant Aura',
  description: 'Passive party-wide HP regeneration.',
  spCost: 0,
  // For passive skills that don't directly use power/coefficient for their main effect,
  // these values are often nominal or reflect a potential underlying scaling if it were active.
  // Since the actual effect is "3% max HP regen", power is set to 0 as it's not a direct damage/heal value.
  power: 0,
  hitRate: 1, // Passive effects are generally guaranteed.
  // If this skill were to have a scaling component for its *base* healing, INT would be appropriate.
  // However, the 3% max HP regen is fixed, so this coefficient is largely symbolic here.
  coefficient: { int: 1 },
})
export default class RadiantAura {
  // Formula: Passive: allies regen 3% max HP end of turn.
  // This effect is typically implemented via game logic (e.g., in a player or party class's turn-end hook)
  // when the Cleric is active and has this skill.
}
