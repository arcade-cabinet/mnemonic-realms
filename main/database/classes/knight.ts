import { Class } from '@rpgjs/database';

/**
 * Knight Class
 *
 * Identity: Highest HP and ATK. Tied for highest DEF. Lowest AGI and INT.
 * A frontline tank and physical damage dealer who can absorb hits but acts late in the turn order.
 *
 * Stat Progression (for reference - these parameters belong to @Actor, not @Class):
 * Stat growth formula: stat(level) = floor(base + growth_rate * (level - 1))
 * - HP: base 45, growth +14.5/level (L10: 175, L20: 320, L30: 466)
 * - SP: base 15, growth +3.2/level (L10: 43, L20: 75, L30: 107)
 * - ATK: base 12, growth +3.3/level (L10: 41, L20: 74, L30: 107)
 * - INT: base 5, growth +1.0/level (L10: 14, L20: 24, L30: 34)
 * - DEF: base 10, growth +3.1/level (L10: 37, L20: 69, L30: 99)
 * - AGI: base 7, growth +1.5/level (L10: 20, L20: 35, L30: 50)
 * Level Cap: 30
 */
@Class({
  id: 'knight',
  name: 'Knight',
  description: 'Frontline tank and physical damage dealer. Highest HP and ATK. Lowest AGI and INT.',
  skillsToLearn: [],
})
export default class Knight {}
