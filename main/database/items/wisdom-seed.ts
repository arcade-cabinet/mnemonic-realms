import { Item } from '@rpgjs/database';
// Category: buff
// Max stack: 5
// Tier: 2
@Item({
  id: 'C-BF-02',
  name: 'Wisdom Seed',
  description: 'INT +15% for 3 turns (one character)',
  price: 100,
  consumable: true,
  paramsModifier: {
    int: {
      rate: 0.15,
    },
  },
})
export default class WisdomSeed {}
