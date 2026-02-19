import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SK-03',
  name: 'Wireframe Drake',
  description:
    "Geometric versions of Mountain Drakes. Their bodies are wireframe polygons — triangles and lines forming a dragon silhouette. Fire leaks from the gaps between polygons as glowing vectors. When they roar, it sounds like data corrupting — a digital screech mixed with the original Drake's organic bellow.",
  parameters: {
    maxhp: { start: 200, end: 200 },
    str: { start: 35, end: 35 },
    int: { start: 25, end: 25 },
    dex: { start: 35, end: 35 },
    agi: { start: 16, end: 16 },
  },
  gain: {
    exp: 180,
    gold: 80,
  },
})
export default class WireframeDrake {
  // Context:
  // - Zone: The Undrawn Peaks
  // - Fragment affinity: Fury / Fire
  // Abilities:
  // - Vector Flame: Physical attack. Deals ATK × 1.5 fire-element damage.
  // - Void Breath: Cone AoE. Deals INT × 1.6 mixed fire+dark damage to 1-2 targets. 20% chance to inflict Weakness per target. 3-turn cooldown.
  // - Geometric Shift: Self-buff. The Drake rearranges its wireframe, gaining +30% DEF for 2 turns. Used once per combat when HP drops below 50%.
  // Drop table:
  // - C-HP-03: 20% chance
  // - C-BF-01: 10% chance
  // - no drop: 70% chance
}
