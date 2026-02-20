import { Weapon } from '@rpgjs/database';

// Intended for: mage
// Weapon category: wand
// Tier: 3
// Special effect: All spell damage +10%. Spells that hit a weakness deal 2.0x instead of 1.5x.
@Weapon({
  id: 'W-WD-08',
  name: 'Dissolved Memory Lens',
  description:
    'A peculiar lens that seems to absorb and refract memories, significantly enhancing magical prowess.',
  atk: 1, // Minimum ATK for a weapon
  paramsModifier: {
    int: { value: 49 },
  },
  // price is omitted as it's not purchasable (price: 0 or undefined)
})
export default class DissolvedMemoryLens {
  // Weapon stats configured via @Weapon decorator
}
