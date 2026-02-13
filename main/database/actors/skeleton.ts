import { Enemy } from '@rpgjs/database';

@Enemy({
  name: 'Skeleton',
  graphic: 'enemy',
  parameters: {
    maxHp: { start: 50, end: 50 },
    str: { start: 10, end: 10 },
    int: { start: 5, end: 5 },
    dex: { start: 6, end: 6 },
    agi: { start: 5, end: 5 },
  },
  gain: {
    exp: 20,
    gold: 12,
  },
})
export class Skeleton {}
