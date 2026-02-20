import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'B-04a',
  name: "Grym's Right Hand",
  description:
    'A Preserver in ornate ceremonial armor — Grym\'s most loyal lieutenant. They carry a crystal shield depicting frozen scenes from the world\'s history. They fight with reluctant grace: "Grym weeps for every battle. So do I."',
  parameters: {
    maxhp: { start: 900, end: 900 },
    str: { start: 38, end: 38 },
    int: { start: 35, end: 35 },
    dex: { start: 38, end: 38 },
    agi: { start: 16, end: 16 },
  },
  gain: {
    exp: 800,
    gold: 250,
  },
})
export default class GrymsRightHand {
  // Context:
  // - Zone: Preserver Fortress Floor 1 (Gallery of Moments)
  // - Category: boss
  // - Element: Neutral
  // - Level range: 25-27
  // Abilities:
  // - Gallery Strike: ATK * 1.5
  // - Exhibit Shield: absorbs 120 damage, reflects 20% incoming, refreshes at 50% HP
  // - Stasis Wave: AoE 35% Stasis chance, 4-turn CD
  // - Grym's Lament: at 25% HP, hesitates for 1 turn (narrative beat)
  // - Final Stand: ATK * 2.0 to lowest HP party member after hesitation, one-time
  // Drop table:
  // - Guaranteed: unnamed Sorrow/Neutral/4★ fragment
  // - C-SP-10 (Phoenix Feather): guaranteed
}
