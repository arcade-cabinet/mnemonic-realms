import { Item, State } from '@rpgjs/database';

// Category: buff
// Max stack: 5
// Tier: 2
@State({
  id: 'S-DEF-BUFF-01',
  name: 'Aegis Buff',
  description: 'DEF +15%',
  paramsModifier: {
    def: { rate: 0.15 },
  },
  duration: 3,
})
export class DefBuffState extends State {}

@Item({
  id: 'C-BF-03',
  name: 'Aegis Seed',
  description: 'Increases DEF by 15% for 3 turns.',
  price: 100,
  consumable: true,
  addStates: [DefBuffState],
})
export default class AegisSeed {}
