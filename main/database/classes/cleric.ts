import { Class } from '@rpgjs/database';
import { Heal } from '../skills/heal';

@Class({
  name: 'Cleric',
  equippable: [],
  skillsToLearn: [{ level: 1, skill: Heal }],
})
export class Cleric {}
