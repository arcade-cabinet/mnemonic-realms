import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-C2',
  name: 'Infinite Ambush',
  description: 'Upgraded Temporal Ambush with three actions.',
  spCost: 55,
  power: 0, // This skill enables actions; its direct power is 0. The enabled actions use their own power.
  hitRate: 1,
  coefficient: { str: 1 }, // Assumed scaling for the actions it enables, if any direct scaling were applied.
})
export default class InfiniteAmbush {
  // Formula for physical actions enabled by this skill: floor((ATK * 1.5 - DEF * 0.8) * variance * elementMod)
  // This skill allows the Rogue to act THREE times this turn.
  // If all three actions target the same enemy, the third action deals +50% bonus damage.
}
