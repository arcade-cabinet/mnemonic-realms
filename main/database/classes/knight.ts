import { Class } from '@rpgjs/database';

// TODO: import skill classes when generated
// import OathStrike from '../skills/knight/oath-strike';
// import VowOfSteel from '../skills/knight/vow-of-steel';
// import ShieldBash from '../skills/knight/shield-bash';
// import OathbreakersGambit from '../skills/knight/oathbreakers-gambit';
// import GuardiansShield from '../skills/knight/guardians-shield';
// import RememberedValor from '../skills/knight/remembered-valor';
// import LastStand from '../skills/knight/last-stand';

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
  // Planned skills (import when generated):
  // { level: 1, skill: OathStrike } from '../skills/knight/oath-strike' (SK-KN-01)
  // { level: 3, skill: VowOfSteel } from '../skills/knight/vow-of-steel' (SK-KN-02)
  // { level: 6, skill: ShieldBash } from '../skills/knight/shield-bash' (SK-KN-03)
  // { level: 10, skill: OathbreakersGambit } from '../skills/knight/oathbreakers-gambit' (SK-KN-04)
  // { level: 15, skill: GuardiansShield } from '../skills/knight/guardians-shield' (SK-KN-05)
  // { level: 20, skill: RememberedValor } from '../skills/knight/remembered-valor' (SK-KN-06)
  // { level: 25, skill: LastStand } from '../skills/knight/last-stand' (SK-KN-07)
})
export default class Knight {}
