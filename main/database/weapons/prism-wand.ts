import { Weapon } from '@rpgjs/database';

// Tier: 2
@Weapon({
  id: 'W-WD-04',
  name: 'Prism Wand',
  description:
    'A wand that refracts arcane energy, guiding spells to their most vulnerable targets.',
  price: 420,
  atk: 1,
  paramsModifier: {
    int: { value: 21 },
  },
})
export default class PrismWand {}
