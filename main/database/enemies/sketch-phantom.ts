import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SK-01',
  name: 'Sketch Phantom',
  description:
    "Outline-only versions of enemies from earlier zones — a Meadow Sprite rendered as a single glowing line, a Mountain Drake as a wireframe. They flicker between different enemy silhouettes mid-combat, making them visually unpredictable. They're the world's attempt to populate the Sketch with something before it's finished.",
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
  // - Category: sketch
  // - Element: Random (changes each encounter)
  // - Fragment affinity: Random
  // Abilities:
  // - Form Shift: randomly physical (ATK * 1.4) or magical (INT * 1.5, random element) each turn
  // - Outline Fade: 30% damage reduction for 1 turn, used below 60% HP
  // - Memory Scatter: AoE 8% max HP fixed damage, 3-turn CD
  // Drop table:
  // - C-HP-03 (High Potion): 15% chance
  // - C-SC-05 (Panacea): 8% chance
}
