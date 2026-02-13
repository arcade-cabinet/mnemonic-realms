import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-RG-05',
  name: 'Phantom Flurry',
  description: 'Multi-hit with Weakness debuff.',
  spCost: 20,
  power: 60,
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class PhantomFlurry {}
