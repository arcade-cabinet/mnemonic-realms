import { Armor } from '@rpgjs/database';

// Special Effect: +10% ATK. Wind resistance +15%.
// Tier: 2
@Armor({
  id: 'A-08',
  name: "Ridgewalker's Coat",
  description: 'A durable coat favored by those who traverse high ridges.',
  price: 500,
  pdef: 20,
  paramsModifier: {
    str: { rate: 0.1 }, // +10% ATK (assuming ATK maps to 'str')
  },
  elementsDefense: [
    { elementId: 'wind', rate: 0.15 }, // +15% Wind resistance
  ],
})
export default class RidgewalkersCoat {
  // Stat modifiers applied via @Armor decorator
}
