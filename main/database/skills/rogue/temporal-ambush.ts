import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-07',
  name: 'Temporal Ambush',
  description: 'Ultimate: two actions in one turn.',
  spCost: 45,
  power: 0,
  hitRate: 1,
  // coefficient is omitted as this skill does not directly deal damage or heal based on stats.
})
export default class TemporalAmbush {
  // Formula: Act twice this turn. Both consume SP independently.
}
