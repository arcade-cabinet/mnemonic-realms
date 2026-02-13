import { Class } from '@rpgjs/database';
import { Slash } from '../skills/slash';

@Class({
  name: 'Rogue',
  equippable: [],
  skillsToLearn: [{ level: 1, skill: Slash }],
})
export class Rogue {}
