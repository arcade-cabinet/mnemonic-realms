import { Class } from '@rpgjs/database';
// TODO: import skill classes when generated
// import Heal from '../skills/cleric/heal';
// import Shield from '../skills/cleric/shield';
// import Cleanse from '../skills/cleric/cleanse';
// import AttackBuff from '../skills/cleric/attack-buff';
// import PartyHeal from '../skills/cleric/party-heal';
// import Revive from '../skills/cleric/revive';
// import HolySmite from '../skills/cleric/holy-smite';

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
  // Planned skills (import when generated):
  // level 1: Joyful Mending (SK-CL-01) from '../skills/cleric/joyful-mending'
  // level 3: Awestruck Ward (SK-CL-02) from '../skills/cleric/awestruck-ward'
  // level 5: Sorrowful Cleanse (SK-CL-03) from '../skills/cleric/sorrowful-cleanse'
  // level 8: Fury Blessing (SK-CL-04) from '../skills/cleric/fury-blessing'
  // level 12: Divine Intervention (SK-CL-05) from '../skills/cleric/divine-intervention'
  // level 18: Holy Smite (SK-CL-06) from '../skills/cleric/holy-smite'
  // level 25: Emotional Resonance (SK-CL-07) from '../skills/cleric/emotional-resonance'
})
export default class Cleric {
  // Class configuration applied via @Class decorator
}
