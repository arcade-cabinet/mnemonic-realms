import { Weapon } from '@rpgjs/database';

// Special Effect: +5% Oath Strike damage
// Intended for: Knight
// Weapon Category: Sword
// Tier: 2
@Weapon({
  id: 'W-SW-03',
  name: "Oathkeeper's Edge",
  description: 'A blade imbued with the resolve of its wielder, sharp and true.',
  price: 250,
  atk: 16,
})
export default class OathkeepersEdge {}
