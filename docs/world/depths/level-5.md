---
id: depths-l5
type: dungeon
level: 5
name: The Deepest Memory
size: [20, 25]
vibrancy: 30
palette: dungeon-depths
music: bgm-depths-l5
entrance:
  surface: half-drawn-forest
  position: [13, 36]
  condition: MQ-08
exit:
  memoryLift: half-drawn-forest
  fortressShortcut: preserver-fortress-f1
assemblages:
  - ref: dungeon-entrance
    position: [10, 0]
    meta: {name: "The Threshold", surface: half-drawn-forest}
  - ref: dungeon-room-small
    position: [1, 4]
    meta: {name: "Inverted Chamber"}
  - ref: dungeon-room-small
    position: [6, 4]
    meta: {name: "Timeline Fracture"}
  - ref: collapsed-passage
    position: [11, 4]
    meta: {name: "Paradox Corridor"}
  - ref: memory-well
    position: [1, 9]
    meta: {name: "Memory Nexus"}
  - ref: dungeon-room-small
    position: [1, 13]
    meta: {name: "Echo Gallery"}
  - ref: dungeon-room-small
    position: [6, 13]
    meta: {name: "Civilization's End"}
  - ref: treasure-room
    position: [11, 13]
    meta: {name: "Fragment Vault"}
  - ref: dungeon-room-small
    position: [16, 13]
    meta: {name: "Lore Archive"}
  - ref: boss-arena
    position: [1, 18]
    meta: {name: "The First Dreamer's Chamber"}
---

# The Deepest Memory

Abstract, surreal, non-euclidean. The world's oldest memory deposit. The architecture defies logic: staircases lead to ceilings, corridors loop back on themselves, rooms shift perspective like an Escher drawing. The color palette is constantly shifting -- warm amber to cold violet to deep indigo. This is where memory and reality blur: the player sees fragments of scenes that haven't happened yet and scenes from civilizations that dissolved before the world had names.

Starting vibrancy 30 (Muted tier, shifting surreal luminance). The hardest non-Fortress content.

> Cross-references: [Detailed room layouts](../../maps/dungeon-depths.md#depths-level-5-the-deepest-memory), [GQ-03-F2](../../story/quest-chains.md), [MQ-09](../../story/quest-chains.md)

## Rooms

| Room | Tiles | Purpose | Enemies |
|------|-------|---------|---------|
| The Threshold | 1,1 - 20,3 | Entry, civilization montage vision | None |
| Inverted Chamber | 1,4 - 4,8 | Reversed gravity cosmetic, high-value RS | Abyssal Memory (E-DP-05) |
| Timeline Fracture | 6,4 - 9,8 | Split room: Vivid vs Muted Everwick | Abyssal Memory |
| Paradox Corridor | 11,4 - 20,8 | Walk-backward puzzle (infinite loop) | Abyssal Memory + scaled Songline Phantom |
| Memory Nexus | 1,9 - 20,12 | Central hub, memory lift + rest (safe) | None |
| Echo Gallery | 1,13 - 4,17 | Floating dissolved memories, Grym's origin | Abyssal Memory |
| Civilization's End | 6,13 - 9,17 | Oldest dissolution scene, narrative core | None |
| Fragment Vault | 11,13 - 14,17 | 3 high-potency fragments (potency 4) | Abyssal Memory |
| Lore Archive | 16,13 - 20,17 | Best non-boss treasure, Fortress shortcut | None |
| Boss Arena | 1,18 - 20,25 | The First Dreamer encounter | Boss: The First Dreamer (B-03d) |

## Boss: The First Dreamer

**Phase 1: The Test of Memory** (HP 1,200 -> 600, Level 24-26)
- Abilities: Primal Recall (random previous boss ability), Memory Surge (AoE % damage), Dream Shift (element cycling)

**Phase 2: The Offering** (HP 600 -> 0)
- Abilities: Gift of Remembrance (party buff + AoE), Memory Storm (multi-hit), The Final Question (stops attacking, asks player to broadcast a fragment to end the fight)

*"You've come to the bottom of memory. I've been dreaming here since before the first stone was laid. I don't want to fight you. But I need to know if you're ready. Show me what you remember."*

## Summary

| Metric | Value |
|--------|-------|
| Rooms | 10 |
| Resonance Stones | 6 (including 3 high-potency in Fragment Vault) |
| Treasure Chests | 5 |
| Enemy types | E-DP-05 (Abyssal Memory), E-DP-04 (Songline Phantom, scaled) |
| Boss | B-03d: The First Dreamer (two-phase) |
| Unique fragments | 7 unnamed (potency 4), 1 calm/neutral/4 |
| Memory lift | Room 5 -> Half-Drawn Forest |
| Stairway | None (deepest floor, Fortress shortcut via Room 9) |
| Puzzles | Paradox Corridor (Room 4) -- walk backward to progress |
| Quest links | GQ-03-F2 (Fortress shortcut), MQ-09 (Fortress basement access) |
