import { Weapon } from '@rpgjs/database';

// Special Effect: Temporal Ambush second action deals +25% bonus damage.
// Intended for: Rogue
// Weapon Category: Dagger
// Tier: 3
@Weapon({
  id: 'W-DG-07',
  name: 'Temporal Shard',
  description: 'Temporal Ambush: the second action deals +25% bonus damage.',
  atk: 39,
  // price is omitted as it's 0 (not purchasable)
})
export default class TemporalShard {}
