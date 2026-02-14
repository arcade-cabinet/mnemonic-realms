import { Armor } from '@rpgjs/database';

// Tier: 3
// Special Effect: All healing received +20%. Knight: oath bonuses +5%.
@Armor({
  id: 'A-11',
  name: 'Luminary Vestment',
  description: 'A vestment that amplifies healing and empowers knights.',
  price: 1000,
  pdef: 22,
})
export default class LuminaryVestment {}
