import { Weapon } from '@rpgjs/database';

// Intended for: mage
// Weapon category: wand
// Tier: 2
// Special effect: Eureka Moment always hits weakness if one exists
@Weapon({
  id: 'W-WD-04',
  name: 'Prism Wand',
  description:
    'A wand that refracts arcane energy, guiding spells to their most vulnerable targets.',
  price: 420,
  atk: 1, // Minimum ATK for an INT-based weapon
  paramsModifier: {
    int: { value: 21 },
  },
})
export default class PrismWand {}
