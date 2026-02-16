import { Armor } from '@rpgjs/database';

// Special effect: +10% water resistance. Immune to Poison.
// Tier: 2
@Armor({
  id: 'A-06',
  name: 'Riverstone Plate',
  description: 'Sturdy plate armor offering protection against water and poison.',
  price: 450,
  pdef: 18,
  elementsDefense: [{ elementId: 'water', rate: 0.1 }],
  statesDefense: [{ stateId: 'poison', rate: 1 }],
})
export default class RiverstonePlate {
  // Stat modifiers applied via @Armor decorator
}
