import { Enemy } from '@rpgjs/database';

@Enemy({
  name: 'Shadow Wolf',
  graphic: 'enemy',
  parameters: {
    maxHp: { start: 40, end: 40 },
    str: { start: 8, end: 8 },
    int: { start: 3, end: 3 },
    dex: { start: 7, end: 7 },
    agi: { start: 9, end: 9 },
  },
  gain: {
    exp: 15,
    gold: 8,
  },
})
export class Wolf {}
