import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-PV-04',
  name: 'Preserver Archivist',
  description:
    "The Preservers' elite scholars. They don't carry weapons — their entire body is partially crystallized, giving them the appearance of living statues. They fight by projecting pure stasis energy from their hands, creating crystal constructs mid-combat. Their voices echo as though speaking through glass. They're the most dangerous non-boss Preserver enemies.",
  parameters: {
    maxhp: { start: 220, end: 220 },
    str: { start: 20, end: 20 },
    int: { start: 38, end: 38 },
    dex: { start: 30, end: 30 },
    agi: { start: 16, end: 16 },
  },
  gain: {
    exp: 170,
    gold: 70,
  },
})
export default class PreserverArchivist {
  // Context:
  // - Zone: Luminous Wastes (Preserver Watchtower), Preserver Fortress (all floors)
  // - Fragment affinity: Sorrow / Dark
  // Abilities:
  // - Stasis Bolt: Magic attack. Deals INT × 1.5 damage. 35% chance to inflict Stasis. Targets the party member with the most active buffs (Preservers target change).
  // - Crystal Construct: Summons 1 Crystal Shard (HP 60, ATK 15, DEF 20, AGI 10). The Shard attacks with a basic physical hit (ATK × 1.2) and has no special abilities. Max 2 Shards. Shards yield no rewards.
  // - Archive Seal: Single target. Seals one player's highest-SP-cost skill for 3 turns (that skill cannot be used). No damage. 5-turn cooldown.
  // Drop table:
  // - C-SP-06: 15% chance
  // - C-SC-04: 20% chance
  // - C-SP-03: 10% chance
  // - no drop: 55% chance
}
