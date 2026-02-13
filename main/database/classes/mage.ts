import { Class } from '@rpgjs/database';

@Class({
  id: 'mage',
  name: 'Mage',
  description:
    'Glass cannon with highest INT and SP. Devastating magical damage but lowest HP and DEF.',
  skillsToLearn: [],
})
export default class Mage {}
