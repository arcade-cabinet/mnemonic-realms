import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SK-01',
  name: 'Sketch Phantom',
  description:
    "Outline-only versions of enemies from earlier zones — a Meadow Sprite rendered as a single glowing line, a Mountain Drake as a wireframe. They flicker between different enemy silhouettes mid-combat, making them visually unpredictable. They're not hostile memories — they're the world's attempt to populate the Sketch with something, anything, before it's finished.",
  parameters: {
    maxhp: { start: 130, end: 130 },
    str: { start: 30, end: 30 },
    int: { start: 22, end: 22 },
    dex: { start: 28, end: 28 },
    agi: { start: 20, end: 20 },
  },
  gain: {
    exp: 140,
    gold: 65,
  },
})
export default class SketchPhantom {
  // Context:
  // - Zone: Luminous Wastes, The Undrawn Peaks, The Half-Drawn Forest
  // - Fragment affinity: unknown / unknown
  // Abilities:
  // - Form Shift: At the start of each turn, the Phantom randomly shifts its attack type: physical (ATK × 1.4) or magical (INT × 1.5, random element). The player cannot predict which type is coming.
  // - Outline Fade: The Phantom becomes semi-transparent for 1 turn. All damage against it is reduced by 30%. Used when HP drops below 60%.
  // - Memory Scatter: AoE attack. Deals 8% of each target's max HP as fixed damage. 3-turn cooldown.
  // Drop table:
  // - C-HP-03: 15% chance
  // - C-SC-05: 8% chance
  // - no drop: 77% chance
}
