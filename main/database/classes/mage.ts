import { Class } from '@rpgjs/database';
import { Fireball } from '../skills/fireball';

@Class({
  name: 'Mage',
  equippable: [],
  skillsToLearn: [{ level: 1, skill: Fireball }],
})
export class Mage {}
