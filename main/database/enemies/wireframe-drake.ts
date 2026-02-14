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
  // - Category: sketch
  // - Element: Fire
  // - Fragment affinity: Fury / Fire
  // Abilities:
  // - Vector Flame: ATK * 1.5 fire-element single target
  // - Void Breath: INT * 1.6 fire+dark AoE (1-2 targets), 20% Weakness per target, 3-turn CD
  // - Geometric Shift: DEF +30% for 2 turns, once per combat below 50% HP
  // Drop table:
  // - C-HP-03 (High Potion): 20% chance
  // - C-BF-01 (Strength Seed): 10% chance
}
