import { Enemy } from '@rpgjs/database';

@Enemy({
  name: 'Slime',
  graphic: 'enemy',
  parameters: {
    maxHp: { start: 20, end: 20 },
    str: { start: 4, end: 4 },
    int: { start: 2, end: 2 },
    dex: { start: 3, end: 3 },
    agi: { start: 3, end: 3 },
  },
  gain: {
    exp: 5,
    gold: 3,
  },
})
export class Slime {}
