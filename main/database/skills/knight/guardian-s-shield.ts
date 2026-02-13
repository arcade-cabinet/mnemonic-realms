import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-02',
  name: "Guardian's Shield",
  description: 'Tank skill redirecting damage from an ally.',
  spCost: 8,
  power: 0,
  hitRate: 1,
  coefficient: {},
})
export default class GuardiansShield {}
