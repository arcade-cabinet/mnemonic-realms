import { Weapon } from '@rpgjs/database';

// Intended for: cleric
// Weapon category: staff
// Tier: 3
// Special effect: Emotional charges grant +5% each (doubled from base +3%).
@Weapon({
  id: 'W-ST-07',
  name: 'Euphoric Wand',
  description: 'Emotional charges grant +5% each (doubled from base +3%).',
  atk: 1, // Minimum ATK for a weapon
  paramsModifier: {
    int: { value: 40 },
  },
  // price is omitted as it is not purchasable (price: 0)
})
export default class EuphoricWand {}
