import { Weapon } from '@rpgjs/database';

// Special effect: +5% spell damage
// Intended for: mage
// Weapon category: wand
// Tier: 1
@Weapon({
  id: 'W-WD-02',
  name: 'Amber Focus',
  description: 'A wand imbued with amber, enhancing magical focus.',
  price: 90,
  atk: 1, // Minimum ATK for a weapon
  paramsModifier: {
    int: { value: 9 },
  },
})
export default class AmberFocus {
  // Weapon stats configured via @Weapon decorator
}
