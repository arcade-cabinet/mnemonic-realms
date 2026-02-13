import { Armor } from '@rpgjs/database';

// Tier: 2
@Armor({
  id: 'a-06',
  name: 'Riverstone Plate',
  description: 'Sturdy plate armor offering protection against water and poison.',
  price: 450,
  pdef: 18,
  elementsDefense: [{ elementId: 'water', rate: 0.1 }],
  statesDefense: [{ stateId: 'poison', rate: 1 }],
})
export default class RiverstonePlate {}
