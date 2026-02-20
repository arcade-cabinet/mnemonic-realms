---
id: house-red-large
size: [6, 5]
palette: village-premium
objectRef: house.red-large-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [2, 4]
  - ref: [window-frame-red](../../molecules/window-frame.md)
    at: [1, 3]
  - ref: [window-frame-red](../../molecules/window-frame.md)
    at: [4, 3]
  - ref: [window-frame-red](../../molecules/window-frame.md)
    at: [1, 2]
  - ref: [window-frame-red](../../molecules/window-frame.md)
    at: [4, 2]
  - ref: [chimney](../../molecules/chimney.md)
    at: [5, 0]
---
# Large Red House

The grandest residential building in the red-wood style -- a full two-story manor with multiple windows, a prominent chimney, and a wide entrance. In Everwick, only one or two buildings reach this size: the elder's council hall or the wealthiest merchant's compound. The architecture suggests prosperity and permanence, with detailed roof tiles and carved wooden trim.

This organism has the largest footprint of the red house variants. It dominates its section of the map and typically anchors a notable location (the north end of the village square, the crossroads near the memorial garden).

## Layers

### ground
| | | | | | |
|---|---|---|---|---|---|
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |

## Collision
| | | | | | |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 | 1 |
| 0 | 0 | 0 | 0 | 0 | 0 |

## Visuals
- **building**: `house.red-large-1` at position (0, 0)

## Objects
- **door**: position (2, 4), type: transition

## Anchors
- **entrance**: position (2, 4)
- **front-left**: position (0, 4)
- **front-right**: position (5, 4)

## Notes

- `house.red-large-2` (localTileId 461) provides an alternate facade.
- The building sprite from `Objects_Buildings` may exceed the 6x5 tile footprint in pixel dimensions. The collision grid represents the walkable/blocked area, not the visual bounds.
- For the elder's council hall, add an NPC spawn point at `front-left` or `front-right` for guards or attendants.
- The bottom row is a wide walkable frontage suitable for NPC gatherings, sign placement, or quest-board props.
