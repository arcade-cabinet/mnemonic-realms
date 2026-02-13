import { Item } from '@rpgjs/database';

@Item({
  name: 'Elixir',
  description: 'Fully restores HP',
  price: 500,
  hpValue: 500,
  consumable: true,
})
export class Elixir {}
