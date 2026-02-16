import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-05',
  name: 'Mountain Drake',
  description:
    "Scaled reptilian beasts the size of large dogs. They nest in the crevices of unfinished peaks and breathe gouts of amber-tinged fire — memory-flame that burns with the heat of the mountain-dwelling Dissolved civilization's forges. Their scales are iron-dark with veins of glowing amber. They're aggressive but not evil — they're protecting their nesting grounds.",
  parameters: {
    maxhp: { start: 180, end: 180 },
    str: { start: 25, end: 25 },
    int: { start: 12, end: 12 },
    dex: { start: 25, end: 25 },
    agi: { start: 12, end: 12 },
  },
  gain: {
    exp: 100,
    gold: 50,
  },
})
export default class MountainDrake {
  // Context:
  // - Zone: Hollow Ridge
  // - Category: frontier
  // - Element: Fire
  // - Fragment affinity: Fury / Fire
  // Abilities:
  // - Flame Bite: ATK * 1.4 fire-element single target
  // - Memory Breath: INT * 1.8 fire AoE (1-2 targets), 15% Weakness per target, 3-turn CD
  // - Scale Harden: DEF +40% for 2 turns, used below 40% HP
  // Drop table:
  // - C-HP-02 (Potion): 20% chance
  // - C-BF-01 (Strength Seed): 10% chance
}
