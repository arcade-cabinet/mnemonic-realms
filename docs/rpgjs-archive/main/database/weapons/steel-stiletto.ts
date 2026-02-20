import { Weapon } from '@rpgjs/database';

// Intended for: Rogue
// Weapon category: Dagger
// Tier: 1
@Weapon({
  id: 'W-DG-02',
  name: 'Steel Stiletto',
  description: 'A sharp, slender blade, favored by rogues for its precision.',
  price: 75,
  atk: 8,
})
export default class SteelStiletto {
  // Weapon stats configured via @Weapon decorator
}
