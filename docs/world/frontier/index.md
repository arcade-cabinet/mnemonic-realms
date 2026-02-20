---
title: The Frontier
ring: middle
act: II
startVibrancy: [15, 35]
biomes:
  - marsh
  - mountain
  - forest
  - plains
palette: frontier-seasons
encounters:
  enemies: [E-FR-01, E-FR-02, E-FR-03]
  levelRange: [11, 17]
connections:
  settled-lands:
    - heartfield -> shimmer-marsh (MQ-04+)
    - sunridge -> hollow-ridge (MQ-04+)
    - ambergrove -> flickerveil (MQ-04+)
    - millbrook -> hollow-ridge (MQ-04+)
  sketch-realm:
    - shimmer-marsh -> luminous-wastes (MQ-07+)
    - hollow-ridge -> undrawn-peaks (MQ-07+)
    - flickerveil -> half-drawn-forest (MQ-07+)
    - resonance-fields -> luminous-wastes (MQ-07+)
---

# The Frontier

The middle ring beyond the Settled Lands. Memory thins noticeably here. The terrain shifts subtly over time, colors are muted, edges shimmer, and the line between solid ground and unfinished sketch is sometimes hard to spot.

Starting vibrancy ranges from 15 to 35 (Muted to low-Normal). The Frontier is the game's Act II region.

## Locations

| Location | Biome | Size (16px tiles) | Vibrancy | Direction |
|----------|-------|-------------------|----------|-----------|
| [Shimmer Marsh](shimmer-marsh.md) | Wetland/Marsh | 100x100 | 30 | South |
| [Hollow Ridge](hollow-ridge.md) | Mountain/Highland | 100x100 | 20 | North |
| [Flickerveil](flickerveil.md) | Forest (transitioning to Sketch) | 100x100 | 25 | East |
| [Resonance Fields](resonance-fields.md) | Open Plains | 100x100 | 15 | West |

## Vibrancy Gradient

The Frontier's defining visual feature is the vibrancy gradient:

- **Inner Frontier** (adjacent to Settled Lands): Vibrancy 25-35. Colors present but washed out.
- **Mid Frontier**: Vibrancy 15-25. Terrain simplifies. Ground textures flatten.
- **Outer Frontier** (adjacent to Sketch): Vibrancy 5-15. Objects lose definition. Tree silhouettes replace detailed sprites.

## Frontier Expansion Timeline

| Quest | Unlock | Frontier Access |
|-------|--------|----------------|
| MQ-04 (Act I climax) | Mountain pass north of Everwick opens | Sunridge -> Hollow Ridge border, Heartfield -> Shimmer Marsh road |
| MQ-05 (Enter the Frontier) | All Frontier zones accessible | All four Frontier zones reachable |
| GQ-01-04 (God recalls) | God shrine areas activate | Each shrine's approach challenge becomes solvable |
| MQ-07 (Grym's Endgame) | Sketch borders open | Frontier -> Sketch transitions traversable |

## Internal Connections

| From | To | Direction | Condition |
|------|----|-----------|-----------|
| Shimmer Marsh | Flickerveil | East | After MQ-05 |
| Shimmer Marsh | Hollow Ridge | West | After MQ-05 |
| Hollow Ridge | Flickerveil | East | After MQ-05 |
| Hollow Ridge | Resonance Fields | South | After MQ-05 |

## Depths Entrances

| Dungeon | Surface Map | Entrance | Condition |
|---------|-------------|----------|-----------|
| Depths Level 2: Drowned Archive | Shimmer Marsh | Deepwater Sinkhole (33, 43) | After MQ-05 |
| Depths Level 3: Resonant Caverns | Hollow Ridge | Echo Caverns (38, 3) | After MQ-05 |
| Depths Level 4: The Songline | Resonance Fields | Singing Stones (28, 44) | After Singing Stones puzzle |

## Cross-References

- Act II script: [docs/story/act2-script.md](../../story/act2-script.md)
- Frontier aesthetics: [docs/maps/frontier-zones.md](../../maps/frontier-zones.md)
- Geography overview: [docs/world/geography.md](../geography.md)
- Dormant Gods: [docs/world/dormant-gods.md](../dormant-gods.md)
