---
title: The Settled Lands
ring: inner
act: I
startVibrancy: [40, 55]
biomes:
  - village
  - grassland
  - forest
  - riverside
  - highland
palette: village-premium
encounters:
  enemies: [E-SL-01, E-SL-02, E-SL-03, E-SL-04, E-SL-05, E-SL-06, E-SL-07, E-SL-08]
  levelRange: [1, 8]
connections:
  north: frontier/hollow-ridge (MQ-04+)
  south: frontier/shimmer-marsh (MQ-04+)
  east: frontier/flickerveil (MQ-04+)
  west: frontier/hollow-ridge (MQ-04+)
---

# The Settled Lands

The inner ring surrounding Everwick. Well-remembered regions -- farms, roads, neighboring hamlets, established forests. They feel lived-in and safe, but the edges show the first hints of the world's unfinished nature: a fence that fades into nothing, a road that dissolves into shimmer.

Starting vibrancy ranges from 40 to 55 (Normal tier, lower near the edges).

## Locations

| Location | Biome | Size (16px tiles) | Vibrancy | Direction from Everwick |
|----------|-------|-------------------|----------|------------------------|
| [Everwick](everwick.md) | Village | 60x60 | 60 | Center |
| [Heartfield](heartfield.md) | Grassland/Farmland | 80x80 | 55 | South |
| [Ambergrove](ambergrove.md) | Forest | 80x80 | 45 | East |
| [Millbrook](millbrook.md) | Riverside | 80x80 | 50 | West |
| [Sunridge](sunridge.md) | Highland | 80x80 | 40 | North |

## Internal Connections (Always Open)

| From | To | Direction |
|------|----|-----------|
| Everwick | Heartfield | South |
| Everwick | Ambergrove | East |
| Everwick | Millbrook | West |
| Heartfield | Ambergrove | East |
| Heartfield | Millbrook | SW (river) |
| Sunridge | Ambergrove | East |

## Frontier Connections (MQ-04+)

| From | To | Condition |
|------|----|-----------|
| Everwick | Sunridge | After MQ-04 (mountain pass opens) |
| Heartfield | Shimmer Marsh | After MQ-04 |
| Ambergrove | Flickerveil | After MQ-04 (Canopy Path) |
| Millbrook | Hollow Ridge | After MQ-04 |
| Sunridge | Hollow Ridge | After MQ-04 |

## Cross-References

- Act I script: [docs/story/act1-script.md](../../story/act1-script.md)
- Geography overview: [docs/world/geography.md](../geography.md)
- Overworld layout: [docs/maps/overworld-layout.md](../../maps/overworld-layout.md)
