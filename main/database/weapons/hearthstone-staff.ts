import { Weapon } from '@rpgjs/database';

// Special Effect: Sorrowful Cleanse also heals INT × 0.3
// Intended for: cleric
// Weapon category: staff
// Tier: 2
@Weapon({
  id: 'W-ST-03',
  name: 'Hearthstone Staff',
  description:
    'A staff imbued with the warmth of the Hearthstone Circle, offering solace and healing.',
  price: 220,
  atk: 1, // Minimum ATK for a weapon
  paramsModifier: {
    int: { value: 14 },
  },
})
export default class HearthstoneStaff {
  // Weapon stats configured via @Weapon decorator
}
