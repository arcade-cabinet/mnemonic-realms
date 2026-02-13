import { Weapon } from '@rpgjs/database';

// Tier: 1
@Weapon({
  id: 'W-WD-01',
  name: 'Apprentice Wand',
  description: 'A basic wand for aspiring mages, focusing on magical aptitude.',
  atk: 1,
  paramsModifier: {
    int: { value: 5 },
  },
})
export default class ApprenticeWand {}
