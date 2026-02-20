import { Item } from '@rpgjs/database';

/**
 * Category: sp-recovery
 * Max stack: 10
 * Tier: 1
 */
@Item({
  id: 'C-SP-01',
  name: 'Mana Drop',
  description: 'Restores a small amount of SP.',
  price: 25,
  consumable: true,
  paramsModifier: {
    maxsp: {
      value: 20,
    },
  },
})
export default class ManaDrop {
  // Item properties configured via @Item decorator
}
