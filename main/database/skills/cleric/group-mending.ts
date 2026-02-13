import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-05',
  name: 'Group Mending',
  description: 'Party-wide heal at reduced efficiency.',
  spCost: 22,
  power: 70,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class GroupMending {}
