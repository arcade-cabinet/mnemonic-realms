---
id: house-hay-medium
size: [5, 4]
palette: village-premium
objectRef: house.hay-medium-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [2, 3]
  - ref: [window-frame-hay](../../molecules/window-frame.md)
    at: [1, 2]
  - ref: [window-frame-hay](../../molecules/window-frame.md)
    at: [4, 2]
  - ref: [chimney](../../molecules/chimney.md)
    at: [4, 0]
---
# Medium Hay House

A generous thatched farmhouse with a central hearth room and two side chambers -- one for sleeping, one for storing grain and preserves. The medium hay house is the residence of Heartfield's more prosperous farming families: those who own their fields rather than tenant them, and whose harvests are large enough to merit a storage wing.

The chimney vents a wide clay hearth where the family cooks, dries herbs, and gathers on cold evenings. The thatch roof is reinforced with hazel rods bound in a diamond pattern visible under close inspection.

In Heartfield, the medium hay house often anchors a farmstead cluster: a medium house, two small hay houses, a fenced crop field, and a well.

## Layers

### ground
| | | | | |
|---|---|---|---|---|
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |

## Collision
| | | | | |
|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 |
| 0 | 0 | 0 | 0 | 0 |

## Visuals
- **building**: `house.hay-medium-1` at position (0, 0)

## Objects
- **door**: position (2, 3), type: transition

## Anchors
- **entrance**: position (2, 3)
- **front-left**: position (1, 3) -- space for a barrel or crate
- **front-right**: position (3, 3) -- space for NPC or signpost

## Notes

- The `Objects_Buildings` hay-medium sprite (localTileId 315) is wider and taller than the small hay, showing the additional room and raised roofline.
- The `house.hay-large-1` (localTileId 321) exists for Heartfield's Granary or the Old Windmill interior -- a barn-like structure rather than a dwelling.
- The chimney on hay houses is simpler than on colored-wood houses: a rough clay stack rather than dressed stone.
- Fence sections (`terrain:fence`) typically extend from the building corners to enclose a small yard, creating a defined farmstead footprint.
