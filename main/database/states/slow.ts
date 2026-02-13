import { State } from '@rpgjs/database';

@State({
  id: 'ST-SLOW',
  name: 'Slow',
  description: 'Agility is halved.',
  paramsModifier: { agi: { rate: -0.5 } },
})
export default class Slow {}
