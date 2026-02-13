import { Weapon } from '@rpgjs/database';

// Tier: 2
@Weapon({
  id: 'W-WD-03',
  name: 'Windcatcher Rod',
  description: 'A rod that hums with the power of the wind, enhancing elemental spells.',
  price: 240,
  atk: 1,
  paramsModifier: {
    int: { value: 15 },
  },
})
export default class WindcatcherRod {}
