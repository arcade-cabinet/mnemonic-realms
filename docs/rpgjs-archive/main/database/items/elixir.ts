import { Item } from '@rpgjs/database';

// Category: healing
// Max stack: 5
// Tier: 3
@Item({
  id: 'C-HP-04',
  name: 'Elixir',
  description: "Restores all of a character's HP.",
  price: 500,
  // hpValue: 0 is used here as a common RPG convention for "restore 100% HP" (to full).
  // If RPG-JS interprets 0 as "restore 0 HP", then custom logic would be required
  // outside of the @Item decorator to achieve 100% HP restoration.
  hpValue: 0,
  consumable: true,
})
export default class Elixir {
  // Item properties configured via @Item decorator
}
