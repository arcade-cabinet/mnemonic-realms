import { Weapon } from '@rpgjs/database';

// Tier: 3
@Weapon({
  id: 'W-ST-07',
  name: 'Euphoric Wand',
  description: 'Emotional charges grant +5% each (doubled from base +3%).',
  atk: 1,
  paramsModifier: {
    int: { value: 40 },
  },
})
export default class EuphoricWand {}
