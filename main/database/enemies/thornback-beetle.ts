import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SL-04',
  name: 'Thornback Beetle',
  description:
    "Palm-sized beetles with shells of bark and thorn. They cluster near fallen logs and root tangles. Their thorny backs make them painful to hit — dealing physical damage to them has a 15% chance to deal 5 recoil damage to the attacker. They're slow but tough, and they always fight to the last.",
  parameters: {
    maxhp: { start: 55, end: 55 },
    str: { start: 7, end: 7 },
    int: { start: 2, end: 2 },
    dex: { start: 10, end: 10 },
    agi: { start: 4, end: 4 },
  },
  gain: {
    exp: 35,
    gold: 15,
  },
})
export default class ThornbackBeetle {
  // Context:
  // - Zone: Ambergrove
  // - Category: settled
  // - Fragment affinity: Fury / Earth
  // Abilities:
  // - Mandible Crush: ATK * 1.3 (Basic physical attack)
  // - Thorn Shell: 15% chance 5 fixed recoil (Passive: physical attacks may recoil)
  // Drop table:
  // - C-SC-01: 15% chance
  // - C-HP-01: 15% chance
}
