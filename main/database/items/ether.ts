import { Item } from '@rpgjs/database';

// Category: sp-recovery
// Max stack: 5
// Tier: 3
@Item({
  id: 'C-SP-04',
  name: 'Ether',
  description: 'Restores all SP.', // Effect: Restore 100% SP
  price: 450,
  consumable: true,
  // SP restoration (100%) is handled by game logic on item use,
  // as there is no direct 'spValue' or 'maxsp' current resource restoration via paramsModifier.
})
export default class Ether {
  // Item properties configured via @Item decorator
}
