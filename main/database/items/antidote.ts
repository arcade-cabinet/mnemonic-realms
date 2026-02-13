import { Item } from '@rpgjs/database';

/**
 * Category: status-cure
 * Max stack: 10
 * Tier: 1
 */
@Item({
  id: 'C-SC-01',
  name: 'Antidote',
  description: 'Cures poison.',
  price: 20,
  consumable: true,
})
export default class Antidote {}
