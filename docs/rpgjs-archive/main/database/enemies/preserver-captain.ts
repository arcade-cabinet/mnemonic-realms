import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-PV-03',
  name: 'Preserver Captain',
  description:
    'The Preservers\' field commanders. They wear flowing crystal cloaks over midnight-blue armor and carry twin crystal blades. Their faceplates are clear — revealing calm, focused faces. They speak during combat, expressing genuine regret: "I wish you\'d chosen preservation." Their fighting style is elegant and precise.',
  parameters: {
    maxhp: { start: 280, end: 280 },
    str: { start: 35, end: 35 },
    int: { start: 30, end: 30 },
    dex: { start: 35, end: 35 },
    agi: { start: 18, end: 18 },
  },
  gain: {
    exp: 180,
    gold: 75,
  },
})
export default class PreserverCaptain {
  // Context:
  // - Zone: Resonance Fields (Preserver Cathedral), The Undrawn Peaks (Crystalline Fortress Gate)
  // - Fragment affinity: Sorrow / Neutral
  // Abilities:
  // - Twin Crystal Slash: Physical attack. Two hits: each deals ATK × 0.9 damage. Each hit has 25% chance to inflict Stasis independently.
  // - Stasis Dome: AoE. All party members are hit with a 40% chance to inflict Stasis each. No damage. 5-turn cooldown.
  // - Grym's Blessing: Self-heal. Recovers 20% max HP and removes all debuffs. Used once per combat when HP drops below 30%.
  // Drop table:
  // - A-10: 5% chance
  // - C-SC-04: 25% chance
  // - C-HP-03: 15% chance
  // - no drop: 55% chance
}
