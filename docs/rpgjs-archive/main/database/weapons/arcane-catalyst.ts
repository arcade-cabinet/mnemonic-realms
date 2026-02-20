import { Weapon } from '@rpgjs/database';

// Special Effect: Elemental Storm damage +20%
// Intended for: mage
// Weapon category: wand
// Tier: 3
@Weapon({
  id: 'W-WD-06',
  name: 'Arcane Catalyst',
  description: 'A powerful conduit that amplifies elemental magic.',
  price: 950,
  atk: 1, // Minimum ATK for a weapon, as primary stat is INT
  paramsModifier: {
    int: { value: 34 },
  },
})
export default class ArcaneCatalyst {
  // Weapon stats configured via @Weapon decorator
}
