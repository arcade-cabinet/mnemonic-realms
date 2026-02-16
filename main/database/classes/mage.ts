import { Class } from '@rpgjs/database';
// TODO: import skill classes when generated
// import Firebolt from '../skills/mage/firebolt';
// import IceShard from '../skills/mage/ice-shard';
// import LightningStrike from '../skills/mage/lightning-strike';
// import ArcaneBlast from '../skills/mage/arcane-blast';
// import ElementalWave from '../skills/mage/elemental-wave';
// import InspiredShield from '../skills/mage/inspired-shield';
// import EurekaMoment from '../skills/mage/eureka-moment';

@Class({
  id: 'mage',
  name: 'Mage',
  description:
    'Glass cannon with highest INT and SP. Devastating magical damage but lowest HP and DEF.',
  skillsToLearn: [],
  // Planned skills (import when generated):
  // level 1: Firebolt (SK-MG-01) from '../skills/mage/firebolt'
  // level 3: IceShard (SK-MG-02) from '../skills/mage/ice-shard'
  // level 5: LightningStrike (SK-MG-03) from '../skills/mage/lightning-strike'
  // level 8: ArcaneBlast (SK-MG-04) from '../skills/mage/arcane-blast'
  // level 12: ElementalWave (SK-MG-05) from '../skills/mage/elemental-wave'
  // level 18: InspiredShield (SK-MG-06) from '../skills/mage/inspired-shield'
  // level 25: EurekaMoment (SK-MG-07) from '../skills/mage/eureka-moment'
})
export default class Mage {
  // Stat progression (for reference only - these values are set on @Actor, not @Class):
  // HP: base 28, growth +7.0/level
  // SP: base 30, growth +6.0/level
  // ATK: base 5, growth +1.0/level
  // INT: base 14, growth +3.8/level
  // DEF: base 5, growth +1.3/level
  // AGI: base 10, growth +2.5/level
  // Level cap: 30
}
