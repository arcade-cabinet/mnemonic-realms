import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-DP-01',
  name: 'Memory Shade',
  description:
    "Shadow-like figures that detach from the cellar walls. They're the weakest dissolved memories — remnants of everyday moments (a meal, a greeting, a walk) given just enough form to wander. They're more confused than hostile. Their attacks are clumsy, like someone reaching for something they can't quite remember.",
  parameters: {
    maxhp: { start: 50, end: 50 },
    str: { start: 9, end: 9 },
    int: { start: 7, end: 7 },
    dex: { start: 6, end: 6 },
    agi: { start: 8, end: 8 },
  },
  gain: {
    exp: 40,
    gold: 15,
  },
})
export default class MemoryShade {
  // Context:
  // - Zone: Depths Level 1 (Memory Cellar)
  // - Fragment affinity: Calm / Dark
  // Abilities:
  // - Grasp: Physical attack. Deals ATK × 1.2 damage. 10% chance to inflict Slow.
  // Drop table:
  // - C-SP-01: 20% chance
  // - no drop: 80% chance
}
