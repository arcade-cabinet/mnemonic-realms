import { Weapon } from '@rpgjs/database';

// Tier: 3
@Weapon({
  id: 'W-ST-06',
  name: "Luminary's Scepter",
  description: 'A scepter imbued with the light of healing, enhancing restorative magic.',
  price: 850,
  atk: 1,
  paramsModifier: {
    int: { value: 33 },
  },
})
export default class LuminaryScepter {}
