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
  // - Category: frontier
  // - Element: Dark
  // - Fragment affinity: Sorrow / Dark
  // Abilities:
  // - Marsh Light: INT * 1.6 dark-element single target
  // - SP Siphon: drains 15 SP, no damage, targets highest SP party member
  // - Will-o'-Wisp (passive): 25% chance to evade physical attacks
  // Drop table:
  // - C-SP-02 (Mana Draught): 25% chance
}
