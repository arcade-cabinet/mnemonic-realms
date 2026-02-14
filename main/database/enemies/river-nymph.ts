import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SL-05',
  name: 'River Nymph',
  description:
    "Translucent humanoid figures that emerge from the Brightwater River. They're composed of flowing water and faint memory-light — you can see the riverbed through their bodies. They sing wordlessly (echoes of the Choir) and attack with jets of pressurized water. Not malicious — they're territorial about the river.",
  parameters: {
    maxhp: { start: 40, end: 40 },
    str: { start: 4, end: 4 },
    int: { start: 9, end: 9 },
    dex: { start: 6, end: 6 },
    agi: { start: 11, end: 11 },
  },
  gain: {
    exp: 35,
    gold: 16,
  },
})
export default class RiverNymph {
  // Context:
  // - Zone: Millbrook
  // - Category: settled
  // - Fragment affinity: Joy / Water
  // Abilities:
  // - Water Jet: INT * 1.6 (water) (Magic attack, water element)
  // - Splash Guard: Reduce next fire attack by 50% (Party water shield, once per combat)
  // Drop table:
  // - C-SP-01 (Mana Drop): 20% chance
  // - C-HP-01 (Minor Potion): 10% chance
}
