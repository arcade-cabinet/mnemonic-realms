import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-07',
  name: 'Canopy Crawler',
  description:
    "Spider-like creatures the size of a human torso that lurk in the flickering canopy above. They drop silently from branches, trailing gossamer threads of solidified memory. Their bodies are partially transparent — you can see the dissolved memories they've consumed glowing inside their abdomens like captured fireflies.",
  parameters: {
    maxhp: { start: 110, end: 110 },
    str: { start: 22, end: 22 },
    int: { start: 6, end: 6 },
    dex: { start: 22, end: 22 },
    agi: { start: 16, end: 16 },
  },
  gain: {
    exp: 85,
    gold: 40,
  },
})
export default class CanopyCrawler {
  // Context:
  // - Zone: Flickerveil
  // - Category: frontier
  // - Element: Dark
  // - Fragment affinity: Sorrow / Dark
  // Abilities:
  // - Drop Attack: ATK * 1.6 first turn only (ambush), ATK * 1.2 after
  // - Memory Web: inflict Slow (AGI halved, 2 turns), 80% accuracy, 3-turn CD
  // - Cocoon: self-heal 20% max HP, once per combat below 30% HP
  // Drop table:
  // - C-SC-02 (Haste Charm): 20% chance
  // - C-HP-02 (Potion): 15% chance
}
