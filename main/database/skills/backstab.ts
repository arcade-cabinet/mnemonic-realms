import { Skill } from '@rpgjs/database';

@Skill({
  name: 'Backstab',
  description: 'A devastating strike from the shadows',
  spCost: 12,
  power: 180,
  hitRate: 90,
})
export class Backstab {}
