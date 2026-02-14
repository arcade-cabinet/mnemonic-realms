import { Weapon } from '@rpgjs/database';

// Special Effect: +5% healing power
// Intended for: Cleric
// Weapon Category: Staff
// Tier: 1
@Weapon({
  id: 'W-ST-02',
  name: "Maren's Blessing Rod",
  description: "A sacred rod imbued with Maren's gentle blessings, enhancing healing.",
  price: 70,
  atk: 1, // Minimum ATK for a weapon
  paramsModifier: {
    int: { value: 8 },
  },
})
export default class MarensBlessingRod {}
