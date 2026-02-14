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
  // - Category: frontier
  // - Element: Wind
  // - Fragment affinity: Calm / Wind
  // Abilities:
  // - Phase Strike: ATK * 1.5 (ignores 50% DEF when phased)
  // - Flicker Phase: toggle visible/phased each turn; phased = 40% physical miss chance
  // - Pack Howl: ATK +15% all Phantom Foxes for 2 turns, first turn if 2+ present
  // Drop table:
  // - C-SP-05 (Smoke Bomb): 20% chance
  // - C-SC-02 (Haste Charm): 10% chance
}
