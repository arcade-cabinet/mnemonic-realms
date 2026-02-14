import { Item } from '@rpgjs/database';

// Category: special
// Max stack: 3
// Tier: 3
@Item({
  id: 'C-SP-09',
  name: 'Dissolved Essence',
  description: 'Restore 50% HP and 50% SP to entire party.',
  // price: undefined (not purchasable)
  consumable: true,
  // hpValue: The item restores 50% of max HP. The 'hpValue' decorator property expects a fixed number.
  //          Implementing percentage-based HP restoration typically requires custom game logic.
  // SP restoration (50%): RPG-JS items do not have a native 'spValue' property.
  //          Using 'paramsModifier' with 'maxsp' would modify the character's maximum SP, not restore current SP.
  //          Implementing percentage-based SP restoration also requires custom game logic.
  // The "entire party" effect also requires custom game logic beyond the standard item decorator properties.
})
export default class DissolvedEssence {}
