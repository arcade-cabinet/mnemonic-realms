import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-L2',
  name: 'Joyful Renewal',
  description: 'Emergency auto-heal for allies.',
  spCost: 30,
  power: 120,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class JoyfulRenewal {}
