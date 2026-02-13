import { Armor } from '@rpgjs/database';

@Armor({
  name: 'Leather Armor',
  description: 'Light armor that allows agile movement',
  price: 90,
  pdef: 7,
  paramsModifier: {
    agi: { value: 2 },
  },
})
export class LeatherArmor {}
