import { Armor } from '@rpgjs/database';

// Special Effect: +20% evasion. In Sketch zones: +30% evasion.
// Tier: 3
@Armor({
  id: 'A-13',
  name: 'Sketchweave Cloak',
  description:
    'A cloak woven from the fabric of half-drawn realities, granting enhanced agility and evasion.',
  pdef: 24,
})
export default class SketchweaveCloak {
  // Stat modifiers applied via @Armor decorator
}
