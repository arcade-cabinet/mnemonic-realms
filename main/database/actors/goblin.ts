import { Enemy } from '@rpgjs/database';

@Enemy({
  name: 'Goblin',
  graphic: 'enemy',
  parameters: {
    maxHp: { start: 35, end: 35 },
    str: { start: 7, end: 7 },
    int: { start: 4, end: 4 },
    dex: { start: 8, end: 8 },
    agi: { start: 7, end: 7 },
  },
  gain: {
    exp: 12,
    gold: 10,
  },
})
export class Goblin {}
