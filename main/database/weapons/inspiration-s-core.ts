import { Weapon } from '@rpgjs/database';

// Tier: 3
@Weapon({
  id: 'W-WD-07',
  name: "Inspiration's Core",
  description:
    'A wand imbued with the essence of inspiration, reducing the cost of Grand Inspiration.',
  atk: 1,
  paramsModifier: {
    int: { value: 41 },
  },
})
export default class InspirationsCore {}
