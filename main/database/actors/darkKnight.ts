import { Enemy } from '@rpgjs/database';

@Enemy({
  name: 'Dark Knight',
  graphic: 'boss',
  parameters: {
    maxHp: { start: 120, end: 120 },
    str: { start: 18, end: 18 },
    int: { start: 12, end: 12 },
    dex: { start: 10, end: 10 },
    agi: { start: 8, end: 8 },
  },
  gain: {
    exp: 50,
    gold: 40,
  },
})
export class DarkKnight {}
