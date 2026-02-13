import { Item } from '@rpgjs/database';

// Category: sp-recovery
// Max stack: 10
// Tier: 2
@Item({
  id: 'C-SP-02',
  name: 'Mana Draught',
  description: 'Restores a moderate amount of SP.',
  price: 70,
  consumable: true,
  paramsModifier: {
    maxsp: { value: 50 },
  },
})
export default class ManaDraught {}
