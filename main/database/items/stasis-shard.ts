import { Item } from '@rpgjs/database';

/**
 * Category: special
 * Max stack: 5
 * Tier: 3
 */
@Item({
  id: 'C-SP-07',
  name: 'Stasis Shard',
  description: 'Freeze one non-boss enemy for 2 turns (cannot act).',
  price: 150,
  consumable: true,
})
export default class StasisShard {}
