import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SL-03',
  name: 'Forest Wisp',
  description:
    "Ethereal spheres of pale blue-green light that drift between the trees. They're fragments of the Dissolved Choir's music given visible form — each one hums a faint note. They attack with concentrated sound-light bolts. When defeated, they pop like soap bubbles and leave a fading chord.",
  parameters: {
    maxhp: { start: 35, end: 35 },
    str: { start: 3, end: 3 },
    int: { start: 10, end: 10 },
    dex: { start: 4, end: 4 },
    agi: { start: 12, end: 12 },
  },
  gain: {
    exp: 30,
    gold: 14,
  },
})
export default class ForestWisp {
  // Context:
  // - Zone: Ambergrove
  // - Fragment affinity: Awe / Wind
  // Abilities:
  // - Wisp Bolt: Magic attack. Deals INT × 1.5 magical damage (wind element). Targets one player.
  // - Flicker: Evasion buff. 30% chance to dodge the next physical attack. Auto-activates at start of combat.
  // Drop table:
  // - C-SP-01: 20% chance
  // - no drop: 80% chance
}
