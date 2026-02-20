---
id: house-red-small
size: [4, 3]
palette: village-premium
objectRef: house.red-small-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [1, 2]
  - ref: [window-frame-red](../../molecules/window-frame.md)
    at: [3, 1]
---
# Small Red House

A snug single-room cottage with crimson-painted walls and a steep thatched roof. These are the most common dwellings in Everwick, lining the lanes that radiate from the village square. Each one houses a family who tends the surrounding gardens or works the nearby fields. The red dye comes from iron-rich clay found along the eastern ridge -- a tradition as old as the settlement itself.

The building visual is a single collection object from `Objects_Buildings` (`house.red-small-1`, localTileId 449). It renders as a complete sprite above the tile grid. The ground layer provides a dirt patch, and collision blocks the upper rows while leaving the bottom row open for the player to approach the door.

## Layers

### ground
| | | | |
|---|---|---|---|
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |

## Collision
| | | | |
|---|---|---|---|
| 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 |
| 0 | 0 | 0 | 0 |

## Visuals
- **building**: `house.red-small-1` at position (0, 0)

## Objects
- **door**: position (1, 2), type: transition

## Anchors
- **entrance**: position (1, 2)
- **front**: position (2, 2) -- NPC standing spot outside the door

## Notes

- `house.red-small-2` (localTileId 450) provides an alternate facade for visual variety. Randomly assign `-1` or `-2` when stamping multiple cottages.
- The collision leaves column 1, row 1 open as the doorway. This aligns with the door-frame molecule position.
- In Everwick, small red houses appear in clusters of 2-3 along the lanes between the village square and the forest borders.
- Bottom row is the "front yard" -- fully walkable, where NPC residents may idle or tend a tiny garden.
