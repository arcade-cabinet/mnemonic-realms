import { Item } from '@rpgjs/database';

// Category: buff
// Max stack: 5
// Tier: 2
@Item({
  id: 'C-BF-04',
  name: 'Haste Seed',
  description: 'Grants AGI +15% for 3 turns to one character.',
  price: 100,
  consumable: true,
  paramsModifier: {
    agi: {
      rate: 0.15, // AGI +15%
    },
  },
  // The "for 3 turns" duration typically requires applying a State.
  // This item's paramsModifier applies the stat change directly.
})
export default class HasteSeed {}
