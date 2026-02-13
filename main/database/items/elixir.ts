import { Item } from '@rpgjs/database';

// Category: healing
// Max stack: 5
// Tier: 3
@Item({
  id: 'C-HP-04',
  name: 'Elixir',
  description: "Restores all of a character's HP.",
  price: 500,
  hpValue: 0,
  consumable: true,
})
export default class Elixir {}
