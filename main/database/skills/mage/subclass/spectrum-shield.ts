import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-MG-L2',
  name: 'Spectrum Shield',
  description: 'Strong ST shield with universal resistance.',
  spCost: 20,
  power: 100,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class SpectrumShield {}
