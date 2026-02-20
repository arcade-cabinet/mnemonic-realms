---
id: undrawn-peaks
type: overworld
biome: sketch-mountain
size: [80, 80]
vibrancy: 10
palette: desert-sketch
music: bgm-undrawn-peaks
---

# The Undrawn Peaks

Mountains that are geometric wireframes against the luminous sky. The paths are line segments connecting vertices. Climbing these mountains means solidifying handholds and ledges as you go. Home to the Crystalline Fortress Gate -- the final dungeon entrance.

Starting vibrancy 10 (Muted tier).

> Cross-references: [Act III script](../../story/act3-script.md)

## Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| The Apex | (18, 3) | 4x4 | Highest point in game. Panoramic view. GQ-03-J1 target (Solara). |
| Crystalline Fortress Gate | (18, 33) | 6x4 | Final dungeon entrance. Two crystallized pillars. Preserver Captains guard. |
| Wireframe Ridges | throughout | -- | Geometric line-art mountains. Must solidify handholds to traverse. |
| Sketch Bridge | (20, 20) | 6x2 | Outline bridge over chasm. Requires broadcast to solidify. |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Preserver Captain A | (17, 34) | Static at Fortress Gate | `npc_preserver_captain` | MQ-08 |
| Preserver Captain B | (22, 34) | Static at Fortress Gate | `npc_preserver_captain` | MQ-08 |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-UP-001 | (19, 4) | action | GQ-03-J1 | GQ-03-J1 | Apex: broadcast joy fragment for sunrise beacon (Solara quest) |
| EV-UP-002 | (20, 20) | action | MQ-08 | MQ-08 | Sketch Bridge: broadcast to solidify crossing |
| EV-UP-003 | (19, 34) | action | MQ-08 | MQ-08 | Fortress Gate: broadcast potency 3+ to enter |
| EV-UP-004 | (19, 35) | touch | MQ-08+ | MQ-09 | Fortress Gate entrance -> Preserver Fortress F1 |
| EV-UP-005 | (20, 39) | touch | MQ-07+ | -- | South edge -> Hollow Ridge (25, 0) |
| EV-UP-006 | (39, 25) | touch | MQ-08+ | -- | East edge -> Half-Drawn Forest (0, 10) |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (20, 39) | South | Hollow Ridge | (25, 0) | After MQ-07 |
| (39, 25) | East | Half-Drawn Forest | (0, 10) | After MQ-08 |
| (19, 35) | Down | Preserver Fortress F1 | (10, 0) | After MQ-08 (gate solidified) |

## Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-UP-01 | (19, 4) | 1 fragment (awe/wind/4) | Apex summit |
| RS-UP-02 | (19, 34) | Broadcast target | Fortress Gate: solidify with potency 3+ to enter |
| RS-UP-03 | (10, 15) | 1 fragment (fury/fire/3) | Mountain ledge |
| RS-UP-04 | (30, 25) | 1 fragment (sorrow/earth/3) | East ridge |
| RS-UP-05 | (20, 20) | Broadcast target | Sketch Bridge solidification point |

## Treasure Chests

None documented in initial state. Solidification of wireframe ridges may reveal hidden caches.

## Enemy Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Mountain Paths | (5, 5) -> (35, 30) | Wireframe Drake, Sketch Phantom | 22-26 | Standard: 1 Drake + 1 Phantom; Rare: 2 Drakes |
| Fortress Approach | (12, 28) -> (28, 38) | Apex Guardian (Preserver elite) | 25-28 | Standard: 2 Guardians |
