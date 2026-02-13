import { Weapon } from '@rpgjs/database';

// Tier: 2
@Weapon({
  id: 'W-ST-04',
  name: 'Riverside Crosier',
  description:
    "A staff imbued with the calming energy of flowing water, enhancing the wielder's spiritual fortitude and protective spells.",
  price: 380,
  atk: 1,
  paramsModifier: {
    int: { value: 20 },
  },
})
export default class RiversideCrosier {}
