import { Armor } from '@rpgjs/database';

// Special Effect: +10% evasion. Rogue: +15% evasion instead.
// Tier: 2
@Armor({
  id: 'A-05',
  name: 'Forest Weave',
  description: 'Light armor woven from forest materials, granting enhanced agility.',
  price: 250,
  pdef: 12,
})
export default class ForestWeave {
  // Stat modifiers applied via @Armor decorator
}
