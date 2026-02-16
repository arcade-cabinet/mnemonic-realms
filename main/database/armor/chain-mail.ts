import { Armor } from '@rpgjs/database';

// Tier: 2
// Special Effect: Knight: +8 DEF instead of +15. Others: AGI -3.
@Armor({
  id: 'A-04',
  name: 'Chain Mail',
  description: 'A sturdy mail shirt offering good physical protection.',
  price: 300,
  pdef: 15,
  paramsModifier: {
    agi: { value: -3 },
  },
})
export default class ChainMail {
  // Stat modifiers applied via @Armor decorator
}
