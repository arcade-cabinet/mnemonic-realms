import { Class } from '@rpgjs/database';
import { PowerStrike } from '../skills/powerStrike';
import { Slash } from '../skills/slash';

@Class({
  name: 'Warrior',
  equippable: [],
  skillsToLearn: [
    { level: 1, skill: Slash },
    { level: 5, skill: PowerStrike },
  ],
})
export class Warrior {}
