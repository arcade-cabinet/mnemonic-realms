import { Weapon } from '@rpgjs/database';

// Tier: 3
@Weapon({
  id: 'W-ST-08',
  name: 'First Light',
  description:
    'A staff that imbues healing spells with inspiration, granting the target a temporary boost.',
  atk: 1,
  paramsModifier: {
    int: { value: 48 },
  },
})
export default class FirstLight {}
