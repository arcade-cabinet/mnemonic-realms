import { Weapon } from '@rpgjs/database';

// Intended for: Knight
// Weapon category: Sword
// Tier: 1
// Special effect: None
@Weapon({
  id: 'W-SW-02',
  name: 'Iron Blade',
  description: 'A sturdy blade forged from iron, a reliable choice for combat.',
  price: 80,
  atk: 10,
})
export default class IronBlade {}
