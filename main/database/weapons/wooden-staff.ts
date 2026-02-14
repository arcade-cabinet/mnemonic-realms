import { Weapon } from '@rpgjs/database';

// Intended for: Cleric
// Weapon Category: Staff
// Tier: 1
@Weapon({
  id: 'W-ST-01',
  name: 'Wooden Staff',
  description: 'A basic wooden staff.',
  price: 0,
  atk: 1,
  paramsModifier: { int: { value: 4 } },
})
export default class WoodenStaff {}
