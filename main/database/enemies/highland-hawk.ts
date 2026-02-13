import { Enemy, Item } from '@rpgjs/database';

@Item({
  id: 'C-SC-02',
  name: 'Haste Charm',
  description: 'A charm that slightly increases agility.',
})
export class C_SC_02 {}

@Item({
  id: 'C-SP-05',
  name: 'Smoke Bomb',
  description: 'Creates a cloud of smoke, allowing for escape.',
})
export class C_SP_05 {}

@Enemy({
  id: 'E-SL-07',
  name: 'Highland Hawk',
  description:
    'Swift raptors with wingspans wider than the player is tall. Their feathers are wind-colored — gray-blue that shifts to silver at the tips. They dive-bomb from above, striking with talons before wheeling back into the sky. Between attacks they circle overhead, nearly untouchable.',
  parameters: {
    maxhp: { start: 45, end: 45 },
    str: { start: 11, end: 11 },
    int: { start: 3, end: 3 },
    dex: { start: 6, end: 6 },
    agi: { start: 18, end: 18 },
  },
  gain: {
    exp: 40,
    gold: 18,
    items: [
      { nb: 1, item: C_SC_02, chance: 0.1 },
      { nb: 1, item: C_SP_05, chance: 0.15 },
    ],
  },
})
export default class HighlandHawk {}
