// Special Effect: +3% ATK per active oath. Oath Strike costs 0 SP.
// Intended for: Knight
// Weapon category: Sword
// Tier: 3
import { Weapon } from '@rpgjs/database';

@Weapon({
  id: 'W-SW-07',
  name: 'Oath-Forged Blade',
  description:
    "A blade imbued with the power of solemn vows. Its edge sharpens with each oath taken, and it empowers the wielder's Oath Strike.",
  atk: 42,
  // price is omitted as it's not purchasable (0g or undefined)
})
export default class OathForgedBlade {}
