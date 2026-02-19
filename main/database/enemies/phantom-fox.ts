import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-06',
  name: 'Phantom Fox',
  description:
    'Sleek fox-like creatures that phase between fully rendered and sketch-outline. They flicker in and out of visibility mid-combat, striking from unexpected angles. Their fur shifts between silver and transparent, and their eyes are the only consistently visible part — two amber points floating through the flickering forest.',
  parameters: {
    maxhp: { start: 85, end: 85 },
    str: { start: 20, end: 20 },
    int: { start: 10, end: 10 },
    dex: { start: 14, end: 14 },
    agi: { start: 28, end: 28 },
  },
  gain: {
    exp: 80,
    gold: 35,
  },
})
export default class PhantomFox {
  // Context:
  // - Zone: Flickerveil
  // - Fragment affinity: Calm / Wind
  // Abilities:
  // - Phase Strike: Physical attack. Deals ATK × 1.5 damage. If the Fox is in "phased" state, this attack ignores 50% of target's DEF.
  // - Flicker Phase: Toggle ability. The Fox alternates between visible and phased state each turn. While phased: physical attacks against it have 40% chance to miss. Magic attacks are unaffected.
  // - Pack Howl: Buff all Phantom Foxes in the encounter: ATK +15% for 2 turns. Used on the Fox's first turn if 2+ Foxes are present.
  // Drop table:
  // - C-SP-05: 20% chance
  // - C-SC-02: 10% chance
  // - no drop: 70% chance
}
