import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SK-05',
  name: 'Unfinished Treant',
  description:
    "Tree guardians that are only half-drawn — trunk on one side, empty outline on the other. They lurch through the forest with asymmetric movement, one arm a gnarled branch and the other a sweeping line. Their attacks are unpredictable because they're literally incomplete: sometimes a branch-swipe connects, sometimes it passes through the target like a sketch-line through air.",
  parameters: {
    maxhp: { start: 220, end: 220 },
    str: { start: 28, end: 28 },
    int: { start: 18, end: 18 },
    dex: { start: 30, end: 30 },
    agi: { start: 8, end: 8 },
  },
  gain: {
    exp: 170,
    gold: 70,
  },
})
export default class UnfinishedTreant {
  // Context:
  // - Zone: The Half-Drawn Forest
  // - Fragment affinity: Calm / Earth
  // Abilities:
  // - Half-Swing: Physical attack. 70% accuracy (the attack sometimes passes through). When it hits: ATK × 1.8 damage. When it misses: the Treant gains +20% ATK for its next attempt (frustration).
  // - Root Tangle: AoE debuff. 40% chance per target to inflict Slow. No damage. 3-turn cooldown.
  // - Sketch Regrowth: Self-heal. Recovers 15% max HP. The healed portion of the Treant "draws itself in" with visible line-art animation. Used every 4th turn.
  // Drop table:
  // - C-HP-04: 5% chance
  // - C-HP-03: 20% chance
  // - no drop: 75% chance
}
