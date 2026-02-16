import { Class } from '@rpgjs/database';

// TODO: import skill classes when generated
// import ForeshadowStrike from '../skills/rogue/foreshadow-strike';
// import EchoDodge from '../skills/rogue/echo-dodge';
// import MemoryTheft from '../skills/rogue/memory-theft';
// import ShadowStep from '../skills/rogue/shadow-step';
// import Vanish from '../skills/rogue/vanish'; // Placeholder for SK-RG-05
// import CriticalInsight from '../skills/rogue/critical-insight'; // Placeholder for SK-RG-06
// import TemporalAmbush from '../skills/rogue/temporal-ambush';

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
  // Planned skills (import when generated):
  // { level: 1, skill: ForeshadowStrike } from '../skills/rogue/foreshadow-strike' (SK-RG-01)
  // { level: 3, skill: EchoDodge } from '../skills/rogue/echo-dodge' (SK-RG-02)
  // { level: 6, skill: MemoryTheft } from '../skills/rogue/memory-theft' (SK-RG-03)
  // { level: 10, skill: ShadowStep } from '../skills/rogue/shadow-step' (SK-RG-04)
  // { level: 15, skill: Vanish } from '../skills/rogue/vanish' (SK-RG-05)
  // { level: 20, skill: CriticalInsight } from '../skills/rogue/critical-insight' (SK-RG-06)
  // { level: 25, skill: TemporalAmbush } from '../skills/rogue/temporal-ambush' (SK-RG-07)
})
export default class Rogue {
  // Class configuration applied via @Class decorator
}
