import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-10',
  name: 'Stone Guardian',
  description:
    "Massive humanoid figures carved from Resonance Stone. They stand motionless beside the standing stones, distinguishable from natural formations only by the faint amber glow in their eye-sockets. When threatened, they move with surprising fluidity — the Resonance Stone flows like liquid for a moment before re-hardening with each step. They don't attack unless the player tries to interact with a Resonance Stone they're guarding.",
  parameters: {
    maxhp: { start: 160, end: 160 },
    str: { start: 28, end: 28 },
    int: { start: 5, end: 5 },
    dex: { start: 32, end: 32 },
    agi: { start: 6, end: 6 },
  },
  gain: {
    exp: 110,
    gold: 55,
  },
})
export default class StoneGuardian {
  // Context:
  // - Zone: Resonance Fields
  // - Fragment affinity: Awe / Earth
  // Abilities:
  // - Resonant Smash: Physical attack. Deals ATK × 1.5 damage. 20% chance to inflict Stun.
  // - Stone Resonance: Self-buff. Gains a shield absorbing 40 damage. While the shield holds, the Guardian's attacks deal +20% damage. Used at the start of combat.
  // - Petrifying Gaze: Single target. 30% chance to inflict Slow + Weakness simultaneously. No damage. 4-turn cooldown.
  // Drop table:
  // - C-BF-03: 12% chance
  // - C-SC-03: 15% chance
  // - C-HP-02: 10% chance
  // - no drop: 63% chance
}
