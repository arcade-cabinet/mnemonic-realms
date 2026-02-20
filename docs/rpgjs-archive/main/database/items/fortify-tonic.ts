import { Item } from '@rpgjs/database';
// import Weakness from '../states/weakness'; // TODO: Create Weakness state class
// import Fortified from '../states/fortified'; // TODO: Create Fortified state class (DEF +20% for 2 turns)

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
  removeStates: [
    // Weakness, // TODO: Uncomment and add Weakness state class here
  ],
  addStates: [
    // Fortified, // TODO: Uncomment and add Fortified state class here
  ],
})
export default class FortifyTonic {
  // Item properties configured via @Item decorator
}
