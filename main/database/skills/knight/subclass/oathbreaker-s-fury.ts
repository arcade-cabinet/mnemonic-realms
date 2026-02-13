import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-C2',
  name: "Oathbreaker's Fury",
  description: "AoE Oathbreaker's Gambit. Sacrifices one oath.",
  spCost: 35,
  power: 250,
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class OathbreakersFury {}
