import { Item } from '@rpgjs/database';
// Category: special
// Max stack: 5
// Tier: 3
@Item({
  id: 'C-SP-06',
  name: 'Crystal Dust',
  description:
    'Cure all debuffs on one character. Deal 50 fixed light damage to one Preserver enemy.',
  price: 200,
  consumable: true,
})
export default class CrystalDust {}
