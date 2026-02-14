import { Weapon } from '@rpgjs/database';

// Special effect: Wind-element spells deal +15% damage
// Intended for: mage
// Weapon category: wand
// Tier: 2
@Weapon({
  id: 'W-WD-03',
  name: 'Windcatcher Rod',
  description: 'A rod that hums with the power of the wind, enhancing elemental spells.',
  price: 240,
  atk: 1, // Minimum ATK for an INT-based weapon
  paramsModifier: {
    int: { value: 15 },
  },
})
export default class WindcatcherRod {}
