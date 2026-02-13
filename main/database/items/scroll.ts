import { Item } from '@rpgjs/database';

@Item({
  name: 'Battle Scroll',
  description: 'Temporarily boosts ATK',
  price: 150,
  consumable: true,
  paramsModifier: {
    str: { value: 10 },
  },
})
export class BattleScroll {}
