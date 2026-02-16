import { Weapon } from '@rpgjs/database';

// Special Effect: 20% chance to act twice (basic attack only)
// Intended for: Rogue
// Weapon Category: Dagger
// Tier: 2
@Weapon({
  id: 'W-DG-05',
  name: 'Flickerblade',
  description: 'A swift dagger that sometimes strikes twice, allowing for rapid attacks.',
  price: 550,
  atk: 25,
})
export default class Flickerblade {
  // Weapon stats configured via @Weapon decorator
}
