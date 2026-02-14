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
      rate: 0.15, // +15%
      // RPG-JS does not have a native 'duration' property for item buffs.
      // This would typically be handled by a State applied by the item,
      // or by custom logic in the item's `onUse` method (not part of @Item decorator).
      // For now, the description implies the duration.
    },
  },
})
export default class WisdomSeed {}
