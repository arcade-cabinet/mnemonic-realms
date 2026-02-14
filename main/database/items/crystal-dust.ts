import { Item } from '@rpgjs/database';
// Category: special
// Max stack: 5
// Tier: 3
@Item({
  id: 'C-SP-06',
  name: 'Crystal Dust',
  description:
    'Cure all debuffs on one character. Deal 50 fixed light damage to one Preserver enemy.',
  price: 200,
  consumable: true,
  // To cure all debuffs, you would list the specific State classes here.
  // Example: removeStates: [Poison, Weakness, Slow, Stasis],
  // TODO: Import and add specific State classes for all debuffs.
  // Note: The effect "Deal 50 fixed light damage to one Preserver enemy" is a custom combat effect
  // and would typically be implemented in a custom item use handler or skill, not directly via @Item decorator properties.
})
export default class CrystalDust {
  // Item properties configured via @Item decorator
}
