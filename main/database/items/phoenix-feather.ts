import { Item } from '@rpgjs/database';

// Category: special
// Max stack: 1
// Tier: 3
@Item({
  id: 'C-SP-10',
  name: 'Phoenix Feather',
  description:
    'Auto-revive: if a party member is knocked to 0 HP, restore them to 30% HP immediately. Must be in inventory (consumed automatically).',
  hpValue: 0,
  consumable: true,
})
export default class PhoenixFeather {}
