import { Weapon } from '@rpgjs/database';

// Weapon Category: Sword
// Intended for: Knight
// Tier: 3
// Special Effect: ATK scales with total fragments collected (+1 ATK per 5 fragments, max +12).
@Weapon({
  id: 'W-SW-08',
  name: "Memory's Edge",
  description: 'A blade that grows stronger with each fragment of the past recovered.',
  atk: 50,
})
export default class MemorysEdge {}
