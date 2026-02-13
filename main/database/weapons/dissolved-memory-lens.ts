import { Weapon } from '@rpgjs/database';

// Tier: 3
@Weapon({
  id: 'W-WD-08',
  name: 'Dissolved Memory Lens',
  description:
    'A peculiar lens that seems to absorb and refract memories, significantly enhancing magical prowess.',
  atk: 1,
  paramsModifier: {
    int: { value: 49 },
  },
})
export default class DissolvedMemoryLens {}
