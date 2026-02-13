import { Armor } from '@rpgjs/database';

// Tier: 2
@Armor({
  id: 'A-08',
  name: "Ridgewalker's Coat",
  description: 'A durable coat favored by those who traverse high ridges.',
  price: 500,
  pdef: 20,
  paramsModifier: {
    str: { rate: 0.1 },
  },
  elementsDefense: [{ elementId: 'wind', rate: 0.15 }],
})
export default class RidgewalkersCoat {}
