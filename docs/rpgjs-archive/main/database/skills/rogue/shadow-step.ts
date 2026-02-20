import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-03',
  name: 'Shadow Step',
  description: 'Setup skill for guaranteed next hit.',
  spCost: 10,
  power: 0,
  hitRate: 1,
  coefficient: {},
})
export default class ShadowStep {
  // Formula: No direct damage. Teleport behind one enemy. The next attack against this enemy (by any party member, this turn only) is guaranteed to hit and deals +25% bonus damage.
}
