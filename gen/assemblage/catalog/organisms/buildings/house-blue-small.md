---
id: house-blue-small
size: [4, 3]
palette: village-premium
objectRef: house.blue-small-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [1, 2]
  - ref: [window-frame-blue](../../molecules/window-frame.md)
    at: [3, 1]
---
# Small Blue House

A compact waterfront cottage washed in the deep blue that marks Millbrook's architecture. The blue comes from indigo imported upriver -- the same dye trade that made Millbrook a crossroads in the first place. Small blue houses cluster along the Brightwater River's banks, their foundations reinforced against seasonal flooding with stone plinths visible below the wooden walls.

These cottages house the fishers, bargemen, and dock workers who keep Millbrook's river trade alive. Inside, the rooms are tight but cheerful, with rope-slung hammocks and the ever-present smell of river water and smoked fish.

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
- **building**: `house.blue-small-1` at position (0, 0)

## Objects
- **door**: position (1, 2), type: transition

## Anchors
- **entrance**: position (1, 2)
- **front**: position (2, 2)

## Notes

- `house.blue-small-2` (localTileId 342) provides the alternate facade.
- Millbrook's buildings often have crate props (`prop.crate-medium`) and barrel props (`prop.barrel-water`) placed adjacent to the front row, giving the waterfront a busy, working feel.
- Blue houses appear in Millbrook and occasionally in Everwick for variety (visiting merchants, relocated families).
