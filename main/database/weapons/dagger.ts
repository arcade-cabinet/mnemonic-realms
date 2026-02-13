import { Weapon } from '@rpgjs/database';

@Weapon({
  name: 'Shadow Dagger',
  description: 'A lightweight blade for quick strikes',
  price: 80,
  atk: 10,
  paramsModifier: {
    agi: { value: 3 },
  },
})
export class ShadowDagger {}
