import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SK-06',
  name: 'Memory Echo',
  description:
    "Ghostly replays of previous battles. These are not Sound Echoes from the Resonance Fields — they're complete scene-memories of past combatants, replaying fragments of fights that happened in this forest before it was even fully drawn. They appear as translucent figures locked in combat stances, suddenly becoming aware of the player and redirecting their aggression.",
  parameters: {
    maxhp: { start: 140, end: 140 },
    str: { start: 25, end: 25 },
    int: { start: 25, end: 25 },
    dex: { start: 25, end: 25 },
    agi: { start: 22, end: 22 },
  },
  gain: {
    exp: 160,
    gold: 65,
  },
})
export default class MemoryEcho {
  // Context:
  // - Zone: The Half-Drawn Forest
  // - Fragment affinity: Sorrow / Neutral
  // Abilities:
  // - Replayed Strike: The Echo uses a random attack type each turn: physical (ATK × 1.4), magical (INT × 1.5, random element), or debuff (inflict random status effect, 40% chance). Determined at the start of each turn.
  // - Temporal Loop: Once per combat: when the Echo reaches 0 HP, it "rewinds" to 30% HP and resets all debuffs. Only triggers once.
  // Drop table:
  // - C-BF-05: 10% chance
  // - C-SC-05: 10% chance
  // - no drop: 80% chance
}
