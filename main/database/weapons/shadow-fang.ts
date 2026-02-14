import { Weapon } from '@rpgjs/database';

// Intended for: Rogue
// Weapon Category: Dagger
// Tier: 2
// Special Effect: Foreshadow Strike pre-enemy bonus increased by +10%
@Weapon({
  id: 'W-DG-04',
  name: 'Shadow Fang',
  description:
    "A sharp dagger that enhances the user's ability to predict and exploit enemy weaknesses, boosting Foreshadow Strike.",
  price: 350,
  atk: 19,
})
export default class ShadowFang {}
