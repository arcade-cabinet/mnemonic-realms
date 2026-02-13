import { Weapon } from '@rpgjs/database';

@Weapon({
  name: 'Arcane Staff',
  description: 'A staff imbued with magical energy',
  price: 100,
  atk: 8,
  paramsModifier: {
    int: { value: 5 },
  },
})
export class ArcaneStaff {}
