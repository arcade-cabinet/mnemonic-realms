import { Armor } from '@rpgjs/database';

// Special Effect: +15% resistance to Stasis status.
// Tier: 3
@Armor({
  id: 'A-09',
  name: 'Frontier Guard',
  description: 'Sturdy armor for those guarding the frontier.',
  price: 800,
  pdef: 25,
})
export default class FrontierGuard {}
