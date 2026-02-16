import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-L1',
  name: 'Chromatic Mastery',
  description: 'Removes Memory Wave randomness and amplifies weakness exploitation.',
  spCost: 0,
  power: 0, // This is a passive skill, so it has no direct power.
  hitRate: 1, // Default hit rate, not applicable for a passive effect.
  coefficient: {}, // This is a passive skill, so it does not scale with stats directly.
})
export default class ChromaticMastery {
  // Formula: Passive: Memory Wave element becomes player-chosen. Elemental weakness damage increases from 1.5x to 1.75x for all Mage spells.
}
