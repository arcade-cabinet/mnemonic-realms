import { Item } from '@rpgjs/database';
import Inspired from '../states/inspired';

/**
 * Category: buff
 * Max stack: 3
 * Tier: 3
 */
@Item({
  id: 'C-BF-05',
  name: 'Memory Incense',
  description: 'Grant Inspired status (+20% all stats, 3 turns) to one character.',
  price: 350,
  consumable: true,
  addStates: [Inspired],
})
export default class MemoryIncense {}
