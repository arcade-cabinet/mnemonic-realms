import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-DP-04',
  name: 'Songline Phantom',
  description:
    "Ghostly performers frozen mid-song. Each room of The Songline replays a \"verse\" of a dissolved civilization's final performance. These phantoms are fragments of the performers — they're not fighting the player, they're continuing their performance, and the player is an obstacle in their choreography. Their attacks are dance steps and vocal blasts.",
  parameters: {
    maxhp: { start: 160, end: 160 },
    str: { start: 20, end: 20 },
    int: { start: 32, end: 32 },
    dex: { start: 25, end: 25 },
    agi: { start: 22, end: 22 },
  },
  gain: {
    exp: 140,
    gold: 65,
  },
})
export default class SonglinePhantom {
  // Context:
  // - Zone: Depths Level 4 (The Songline)
  // - Fragment affinity: Joy / Wind
  // Abilities:
  // - Vocal Blast: Magic attack. Deals INT × 1.6 wind-element damage to one target.
  // - Encore: Self-buff. The Phantom acts twice next turn (both actions are Vocal Blast). 4-turn cooldown.
  // - Final Verse: On death: deals INT × 1.0 damage to all party members as a parting note. This is unavoidable.
  // Drop table:
  // - C-SP-03: 15% chance
  // - C-BF-05: 8% chance
  // - no drop: 77% chance
}
