import { Actor } from '@rpgjs/database';
import { Warrior } from '../classes/warrior';

@Actor({
  name: 'Hero',
  initialLevel: 1,
  finalLevel: 99,
  expCurve: {
    basis: 20,
    extra: 20,
    accelerationA: 30,
    accelerationB: 20,
  },
  parameters: {
    maxHp: { start: 100, end: 9999 },
    maxSp: { start: 50, end: 999 },
    str: { start: 10, end: 500 },
    int: { start: 10, end: 500 },
    dex: { start: 10, end: 500 },
    agi: { start: 10, end: 500 },
  },
  startingEquipment: [],
  class: Warrior,
})
export class Hero {}
