import { Item } from '@rpgjs/database';

/**
 * Category: status-cure
 * Max stack: 10
 * Tier: 2
 */
@Item({
  id: 'C-SC-03',
  name: 'Fortify Tonic',
  description: 'Cures Weakness. Grants DEF +20% for 2 turns.',
  price: 60,
  consumable: true,
  removeStates: [],
  addStates: [],
})
export default class FortifyTonic {}
