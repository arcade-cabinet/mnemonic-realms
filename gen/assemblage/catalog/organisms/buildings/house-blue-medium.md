---
id: house-blue-medium
size: [5, 4]
palette: village-premium
objectRef: house.blue-medium-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [2, 3]
  - ref: [window-frame-blue](../../molecules/window-frame.md)
    at: [1, 2]
  - ref: [window-frame-blue](../../molecules/window-frame.md)
    at: [4, 2]
  - ref: [chimney](../../molecules/chimney.md)
    at: [4, 0]
---
# Medium Blue House

A sturdy two-room dwelling in the Millbrook waterfront style, built to withstand river damp and winter storms. The walls are thick planking sealed with pitch below the blue wash, and the roof is angled steeply to shed rain. A chimney on the right side vents the iron stove that keeps the interior warm through the wet season.

Medium blue houses serve as the homes of Millbrook's established citizens -- the bridge keeper, the fish market owner's family, the retired sailor who now runs the message post. They line the main road that parallels the Brightwater River's east bank.

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
- **building**: `house.blue-medium-1` at position (0, 0)

## Objects
- **door**: position (2, 3), type: transition

## Anchors
- **entrance**: position (2, 3)
- **front-left**: position (1, 3)
- **front-right**: position (3, 3)

## Notes

- `house.blue-medium-2` (localTileId 347) and `house.blue-medium-alt-1` (localTileId 349) provide facade alternatives.
- In Millbrook, the medium blue houses are often set back from the river by one road width, with docks or market stalls between them and the water.
- The large blue variants (`house.blue-large-1` through `house.blue-large-4`, localTileIds 352-355) exist in the palette for the Millbrook harbormaster's residence or the river trading post.
