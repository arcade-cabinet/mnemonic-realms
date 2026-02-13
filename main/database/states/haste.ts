import { State } from '@rpgjs/database';

@State({
  id: 'ST-HASTE',
  name: 'Haste',
  description: 'Agility increased by 20%.',
  paramsModifier: { agi: { rate: 0.2 } },
})
export default class Haste {}
