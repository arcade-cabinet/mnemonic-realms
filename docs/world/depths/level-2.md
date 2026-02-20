---
id: depths-l2
type: dungeon
level: 2
name: Drowned Archive
size: [20, 25]
vibrancy: 35
palette: dungeon-depths
music: bgm-depths-l2
entrance:
  surface: shimmer-marsh
  position: [33, 43]
  condition: MQ-05
exit:
  stairway: depths-l3
  memoryLift: shimmer-marsh
assemblages:
  - ref: dungeon-entrance
    position: [10, 0]
    meta: {name: "Entry Pool", surface: shimmer-marsh}
  - ref: dungeon-room-large
    position: [1, 5]
    meta: {name: "Reading Hall"}
  - ref: dungeon-room-large
    position: [11, 5]
    meta: {name: "Burdened Stone Chamber"}
  - ref: dungeon-corridor
    position: [1, 10]
    meta: {name: "Flood Hall"}
  - ref: dungeon-room-small
    position: [1, 14]
    meta: {name: "Water Puzzle Chamber"}
  - ref: memory-well
    position: [11, 14]
    meta: {name: "Memory Lift Chamber"}
  - ref: boss-arena
    position: [1, 19]
    meta: {name: "The Archivist's Arena"}
  - ref: dungeon-stairway
    position: [10, 24]
    meta: {name: "Descent to L3", target: depths-l3}
---

# Drowned Archive

Submerged library of a dissolved civilization. Blue-green water fills corridors to knee height. Waterlogged bookshelves line every wall, their contents dissolving into luminous ink that swirls through the water. Globes of compressed memory-water float at ceiling height, providing eerie blue-green illumination.

Starting vibrancy 35 (Normal tier, submerged blue-green glow).

> Cross-references: [Detailed room layouts](../../maps/dungeon-depths.md#depths-level-2-drowned-archive), [GQ-02-S1](../../story/quest-chains.md)

## Rooms

| Room | Tiles | Purpose | Enemies |
|------|-------|---------|---------|
| Entry Pool | 1,1 - 20,4 | Safe entry, shallow luminous water | None |
| Reading Hall | 1,5 - 9,9 | Waterlogged reading room, knee-deep water (-10% AGI) | Drowned Scholar (E-DP-02) |
| Burdened Stone Chamber | 11,5 - 20,9 | GQ-02-S1 burdened stone (1/3) | Drowned Scholar + scaled Memory Shade |
| Flood Hall | 1,10 - 20,13 | Waist-deep corridor, floating debris shortcuts | Drowned Scholar |
| Water Puzzle Chamber | 1,14 - 9,18 | Three-valve puzzle (left-right-center) | None |
| Memory Lift Chamber | 11,14 - 20,18 | Safe room with lift + rest | None |
| Boss Arena | 1,19 - 20,25 | The Archivist encounter | Boss: The Archivist (B-03a) |

## Boss: The Archivist

HP: 450 | ATK: 18 | INT: 32 | DEF: 25 | AGI: 14 | Level: 14-16

Abilities: Tidal Equation, Book Barricade, Dissolution Lesson, Final Chapter (death trigger).

*"Another reader? The archive is closing. But I suppose... one more consultation."*

## Summary

| Metric | Value |
|--------|-------|
| Rooms | 7 |
| Resonance Stones | 4 (1 burdened for GQ-02-S1) |
| Treasure Chests | 4 |
| Enemy types | E-DP-02 (Drowned Scholar), E-DP-01 (Memory Shade, scaled) |
| Boss | B-03a: The Archivist |
| Unique fragments | 4 unnamed + 2 from burdened stone |
| Memory lift | Room 6 -> Shimmer Marsh |
| Stairway | Room 7 -> Depths L3 |
| Puzzle | Water valve sequence (Room 5) |
| Quest links | GQ-02-S1 (burdened stone), SQ-11 (Dissolved Metal) |
