---
id: forest-border
size: [60, 5]
palette: village-premium
parameterized: true
params:
  edge: [north, south, east, west]
  length: 20-80
  depth: 3-6
  gap: { start: number, end: number } | null
---
# Forest Border

A dense wall of ancient trees forming the impassable boundary of a map zone. Forest borders ring the Settled Lands maps -- Everwick, Heartfield, Ambergrove -- defining where civilization ends and the untamed wild begins. The trees are old-growth emerald oaks and dark pines, their canopies so thick that the ground beneath is perpetual twilight, carpeted in dark grass and fallen needles.

The border is a strip of configurable depth (default 5 tiles) running along one map edge. All tiles within the border are impassable, creating a natural wall. An optional gap defines a passable opening for roads, paths, or transition zones leading to adjacent maps.

Tree visual objects are placed semi-randomly along the strip using a deterministic seeded algorithm. Large trees (`tree.emerald-5`, `tree.emerald-6`) anchor the border with smaller trees (`tree.emerald-3`, `tree.emerald-4`) and bushes (`bush.emerald-1`, `bush.emerald-2`) filling between them.

## Layers

### ground
The entire strip is filled with `terrain:ground.dark-grass`, except in the gap region where tiles are set to 0 (transparent, inheriting the map's default ground).

Example (north edge, length=20, depth=5, gap at tiles 8-11):

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | ... |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| dk | dk | dk | dk | dk | dk | dk | dk | 0 | 0 | 0 | 0 | dk | dk | ... |
| dk | dk | dk | dk | dk | dk | dk | dk | 0 | 0 | 0 | 0 | dk | dk | ... |
| dk | dk | dk | dk | dk | dk | dk | dk | 0 | 0 | 0 | 0 | dk | dk | ... |
| dk | dk | dk | dk | dk | dk | dk | dk | 0 | 0 | 0 | 0 | dk | dk | ... |
| dk | dk | dk | dk | dk | dk | dk | dk | 0 | 0 | 0 | 0 | dk | dk | ... |

Where `dk` = `terrain:ground.dark-grass`, `0` = empty/transparent.

## Collision
All 1 (impassable) except in the gap region where all tiles are 0 (passable).

## Visuals
Tree objects placed algorithmically:
- **tree.emerald-5** (97x124px, ~6x8 tiles) -- dominant canopy trees, spaced 5-7 tiles apart
- **tree.emerald-6** (80x110px, ~5x7 tiles) -- secondary canopy trees
- **tree.emerald-3** (52x92px, ~3x6 tiles) -- gap-filler trees
- **tree.emerald-4** (48x93px, ~3x6 tiles) -- gap-filler trees
- **tree.emerald-1** (64x63px, ~4x4 tiles) -- foreground accent
- **tree.emerald-2** (46x63px, ~3x4 tiles) -- foreground accent
- **bush.emerald-1** (40x29px, ~3x2 tiles) -- underbrush between tree trunks
- **bush.emerald-2** (~2x2 tiles) -- small underbrush

For vertical borders (east/west), trees are placed along the y-axis with the same algorithm but rotated orientation.

## Anchors
- **gap-start**: first passable tile in the gap (connects to a road path)
- **gap-end**: last passable tile in the gap

## Notes

- This is the most-used terrain organism. Every Settled Lands map has 2-4 forest borders.
- The `dark-1`, `dark-2`, `dark-3` tree variants can be mixed in for Ambergrove's borders, creating a darker, more primeval feel.
- The gap width should match the connecting road width (typically 3-4 tiles for main roads, 2 tiles for footpaths).
- In the reference Village Bridge TMX, the forest border is built from `Objects_Trees` collection sprites placed over a dark ground layer, confirming this pattern.
- The existing TypeScript factory in `gen/assemblage/assemblages/terrain/forest-border.ts` implements the same algorithm -- this markdown definition replaces it in the catalog.
