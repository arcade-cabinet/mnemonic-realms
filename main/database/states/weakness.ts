import { State } from '@rpgjs/database';

@State({
  id: 'ST-WEAKNESS',
  name: 'Weakness',
  description: 'Defense is reduced by 30%.',
  paramsModifier: {
    dex: { rate: -0.3 },
  },
})
export default class Weakness {}
