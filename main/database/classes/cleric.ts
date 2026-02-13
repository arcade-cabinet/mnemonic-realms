import { Class } from '@rpgjs/database';
import { Cure } from '../skills/cure';
import { Heal } from '../skills/heal';

@Class({
  name: 'Cleric',
  equippable: [],
  skillsToLearn: [
    { level: 1, skill: Heal },
    { level: 5, skill: Cure },
  ],
})
export class Cleric {}
