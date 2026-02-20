import { Item } from '@rpgjs/database';

/**
 * Category: special
 * Max stack: 3
 * Tier: 3
 */
@Item({
  id: 'C-SP-08',
  name: 'Broadcast Amplifier',
  description: 'Next memory broadcast gains +5 vibrancy bonus (consumed on use, outside combat).',
  price: 300,
  consumable: true,
})
export default class BroadcastAmplifier {
  // Item properties configured via @Item decorator
}
