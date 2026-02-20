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
  // - Fragment affinity: Sorrow / Dark
  // Abilities:
  // - Drop Attack: Physical attack. Deals ATK × 1.6 damage on the first turn of combat only (ambush bonus from above). Subsequent attacks deal ATK × 1.2.
  // - Memory Web: Targeted debuff. Inflicts Slow (AGI halved, 2 turns) on one target. 80% accuracy. 3-turn cooldown.
  // - Cocoon: Self-heal. Recovers 20% max HP. Used once per combat when HP drops below 30%.
  // Drop table:
  // - C-SC-02: 20% chance
  // - C-HP-02: 15% chance
  // - no drop: 65% chance
}
