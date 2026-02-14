import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'B-01',
  name: 'Stagnation Heart',
  description:
    'A massive crystalline formation — a heart-shaped geode of frozen memory, pulsing with cold blue light. Crystal tendrils extend from its base into the ground. When its crystal shell shatters, the inner heart is exposed — a swirling vortex of frozen memory fragments.',
  parameters: {
    maxhp: { start: 400, end: 400 },
    str: { start: 25, end: 25 },
    int: { start: 20, end: 20 },
    dex: { start: 30, end: 30 },
    agi: { start: 8, end: 8 },
  },
  gain: {
    exp: 500,
    gold: 150,
  },
})
export default class StagnationHeart {
  // Context:
  // - Zone: Heartfield (Stagnation Clearing, Act II return)
  // - Category: boss
  // - Element: Dark
  // - Level range: 13-16
  // Phase 1 (Crystal Shell): HP 400, ATK 25, INT 20, DEF 30, AGI 8
  // - Crystal Spike: ATK * 1.5, 20% Stasis
  // - Frost Pulse: INT * 1.2 AoE + Slow (AGI halved, 2 turns)
  // - Stagnation Aura (passive): healing effects -25%
  // Phase 2 (Memory Storm): HP 300, ATK 30, INT 28, DEF 20, AGI 16
  // - Memory Barrage: 3 random hits, ATK * 0.7 each
  // - Desperate Freeze: 60% Stasis, no damage, every 3rd turn
  // - Re-Crystallize: self-heal 10% HP + DEF +10% for 2 turns, once below 50%
  // - Crystal Collapse (death): 50 fixed damage AoE, frees Hana
  // Drop table:
  // - Guaranteed: MF-03 evolves Potency 2->3 (or unnamed Sorrow/Dark/3★)
  // - C-SP-10 (Phoenix Feather): 25% chance
}
