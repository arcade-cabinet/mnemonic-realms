import { Weapon } from '@rpgjs/database';

// Special Effect: Echo Dodge cap increased from 60% to 70%. Memory Theft always succeeds.
// Intended for: rogue
// Weapon category: dagger
// Tier: 3
@Weapon({
  id: 'W-DG-08',
  name: 'Echo of Tomorrow',
  description: 'Echo Dodge cap increased from 60% to 70%. Memory Theft always succeeds.',
  atk: 47,
  // price is omitted as it's 0 and not purchasable
})
export default class EchoOfTomorrow {}
