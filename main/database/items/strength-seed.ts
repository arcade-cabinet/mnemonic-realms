import { Item } from '@rpgjs/database';

@Item({
  id: 'C-BF-01',
  name: 'Strength Seed',
  description: 'Grants ATK +15% to one character. (Duration: 3 turns via associated State)',
  price: 100,
  consumable: true,
  paramsModifier: {
    atk: {
      rate: 0.15,
    },
  },
})
// Category: buff
// Max stack: 5
// Tier: 2
export default class StrengthSeed {}
