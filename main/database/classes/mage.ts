import { Class } from '@rpgjs/database';
import { Fireball } from '../skills/fireball';
import { IceBolt } from '../skills/iceBolt';
import { PoisonStrike } from '../skills/poisonStrike';

@Class({
  name: 'Mage',
  equippable: [],
  skillsToLearn: [
    { level: 1, skill: Fireball },
    { level: 5, skill: IceBolt },
    { level: 10, skill: PoisonStrike },
  ],
})
export class Mage {}
