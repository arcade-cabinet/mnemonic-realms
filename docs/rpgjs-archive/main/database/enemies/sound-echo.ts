import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-09',
  name: 'Sound Echo',
  description:
    "Humanoid silhouettes made of compressed sound waves. They look like static-filled outlines of the player character — reflections in a broken mirror. They mimic the player's actions with a slight delay, creating an uncanny mirror-match experience. Their bodies ripple with visible sound waves, and every step they take produces a reversed version of the ambient zone music.",
  parameters: {
    maxhp: { start: 95, end: 95 },
    str: { start: 0, end: 0 },
    int: { start: 0, end: 0 },
    dex: { start: 18, end: 18 },
    agi: { start: 0, end: 0 },
  },
  gain: {
    exp: 90,
    gold: 42,
  },
})
export default class SoundEcho {
  // Context:
  // - Zone: Resonance Fields
  // - Fragment affinity: Awe / Wind
  // Abilities:
  // - Mirrored Strike: Copies the player's last-used attack action. If the player used a basic attack, the Echo uses a basic attack. If the player used a skill, the Echo uses a simplified version (same damage, no special effects). Always targets a random party member.
  // - Resonant Feedback: AoE attack. Deals fixed damage equal to 10% of each party member's max HP. Used every 4th turn.
  // Drop table:
  // - C-BF-05: 5% chance
  // - C-SP-02: 15% chance
  // - no drop: 80% chance
}
