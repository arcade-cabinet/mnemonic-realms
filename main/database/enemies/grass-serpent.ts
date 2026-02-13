import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SL-02',
  name: 'Grass Serpent',
  description:
    'Long, sinuous creatures that hide in tall wheat. They ambush by lunging from the grass, their scales shimmering with muted green and gold.',
  parameters: {
    maxhp: { start: 45, end: 45 },
    str: { start: 8, end: 8 },
    int: { start: 2, end: 2 },
    dex: { start: 5, end: 5 },
    agi: { start: 10, end: 10 },
  },
  gain: {
    exp: 25,
    gold: 12,
  },
})
export default class GrassSerpent {
  // Category: settled
}
