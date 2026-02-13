import { Weapon } from '@rpgjs/database';

// Tier: 2
@Weapon({
  id: 'W-ST-03',
  name: 'Hearthstone Staff',
  description:
    'A staff imbued with the warmth of the Hearthstone Circle, offering solace and healing.',
  price: 220,
  atk: 1,
  paramsModifier: {
    int: { value: 14 },
  },
})
export default class HearthstoneStaff {}
