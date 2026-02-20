import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-DP-02',
  name: 'Drowned Scholar',
  description:
    "Spectral figures in waterlogged robes, clutching disintegrating books. They're the Dissolved scholars who chose to remain with their library even as their civilization poured itself into the earth. They attack by hurling compressed memory-water in devastating jets. Their books occasionally open during combat, projecting brief visions of the world as it was.",
  parameters: {
    maxhp: { start: 130, end: 130 },
    str: { start: 14, end: 14 },
    int: { start: 28, end: 28 },
    dex: { start: 22, end: 22 },
    agi: { start: 12, end: 12 },
  },
  gain: {
    exp: 95,
    gold: 48,
  },
})
export default class DrownedScholar {
  // Context:
  // - Zone: Depths Level 2 (Drowned Archive)
  // - Fragment affinity: Sorrow / Water
  // Abilities:
  // - Archive Torrent: Magic attack. Deals INT × 1.7 water-element damage to one target.
  // - Knowledge Drain: Targeted debuff. Reduces target's INT by 20% for 3 turns. No damage. Used against Mages/Clerics (highest INT target).
  // - Lore Shield: Creates a barrier of floating pages around one ally. Absorbs INT × 0.5 damage. Lasts 2 turns.
  // Drop table:
  // - C-SP-02: 20% chance
  // - C-BF-02: 10% chance
  // - no drop: 70% chance
}
