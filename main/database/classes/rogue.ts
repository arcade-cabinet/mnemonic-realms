import { Class } from '@rpgjs/database';

/**
 * Rogue Class
 *
 * Identity: Highest AGI — always acts first. Moderate ATK (compensated by skill multipliers and Foreshadow mechanics).
 * Low DEF but evades instead. Moderate HP — can take a few hits but prefers not to.
 * Low INT — relies on physical-based skills, not magic.
 *
 * Stat Progression (for reference - these parameters belong to @Actor, not @Class):
 * | Stat | Base (L1) | Growth Rate | L10 | L20 | L30 |
 * |------|-----------|-------------|-----|-----|-----|
 * | HP   | 32        | +8.5/level  | 108 | 193 | 278 |
 * | SP   | 20        | +4.5/level  | 60  | 105 | 150 |
 * | ATK  | 10        | +2.5/level  | 32  | 57  | 82  |
 * | INT  | 6         | +1.3/level  | 17  | 30  | 43  |
 * | DEF  | 7         | +1.5/level  | 20  | 35  | 50  |
 * | AGI  | 13        | +3.3/level  | 42  | 75  | 108 |
 * Level cap: 30
 */
@Class({
  id: 'rogue',
  name: 'Rogue',
  description: 'Speed-based damage dealer. Highest AGI, always acts first. Evasion-based survival.',
  skillsToLearn: [],
})
export default class Rogue {}
