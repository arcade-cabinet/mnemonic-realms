import { State } from '@rpgjs/database';

@State({
  id: 'ST-VOW-STEEL',
  name: 'Vow of Steel',
  description: 'Defense is greatly increased. Cannot flee from battle.',
  paramsModifier: {
    dex: { rate: 0.4 },
  },
})
export default class VowOfSteel {}
