import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-07',
  name: 'Unbroken Promise',
  description: 'Last stand auto-heal with ATK boost.',
  spCost: 40,
  power: 0, // Base power is 0 as healing is percentage-based
  hitRate: 1, // Automatic self-effect always hits
  coefficient: { maxhp: 0.35 }, // Heals 35% of max HP
})
export default class UnbrokenPromise {
  // Formula: When HP drops below 20%, automatically heal self for 35% of max HP
  // and gain ATK +30% for 2 turns. Triggers once per battle.
  // Requires 40 SP available when triggered.
}
