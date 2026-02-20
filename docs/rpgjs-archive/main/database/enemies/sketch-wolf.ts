import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SK-04',
  name: 'Sketch Wolf',
  description:
    "Wolves drawn in elegant line-art — single continuous strokes forming legs, body, and head. They move with the fluid grace of an artist's hand, and their paws leave ink-like marks on the sketch-ground. They hunt in packs of 2-3, flanking their prey with coordinated dashes. Their howls sound like a pen scratching across parchment.",
  parameters: {
    maxhp: { start: 110, end: 110 },
    str: { start: 32, end: 32 },
    int: { start: 8, end: 8 },
    dex: { start: 22, end: 22 },
    agi: { start: 30, end: 30 },
  },
  gain: {
    exp: 150,
    gold: 60,
  },
})
export default class SketchWolf {
  // Context:
  // - Zone: The Half-Drawn Forest
  // - Fragment affinity: Fury / Wind
  // Abilities:
  // - Ink Fang: Physical attack. Deals ATK × 1.3 damage. If another Sketch Wolf attacked the same target this turn, deals ATK × 1.8 instead (pack tactics).
  // - Flanking Dash: Moves to "flank" position. Next attack against this wolf has -30% accuracy. Next attack BY this wolf has +30% accuracy. 3-turn cooldown.
  // Drop table:
  // - C-SC-02: 15% chance
  // - C-SP-05: 15% chance
  // - no drop: 70% chance
}
