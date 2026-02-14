import { Weapon } from '@rpgjs/database';

// Intended for: rogue
// Weapon category: dagger
// Tier: 1
@Weapon({
  id: 'W-DG-01',
  name: 'Worn Knife',
  description: 'A simple, well-used knife. Still sharp enough for a beginner.',
  atk: 4,
})
export default class WornKnife {}
