---
id: depths-l4
type: dungeon
level: 4
name: The Songline
size: [20, 25]
vibrancy: 45
palette: dungeon-depths
music: bgm-depths-l4
entrance:
  surface: resonance-fields
  position: [28, 44]
  condition: singing-stones-puzzle
exit:
  stairway: depths-l5
  memoryLift: resonance-fields
assemblages:
  - ref: dungeon-entrance
    position: [10, 0]
    meta: {name: "First Verse - Prelude", surface: resonance-fields}
  - ref: dungeon-room-large
    position: [10, 5]
    meta: {name: "Second Verse - Rising"}
  - ref: memory-well
    position: [1, 5]
    meta: {name: "Memory Lift / Interlude"}
  - ref: dungeon-corridor
    position: [1, 10]
    meta: {name: "Third Verse - Crescendo"}
  - ref: dungeon-room-large
    position: [10, 15]
    meta: {name: "Fourth Verse - The Dissolution"}
  - ref: treasure-room
    position: [1, 15]
    meta: {name: "Treasure Alcove"}
  - ref: boss-arena
    position: [1, 20]
    meta: {name: "The Conductor's Stage"}
  - ref: dungeon-stairway
    position: [10, 24]
    meta: {name: "Descent to L5", target: depths-l5}
---

# The Songline

Linear memory-corridor. Each room is a "verse" of a dissolved song -- the final performance of a civilization that chose to dissolve itself through music. Corridors of golden light connect translucent rooms where ghostly performers endlessly repeat their verse. The architecture is impossible -- rooms hang suspended in luminous void, connected by bridges of solidified sound.

Starting vibrancy 45 (Normal tier, golden corridor glow).

> Cross-references: [Detailed room layouts](../../maps/dungeon-depths.md#depths-level-4-the-songline), [GQ-02-S1](../../story/quest-chains.md)

## Rooms

| Room | Tiles | Purpose | Enemies |
|------|-------|---------|---------|
| First Verse: Prelude | 1,1 - 20,4 | Entry, performers assembling lore vision | Songline Phantom (E-DP-04) |
| Second Verse: Rising | 10,5 - 20,9 | GQ-02-S1 burdened stone (3/3, final) | Songline Phantom |
| Interlude | 1,5 - 8,9 | Memory lift + rest (safe room) | None |
| Third Verse: Crescendo | 1,10 - 20,14 | High-density combat, guarded treasure | Songline Phantom x2-3 |
| Fourth Verse: The Dissolution | 10,15 - 20,19 | Performers dissolving, narrative peak | Songline Phantom |
| Treasure Alcove | 1,15 - 8,19 | Best non-boss loot, performer's notes | Songline Phantom |
| Boss Arena | 1,20 - 20,25 | The Conductor encounter | Boss: The Conductor (B-03c) |

## Boss: The Conductor

HP: 650 | ATK: 25 | INT: 38 | DEF: 28 | AGI: 20 | Level: 19-21

Abilities: First Movement (Allegro), Second Movement (Adagio), Third Movement (Crescendo), Fourth Movement (Fortissimo), Finale (death trigger -- heals all party HP/SP).

*"You've heard the verses. You've watched them dissolve. Now... the finale. I've been holding this last note for a thousand years. Help me finish it."*

## Summary

| Metric | Value |
|--------|-------|
| Rooms | 7 |
| Resonance Stones | 4 (1 burdened for GQ-02-S1, 1 rest point) |
| Treasure Chests | 5 |
| Enemy types | E-DP-04 (Songline Phantom) |
| Boss | B-03c: The Conductor |
| Unique fragments | 3 unnamed + 2 from burdened stone |
| Memory lift | Room 3 -> Resonance Fields |
| Stairway | Room 7 -> Depths L5 |
| Puzzle | None (combat-focused floor) |
| Quest links | GQ-02-S1 (final burdened stone) |
