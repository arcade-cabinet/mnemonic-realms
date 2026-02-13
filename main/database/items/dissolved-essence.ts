import { Item } from '@rpgjs/database';

// Category: special
// Max stack: 3
// Tier: 3
@Item({
  id: 'C-SP-09',
  name: 'Dissolved Essence',
  description: 'Restore 50% HP and 50% SP to entire party.',
  consumable: true,
})
export default class DissolvedEssence {}
