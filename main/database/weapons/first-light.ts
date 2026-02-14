import { Weapon } from '@rpgjs/database';

// Special Effect: Healing spells also grant Inspired (+20% all stats, 1 turn) to the target.
// Intended for: cleric
// Weapon category: staff
// Tier: 3
@Weapon({
  id: 'W-ST-08',
  name: 'First Light',
  description:
    'A staff that imbues healing spells with inspiration, granting the target a temporary boost.',
  atk: 1, // Minimum ATK for a weapon
  paramsModifier: {
    int: { value: 48 },
  },
})
export default class FirstLight {}
