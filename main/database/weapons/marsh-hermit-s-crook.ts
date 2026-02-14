import { Weapon } from '@rpgjs/database';

// Special Effect: SP cost of all heals reduced by 15%
// Intended for: Cleric
// Weapon Category: Staff
// Tier: 2
@Weapon({
  id: 'W-ST-05',
  name: "Marsh Hermit's Crook",
  description:
    'A gnarled staff, imbued with the quiet wisdom of the marsh. Reduces the SP cost of healing spells.',
  atk: 1,
  paramsModifier: {
    int: { value: 26 },
  },
})
export default class MarshHermitsCrook {}
