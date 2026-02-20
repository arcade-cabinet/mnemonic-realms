---
id: depths-l1
type: dungeon
level: 1
name: Memory Cellar
size: [20, 25]
vibrancy: 25
palette: dungeon-depths
music: bgm-depths-l1
entrance:
  surface: everwick
  position: [8, 17]
  condition: MQ-05
exit:
  stairway: depths-l2
  memoryLift: everwick
assemblages:
  - ref: dungeon-entrance
    position: [10, 0]
    meta: {name: "Cellar Entry", surface: everwick}
  - ref: dungeon-room-small
    position: [1, 7]
    meta: {name: "Memory Alcove"}
  - ref: dungeon-room-large
    position: [10, 7]
    meta: {name: "Guardian Chamber"}
  - ref: dungeon-room-large
    position: [10, 12]
    meta: {name: "Dissolved Memory Cache"}
  - ref: dungeon-stairway
    position: [10, 18]
    meta: {name: "Stairway Chamber", target: depths-l2}
---

# Memory Cellar

Ancient village ruins beneath Everwick's Memorial Garden. Warm stone walls, amber lantern brackets (some still lit), root systems piercing the ceiling, wooden support beams. Feels like an old root cellar that extends far deeper than it should.

The tutorial dungeon -- teaches dungeon mechanics: forced encounters, treasure chests, Resonance Stones, and memory lifts.

Starting vibrancy 25 (Muted tier, dim warm amber).

> Cross-references: [Detailed room layouts](../../maps/dungeon-depths.md#depths-level-1-memory-cellar), [SQ-10](../../story/quest-chains.md)

## Rooms

| Room | Tiles | Purpose | Enemies |
|------|-------|---------|---------|
| Entry Hall | 1,1 - 20,6 | Safe entry with lore inscription | None |
| Memory Alcove | 1,7 - 8,11 | Tutorial loot room | Memory Shade (E-DP-01) |
| Guardian Chamber | 10,7 - 20,11 | First forced encounter | Memory Shade x2-3 |
| Dissolved Memory Cache | 10,12 - 20,17 | Narrative reward room, memory fog vision | None |
| Stairway Chamber | 10,18 - 20,25 | Memory lift + descent to Level 2 | Memory Shade |

## Summary

| Metric | Value |
|--------|-------|
| Rooms | 5 |
| Resonance Stones | 3 |
| Treasure Chests | 2 |
| Enemy types | E-DP-01 (Memory Shade) |
| Boss | None (tutorial floor) |
| Unique fragments | 3 unnamed fragments |
| Memory lift | Room 5 -> Everwick |
| Stairway | Room 5 -> Depths L2 |
| Quest link | SQ-10 (The Depths Expedition) |
