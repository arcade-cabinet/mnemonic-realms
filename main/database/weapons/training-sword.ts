import { Weapon } from '@rpgjs/database';

// Special effect: None
// Intended for: Knight
// Weapon category: Sword
// Tier: 1
@Weapon({
  id: 'W-SW-01',
  name: 'Training Sword',
  description: 'A simple blade for beginners.',
  price: 0,
  atk: 5,
})
export default class TrainingSword {
  // Weapon stats configured via @Weapon decorator
}
