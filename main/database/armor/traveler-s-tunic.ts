import { Armor } from '@rpgjs/database';

// Tier: 1
@Armor({
  id: 'A-01',
  name: "Traveler's Tunic",
  description: 'A simple, comfortable tunic suitable for long journeys.',
  pdef: 3,
  // price: 0 (omit or undefined for not purchasable)
})
export default class TravelersTunic {
  // Stat modifiers applied via @Armor decorator
}
