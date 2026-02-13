import { Weapon } from '@rpgjs/database';

// Tier: 3
@Weapon({
  id: 'W-SW-06',
  name: 'Frontier Greatsword',
  description:
    'A massive two-handed sword, favored by those who venture into untamed lands. Deals bonus damage against Preserver enemies.',
  price: 900,
  atk: 35,
})
export default class FrontierGreatsword {}
