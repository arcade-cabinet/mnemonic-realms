// Special effect: +10% critical hit chance
// Intended for: rogue
// Weapon category: dagger
// Tier: 2
import { Weapon } from '@rpgjs/database';

@Weapon({
  id: 'W-DG-03',
  name: 'Windmill Blade',
  description: 'A blade that spins with the wind, granting swift strikes.',
  price: 200,
  atk: 13,
})
export default class WindmillBlade {}
