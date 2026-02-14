import { Weapon } from '@rpgjs/database';

// Special effect: Group Mending heals +20% more.
// Intended for: cleric
// Weapon category: staff
// Tier: 3
@Weapon({
  id: 'W-ST-06',
  name: "Luminary's Scepter",
  description: 'A scepter imbued with the light of healing, enhancing restorative magic.',
  price: 850,
  atk: 1, // Minimum ATK for an INT-based weapon
  paramsModifier: {
    int: { value: 33 },
  },
})
export default class LuminaryScepter {}
