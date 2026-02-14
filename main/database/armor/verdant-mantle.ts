import { Armor } from '@rpgjs/database';

// Special Effect: Regenerate 2% max HP per turn in combat.
// Tier: 3
@Armor({
  id: 'A-12',
  name: 'Verdant Mantle',
  description:
    'A mantle imbued with natural vitality, granting its wearer a steady regeneration in combat.',
  pdef: 28,
})
export default class VerdantMantle {}
