import { Armor } from '@rpgjs/database';

// Tier: 1
@Armor({
  id: 'A-03',
  name: 'Leather Armor',
  description: 'Standard leather protection, offering a slight boost to vitality.',
  price: 120,
  pdef: 10,
  paramsModifier: {
    maxhp: { rate: 0.05 },
  },
})
export default class LeatherArmor {}
