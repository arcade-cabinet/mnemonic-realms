import { Skill } from '@rpgjs/database';

@Skill({
  name: 'Berserk',
  description: 'Enters a battle rage, boosting attack power',
  spCost: 14,
  paramsModifier: {
    str: { value: 15 },
  },
})
export class Berserk {}
