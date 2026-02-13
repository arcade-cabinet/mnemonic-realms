import { Weapon } from '@rpgjs/database';

// Tier: 2
@Weapon({
  id: 'W-SW-05',
  name: 'Ridgewalker Claymore',
  description:
    'A heavy two-handed sword favored by those who traverse the high ridges. Grants a bonus to ATK when your health is high.',
  price: 600,
  atk: 28,
})
export default class RidgewalkerClaymore {}
