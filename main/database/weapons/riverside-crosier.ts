import { Weapon } from '@rpgjs/database';

// Special Effect: +10% shield strength (Awestruck Ward)
// Intended for: cleric
// Weapon category: staff
// Tier: 2
@Weapon({
  id: 'W-ST-04',
  name: 'Riverside Crosier',
  description:
    "A staff imbued with the calming energy of flowing water, enhancing the wielder's spiritual fortitude and protective spells.",
  price: 380,
  atk: 1, // Minimum ATK for an INT-based weapon
  paramsModifier: {
    int: { value: 20 },
  },
})
export default class RiversideCrosier {
  // Weapon stats configured via @Weapon decorator
}
