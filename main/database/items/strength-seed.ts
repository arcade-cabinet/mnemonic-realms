import { Item } from '@rpgjs/database';

@Item({
  id: 'C-BF-01',
  name: 'Strength Seed',
  description: 'Grants ATK +15% to one character. (Duration: 3 turns via associated State)',
  price: 100,
  consumable: true,
  // Note: Applying paramsModifier directly to an item makes the effect permanent.
  // For a temporary '3 turns' buff, an RPG-JS State class (e.g., StrengthBuff)
  // would typically be defined and applied via the 'addStates' property of the item.
  // Example: addStates: [{ state: StrengthBuff, rate: 1 }]
  // where StrengthBuff would contain paramsModifier: { atk: { rate: 0.15 } } and duration: 3.
  paramsModifier: {
    atk: {
      rate: 0.15,
    },
  },
})
// Category: buff
// Max stack: 5
// Tier: 2
export default class StrengthSeed {
  // Item properties configured via @Item decorator
}
