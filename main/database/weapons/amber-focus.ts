import { Weapon } from '@rpgjs/database';

// Tier: 1
@Weapon({
  id: 'W-WD-02',
  name: 'Amber Focus',
  description: 'A wand imbued with amber, enhancing magical focus.',
  price: 90,
  atk: 1,
  paramsModifier: {
    int: { value: 9 },
  },
})
export default class AmberFocus {}
