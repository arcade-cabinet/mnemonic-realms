import { Weapon } from '@rpgjs/database';

// Intended for: Mage
// Weapon category: Wand
// Tier: 1
@Weapon({
  id: 'W-WD-01',
  name: 'Apprentice Wand',
  description: 'A basic wand for aspiring mages, focusing on magical aptitude.',
  atk: 1, // Minimum attack for a weapon
  paramsModifier: {
    int: { value: 5 },
  },
  // Price is omitted as it's not purchasable (0g)
})
export default class ApprenticeWand {
  // Weapon stats configured via @Weapon decorator
}
