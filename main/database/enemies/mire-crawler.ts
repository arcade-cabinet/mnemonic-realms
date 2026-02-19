import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-01',
  name: 'Mire Crawler',
  description:
    'Low, many-legged creatures that slither through the marsh muck. Their bodies are segmented and translucent — you can see the swamp water churning inside them. They leave trails of toxic residue. They ambush by rising from pools that appear shallow.',
  parameters: {
    maxhp: { start: 120, end: 120 },
    str: { start: 22, end: 22 },
    int: { start: 8, end: 8 },
    dex: { start: 20, end: 20 },
    agi: { start: 10, end: 10 },
  },
  gain: {
    exp: 65,
    gold: 30,
  },
})
export default class MireCrawler {
  // Context:
  // - Zone: Shimmer Marsh
  // - Fragment affinity: Sorrow / Water
  // Abilities:
  // - Toxic Lunge: Physical attack. Deals ATK × 1.3 damage. 25% chance to inflict Poison (5% max HP per turn, 3 turns).
  // - Mire Grip: Targeted attack. Deals ATK × 1.0 damage and inflicts Slow (AGI halved, 2 turns). Used when a party member has the highest AGI.
  // - Burrow: The Crawler sinks into the ground for 1 turn, becoming untargetable. Emerges next turn with a guaranteed Toxic Lunge.
  // Drop table:
  // - C-SC-01: 25% chance
  // - C-HP-02: 15% chance
  // - no drop: 60% chance
}
