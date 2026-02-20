---
id: house-blue-large
size: [6, 5]
palette: village-premium
objectRef: house.blue-large-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [2, 4]
  - ref: [window-frame-blue](../../molecules/window-frame.md)
    at: [1, 3]
  - ref: [window-frame-blue](../../molecules/window-frame.md)
    at: [4, 3]
  - ref: [window-frame-blue](../../molecules/window-frame.md)
    at: [1, 2]
  - ref: [window-frame-blue](../../molecules/window-frame.md)
    at: [4, 2]
  - ref: [chimney](../../molecules/chimney.md)
    at: [5, 0]
  - ref: [balcony-blue](../../molecules/balcony.md)
    at: [1, 1]
---
# Large Blue House

The most imposing structure on Millbrook's waterfront -- a tall, broad two-story building with indigo-washed walls, multiple shuttered windows, and a wide entrance flanked by storm lanterns. This is the harbormaster's residence or the river trading post, the kind of building that commands the dock road and watches over every barge that ties up at the quay.

The upper story sports a balcony where the harbormaster surveys arriving cargo. Four windows punch through the thick walls on the second and third rows, catching the river light. A stone chimney on the right vents the iron stove that heats the office and living quarters above. The foundation stones are visible below the waterline mark -- a reminder that the Brightwater River has tested this building more than once.

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
- **building**: `house.blue-large-1` at position (0, 0)

## Objects
- **door**: position (2, 4), type: transition

## Anchors
- **entrance**: position (2, 4)
- **front-left**: position (0, 4) -- crate or barrel placement for dock atmosphere
- **front-right**: position (5, 4) -- lantern post or signboard placement

## Notes

- `house.blue-large-2` (localTileId 353), `house.blue-large-3` (localTileId 354), and `house.blue-large-4` (localTileId 355) provide facade alternatives. The blue-medium notes reference these IDs.
- The building sprite from `Objects_Buildings` may exceed the 6x5 tile footprint in pixel dimensions. The collision grid represents the walkable/blocked area, not the visual bounds.
- In Millbrook, the large blue house anchors the harbor district. Place it at the north end of the dock road with market-stall-frame molecules and barrel props filling the front row.
- The balcony molecule at row 1 is purely decorative on the exterior map. The interior map for the upper floor places a door-frame at the balcony position.
- Rope coil props (`prop.rope-coil`), anchor props (`prop.anchor-iron`), and crate stacks give the frontage a working-port character distinct from Everwick's residential lanes.
