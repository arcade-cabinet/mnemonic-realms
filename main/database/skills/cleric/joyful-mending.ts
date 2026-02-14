import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-CL-01',
  name: 'Joyful Mending',
  description: 'ST heal scaling with joy charges.',
  spCost: 6,
  power: 120, // Represents INT * 1.2 base healing
  hitRate: 1,
  coefficient: { int: 1 },
  variance: 10, // 10% variance (90%-110%)
})
export default class JoyfulMending {
  // Formula: floor(INT * 1.2 * (1 + joy_charges * 0.03) * variance)
}
