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
  // - Fragment affinity: Joy / Water
  // Abilities:
  // - Water Jet: Magic attack. Deals INT × 1.6 water-element magical damage. Targets one player.
  // - Splash Guard: Party-wide water shield. Reduces the next incoming fire-element attack by 50%. Used once per combat at the start.
  // Drop table:
  // - C-SP-01: 20% chance
  // - C-HP-01: 10% chance
  // - no drop: 70% chance
}
