import { Weapon } from '@rpgjs/database';

// Special Effect: Vanishing Act lasts 3 turns instead of 2.
// Intended for: Rogue
// Weapon Category: Dagger
// Tier: 3
@Weapon({
  id: 'W-DG-06',
  name: 'Phantom Edge',
  description: 'A dagger imbued with fleeting shadows, extending the duration of stealth.',
  price: 900,
  atk: 32,
})
export default class PhantomEdge {
  // Weapon stats configured via @Weapon decorator
}
