import { Weapon } from '@rpgjs/database';

// Tier: 1
@Weapon({
  id: 'W-SW-01',
  name: 'Training Sword',
  description: 'A simple blade for beginners.',
  price: 0,
  atk: 5,
})
export default class TrainingSword {}
