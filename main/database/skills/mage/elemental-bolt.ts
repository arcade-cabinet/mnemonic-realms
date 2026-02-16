import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-01',
  name: 'Elemental Bolt',
  description: 'ST spell with player-chosen element.',
  spCost: 5,
  power: 1.8,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class ElementalBolt {
  // Formula: floor((INT * 1.8 - targetDEF * 0.4) * variance * elementMod)
}
