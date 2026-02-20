---
title: The Sketch Realm
ring: outer
act: III
startVibrancy: [5, 10]
biomes:
  - sketch-plains
  - sketch-mountain
  - sketch-forest
palette: desert-sketch
encounters:
  enemies: [Sketch Phantom, Void Wisp, Wireframe Drake, Apex Guardian, Sketch Wolf, Unfinished Treant, Memory Echo]
  levelRange: [21, 28]
connections:
  frontier:
    - shimmer-marsh -> luminous-wastes (MQ-07+)
    - hollow-ridge -> undrawn-peaks (MQ-07+)
    - flickerveil -> half-drawn-forest (MQ-07+)
    - resonance-fields -> luminous-wastes (MQ-07+)
---

# The Sketch Realm

The outer ring -- the world's unfinished edge. Terrain is luminous, abstract, and beautiful in a stark, minimalist way. Ground tiles are line-drawn outlines over a soft luminous background. Trees are silhouettes without leaves. Water is flowing line patterns.

Starting vibrancy 5-10 (Muted tier, often near-zero). The player must **remember areas into solidity** to traverse the Sketch -- this is the core gameplay mechanic of Act III.

## Locations

| Location | Biome | Size (16px tiles) | Vibrancy | Direction |
|----------|-------|-------------------|----------|-----------|
| [Luminous Wastes](luminous-wastes.md) | Sketch-plains | 80x80 | 5 | South/West |
| [Undrawn Peaks](undrawn-peaks.md) | Sketch-mountain | 80x80 | 10 | North |
| [Half-Drawn Forest](half-drawn-forest.md) | Sketch-forest | 80x80 | 8 | East |

## Sketch Solidification

Broadcasting in Sketch zones makes terrain **traversable**:

| Fragment Potency | Solidification Radius | Tiles Solidified |
|-----------------|----------------------|-----------------|
| 1 star | 3x3 | 9 tiles |
| 2 stars | 5x5 | 25 tiles |
| 3 stars | 7x7 | 49 tiles |
| 4 stars | 9x9 | 81 tiles |
| 5 stars | 11x11 | 121 tiles |

## Internal Connections

| From | To | Direction | Condition |
|------|----|-----------|-----------|
| Luminous Wastes | Half-Drawn Forest | North | After MQ-08 |
| Undrawn Peaks | Half-Drawn Forest | East | After MQ-08 |

## Depths Entrances

| Dungeon | Surface Map | Entrance | Condition |
|---------|-------------|----------|-----------|
| Depths Level 5: The Deepest Memory | Half-Drawn Forest | Sketch Passage (13, 36) | After MQ-08 |
| Preserver Fortress | Undrawn Peaks | Crystalline Fortress Gate (19, 35) | After MQ-08 (gate solidified) |

## Cross-References

- Act III script: [docs/story/act3-script.md](../../story/act3-script.md)
- Solidification mechanics: [docs/maps/frontier-zones.md](../../maps/frontier-zones.md)
- Geography overview: [docs/world/geography.md](../geography.md)
