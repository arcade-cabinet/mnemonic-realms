import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-03',
  name: 'Bog Wisp',
  description:
    "Larger, more aggressive cousins of the Forest Wisps from Ambergrove. These are sickly yellow-green and trail a miasma of swamp gas. They're the marsh's immune system — they attack anything that disrupts the dissolved memories stored in the water. Their SP-draining attacks are particularly dangerous to Mages and Clerics.",
  parameters: {
    maxhp: { start: 70, end: 70 },
    str: { start: 10, end: 10 },
    int: { start: 20, end: 20 },
    dex: { start: 15, end: 15 },
    agi: { start: 22, end: 22 },
  },
  gain: {
    exp: 70,
    gold: 28,
  },
})
export default class BogWisp {
  // Context:
  // - Zone: Shimmer Marsh
  // - Fragment affinity: Sorrow / Dark
  // Abilities:
  // - Marsh Light: Magic attack. Deals INT × 1.6 dark-element damage. Single target.
  // - SP Siphon: Drains 15 SP from one target. Deals no damage. Prioritizes the party member with the highest current SP.
  // Drop table:
  // - C-SP-02: 25% chance
  // - no drop: 75% chance
}
