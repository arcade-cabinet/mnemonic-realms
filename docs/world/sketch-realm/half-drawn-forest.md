---
id: half-drawn-forest
type: overworld
biome: sketch-forest
size: [80, 80]
vibrancy: 8
palette: desert-sketch
music: bgm-half-drawn-forest
---

# The Half-Drawn Forest

A forest rendered in elegant line-art. Tree trunks are single curved lines. Branches are delicate strokes. Leaves are suggested by clusters of dots. The effect is hauntingly beautiful -- a master artist's preliminary sketch of the perfect forest.

Starting vibrancy 8 (Muted tier).

> Cross-references: [Act III script](../../story/act3-script.md)

## Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| The Living Sketch | (18, 23) | 6x6 | Area actively drawing itself. Broadcasting locks in a version. |
| Archive of Intentions | (28, 8) | 5x5 | Resonance Stone grove. Dissolved memory of forest planners. |
| Sketch Passage | (13, 36) | 3x3 | Hidden entrance to Depths Level 5. |
| Line-Art Canopy | throughout | -- | Elegant sketch trees. Single curved lines for trunks. |

## NPCs

None in initial state. After solidification events, dissolved memory echoes may appear temporarily.

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-HDF-001 | (20, 25) | action | MQ-08 | MQ-08 | Living Sketch: broadcast to solidify forest section |
| EV-HDF-002 | (28, 9) | action | -- | -- | Archive of Intentions: dissolved memory lore |
| EV-HDF-003 | (13, 36) | touch | MQ-08+ | -- | Sketch Passage -> Depths Level 5 |
| EV-HDF-004 | (0, 20) | touch | MQ-07+ | -- | West edge -> Flickerveil (48, 25) |
| EV-HDF-005 | (0, 10) | touch | MQ-08+ | -- | NW edge -> Undrawn Peaks (39, 25) |
| EV-HDF-006 | (20, 39) | touch | MQ-08+ | -- | South edge -> Luminous Wastes (20, 0) |
| EV-HDF-007 | MQ-08 trail stones | action | MQ-08 | MQ-08 | 5 Resonance Stones activated in sequence to navigate |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (0, 20) | West | Flickerveil | (48, 25) | After MQ-07 |
| (0, 10) | NW | Undrawn Peaks | (39, 25) | After MQ-08 |
| (20, 39) | South | Luminous Wastes | (20, 0) | After MQ-08 |
| (13, 36) | Down | Depths Level 5 | (10, 0) | After MQ-08 |

## Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-HF2-01 | (20, 25) | 1 fragment (created by broadcasting) | Living Sketch: RS appears after solidification |
| RS-HF2-02 | (28, 9) | 2 fragments (awe/neutral/3 each) | Archive of Intentions |
| RS-HF2-03 | (29, 10) | 1 fragment (sorrow/light/3) | Archive of Intentions |
| RS-HF2-04 | (10, 15) | 1 fragment (calm/earth/3) | West path |
| RS-HF2-05 | (35, 30) | 1 fragment (fury/wind/3) | East clearing |
| MQ-08 trail stones | (5, 20), (12, 18), (20, 15), (28, 17), (35, 20) | Trail markers | 5 stones in sequence for MQ-08 navigation |

## Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-HF2-01 | (20, 24) | Sketchweave Cloak (A-13) | Living Sketch reward (after solidification) |
| CH-HF2-02 | (30, 10) | Dissolved Essence (C-SP-09) x1 | Archive of Intentions |
| CH-HF2-03 | (14, 37) | Mana Surge (C-SP-03) x2 | Near Depths L5 entrance |

## Enemy Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Forest Paths | (5, 5) -> (35, 35) | Sketch Wolf, Unfinished Treant, Memory Echo | 22-26 | Common: 2 Wolves; Standard: 1 Wolf + 1 Treant; Rare: 1 Treant + 2 Echoes |
| Archive Approach | (25, 5) -> (35, 15) | Memory Echo | 24-26 | Standard: 2 Echoes |
