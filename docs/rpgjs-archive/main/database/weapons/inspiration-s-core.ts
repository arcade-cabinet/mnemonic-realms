import { Weapon } from '@rpgjs/database';

// Intended for: Mage
// Weapon category: Wand
// Tier: 3
// Special effect: Grand Inspiration costs 40 SP instead of 55.
@Weapon({
  id: 'W-WD-07',
  name: "Inspiration's Core",
  description:
    'A wand imbued with the essence of inspiration, reducing the cost of Grand Inspiration.',
  atk: 1, // Minimum ATK for a weapon
  paramsModifier: {
    int: { value: 41 },
  },
  // price is omitted as it's not purchasable (0g)
})
export default class InspirationsCore {
  // Weapon stats configured via @Weapon decorator
}
