---
id: road-intersection
size: [6, 6]
palette: village-premium
parameterized: true
params:
  roadTerrain: [road, road.dirt, road.brick, road.dark-brick]
  roadWidth: 2-4
  arms: [north, south, east, west]
  signpost: boolean
  lamppost: boolean
---
# Road Intersection

Where two or more roads meet, creating a navigational decision point for the player. Intersections are critical wayfinding landmarks -- they orient the player within the map and often serve as locations for signposts, lampposts, NPCs giving directions, and guard encounters.

The intersection is a square of road terrain with arms extending toward the configured cardinal directions. The road layer uses Wang set auto-tiling from `Tileset_Road`, which automatically resolves T-junctions, crossroads, corners, and straight segments based on adjacent road tiles.

## Layers

### road
A plus-shaped (+) pattern of road terrain on the road layer. The center area is always filled; arms extend only in the configured directions.

For a full crossroads (all four arms, roadWidth=2):

| | | | | | |
|---|---|---|---|---|---|
| 0 | 0 | terrain:road | terrain:road | 0 | 0 |
| 0 | 0 | terrain:road | terrain:road | 0 | 0 |
| terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road |
| terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road |
| 0 | 0 | terrain:road | terrain:road | 0 | 0 |
| 0 | 0 | terrain:road | terrain:road | 0 | 0 |

For a T-junction (north, east, west arms only):

| | | | | | |
|---|---|---|---|---|---|
| 0 | 0 | terrain:road | terrain:road | 0 | 0 |
| 0 | 0 | terrain:road | terrain:road | 0 | 0 |
| terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road |
| terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road |
| 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 |

## Collision
All 0 -- roads are fully walkable. Road tiles have no collision.

## Visuals
- **signpost**: `prop.sign-south` or `prop.sign-north` at the center, pointing toward connected destinations
- **lamppost**: `prop.lamppost-1` at one corner of the intersection
- **bulletin-board**: `prop.bulletin-board-1` near the intersection for quest-board locations

## Objects
- **direction-sign**: position (center), type: trigger -- examining the signpost shows a description of each direction
- **guard-npc**: optional NPC stationed at the intersection for story-gated progression

## Anchors
- **north**: (center_x, 0) -- north arm endpoint
- **south**: (center_x, height-1) -- south arm endpoint
- **east**: (width-1, center_y) -- east arm endpoint
- **west**: (0, center_y) -- west arm endpoint

## Notes

- The `Tileset_Road` Wang set has three colors: `Road` (earth), `Brick Road`, and `Dark Brick Road`. Choose based on location:
  - Everwick village square: `terrain:road.brick` (formal)
  - Heartfield farm roads: `terrain:road.dirt` (rural)
  - Millbrook waterfront: `terrain:road.dark-brick` (old stone)
  - Sunridge highland: `terrain:road` (faint trail)
- Road intersections connect to path segments (`PathSegment` in the map composition). The assemblage provides the junction; the paths provide the connecting runs.
- The reference Village Bridge TMX shows extensive road auto-tiling with the Wang set producing smooth curves and transitions.
- Signpost text changes based on game progression and vibrancy level: unknown directions show "A faded sign pointing toward distant lands."
