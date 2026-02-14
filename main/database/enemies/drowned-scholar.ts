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
  // - Category: depths
  // - Element: Water
  // - Fragment affinity: Sorrow / Water
  // Abilities:
  // - Archive Torrent: INT * 1.7 water-element single target
  // - Knowledge Drain: target INT -20% for 3 turns, targets highest INT
  // - Lore Shield: barrier of floating pages, absorbs INT * 0.5 damage, 2 turns
  // Drop table:
  // - C-SP-02 (Mana Draught): 20% chance
  // - C-BF-02 (Wisdom Seed): 10% chance
}
