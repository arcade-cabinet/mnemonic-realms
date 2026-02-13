import { Class } from '@rpgjs/database';

/**
 * Cleric Class
 *
 * Identity: Pure support and healer. Highest SP for sustained casting. Strong INT for heal power.
 *
 * Stat Progression (for reference - these parameters belong to @Actor, not @Class):
 * - HP: base 35, growth +10.0/level (L1: 35, L10: 125, L20: 225, L30: 325)
 * - SP: base 25, growth +5.5/level (L1: 25, L10: 74, L20: 129, L30: 184)
 * - ATK: base 7, growth +1.5/level (L1: 7, L10: 20, L20: 35, L30: 50)
 * - INT: base 12, growth +3.3/level (L1: 12, L10: 41, L20: 74, L30: 107)
 * - DEF: base 9, growth +2.5/level (L1: 9, L10: 31, L20: 56, L30: 81)
 * - AGI: base 6, growth +1.3/level (L1: 6, L10: 17, L20: 30, L30: 43)
 * Level Cap: 30
 */
@Class({
  id: 'cleric',
  name: 'Cleric',
  description:
    'Pure support and healer. Highest SP for sustained casting. Strong INT for heal power.',
  skillsToLearn: [],
})
export default class Cleric {}
