// Tier: 2
// Special Effect: +20% SP regen from Defend action. Cleric/Mage: +25% instead.
import { Armor } from '@rpgjs/database';

@Armor({
  id: 'A-07',
  name: "Hermit's Robe",
  description:
    'A simple, unassuming robe favored by reclusive mages, enhancing their focus during combat.',
  pdef: 14,
  // price is omitted as it's not purchasable (indicated by '—' in the reference)
})
export default class HermitsRobe {}
