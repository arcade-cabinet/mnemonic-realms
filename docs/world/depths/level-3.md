---
id: depths-l3
type: dungeon
level: 3
name: Resonant Caverns
size: [20, 25]
vibrancy: 40
palette: dungeon-depths
music: bgm-depths-l3
entrance:
  surface: hollow-ridge
  position: [38, 3]
  condition: MQ-05
exit:
  stairway: depths-l4
  memoryLift: hollow-ridge
assemblages:
  - ref: dungeon-entrance
    position: [10, 0]
    meta: {name: "Crystal Entry", surface: hollow-ridge}
  - ref: dungeon-room-small
    position: [1, 4]
    meta: {name: "Echo Chamber"}
  - ref: dungeon-room-small
    position: [6, 4]
    meta: {name: "Burdened Stone Alcove"}
  - ref: dungeon-room-large
    position: [11, 4]
    meta: {name: "Sound Puzzle Hall"}
  - ref: dungeon-corridor
    position: [1, 9]
    meta: {name: "Crystal Nexus"}
  - ref: underground-lake
    position: [1, 13]
    meta: {name: "Crystal Grotto"}
  - ref: dungeon-corridor
    position: [10, 13]
    meta: {name: "Harmonic Bridge"}
  - ref: boss-arena
    position: [1, 18]
    meta: {name: "The Resonant King's Throne"}
  - ref: dungeon-stairway
    position: [10, 24]
    meta: {name: "Descent to L4", target: depths-l4}
---

# Resonant Caverns

Sound-themed caves with crystalline formations. The walls are living crystal that vibrates at different frequencies. Every footstep produces a musical tone. Resonance Stones are everywhere, humming in chords. Light refracts through crystal walls, casting rainbow patterns across the floor.

Starting vibrancy 40 (Normal tier, prismatic crystal light).

> Cross-references: [Detailed room layouts](../../maps/dungeon-depths.md#depths-level-3-resonant-caverns), [GQ-02-S1](../../story/quest-chains.md)

## Rooms

| Room | Tiles | Purpose | Enemies |
|------|-------|---------|---------|
| Crystal Entry | 1,1 - 20,3 | Safe entry, crystal staircase | None |
| Echo Chamber | 1,4 - 4,8 | Amplified echoes, single RS | Resonant Crystal (E-DP-03) |
| Burdened Stone Alcove | 6,4 - 9,8 | GQ-02-S1 burdened stone (2/3) | None |
| Sound Puzzle Hall | 11,4 - 20,8 | 5-crystal-pillar chord puzzle (C-E-G-A-B) | Resonant Crystal |
| Crystal Nexus | 1,9 - 20,12 | Central hub, memory lift, treasure | Resonant Crystal + scaled Drowned Scholar |
| Crystal Grotto | 1,13 - 8,17 | Natural grotto, lore vision, reward room | None |
| Harmonic Bridge | 10,13 - 20,17 | Crystal bridge (walk, don't run -- 50 HP shockwave) | Resonant Crystal |
| Boss Arena | 1,18 - 20,25 | The Resonant King encounter | Boss: The Resonant King (B-03b) |

## Boss: The Resonant King

HP: 550 | ATK: 22 | INT: 35 | DEF: 30 | AGI: 12 | Level: 16-18

Abilities: Royal Chord, Dissonant Burst, Crown Shatter, Harmonic Shield, Resonant Collapse (death trigger).

The King "speaks" by making the entire cavern vibrate -- words form from harmonics rather than voice.

## Summary

| Metric | Value |
|--------|-------|
| Rooms | 8 |
| Resonance Stones | 4 (1 burdened for GQ-02-S1) |
| Treasure Chests | 4 |
| Enemy types | E-DP-03 (Resonant Crystal), E-DP-02 (scaled), E-DP-01 (scaled) |
| Boss | B-03b: The Resonant King |
| Unique fragments | 4 unnamed + 2 from burdened stone |
| Memory lift | Room 5 -> Hollow Ridge |
| Stairway | Room 8 -> Depths L4 |
| Puzzles | Sound Puzzle (Room 4), Harmonic Bridge (Room 7) |
| Quest links | GQ-02-S1 (burdened stone) |
