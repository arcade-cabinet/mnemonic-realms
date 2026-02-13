import { State } from '@rpgjs/database';

@State({
  id: 'ST-INVISIBLE',
  name: 'Invisible',
  description: 'Immune to single-target attacks. Next attack deals 2.0x damage.',
  paramsModifier: {
    str: { rate: 1.0 },
  },
})
export default class Invisible {}
