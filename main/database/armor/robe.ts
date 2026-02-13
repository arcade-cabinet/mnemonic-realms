import { Armor } from '@rpgjs/database';

@Armor({
  name: 'Mystic Robe',
  description: 'A robe woven with protective enchantments',
  price: 120,
  sdef: 8,
  paramsModifier: {
    int: { value: 3 },
  },
})
export class MysticRobe {}
