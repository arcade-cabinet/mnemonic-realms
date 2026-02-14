import { Weapon } from '@rpgjs/database';

// Special Effect: Water element on basic attacks
// Intended for: Knight
// Weapon category: Sword
// Tier: 2
@Weapon({
  id: 'W-SW-04',
  name: 'Brightwater Saber',
  description: 'A finely crafted saber, imbued with the essence of flowing water.',
  price: 400,
  atk: 22,
})
export default class BrightwaterSaber {}
