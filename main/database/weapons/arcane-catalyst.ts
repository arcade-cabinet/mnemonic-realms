import { Weapon } from '@rpgjs/database';

// Tier: 3
@Weapon({
  id: 'W-WD-06',
  name: 'Arcane Catalyst',
  description: 'A powerful conduit that amplifies elemental magic.',
  price: 950,
  atk: 1,
  paramsModifier: {
    int: { value: 34 },
  },
})
export default class ArcaneCatalyst {}
