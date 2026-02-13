import { Class } from '@rpgjs/database';
import { Backstab } from '../skills/backstab';
import { PoisonStrike } from '../skills/poisonStrike';
import { Slash } from '../skills/slash';

@Class({
  name: 'Rogue',
  equippable: [],
  skillsToLearn: [
    { level: 1, skill: Slash },
    { level: 5, skill: Backstab },
    { level: 10, skill: PoisonStrike },
  ],
})
export class Rogue {}
