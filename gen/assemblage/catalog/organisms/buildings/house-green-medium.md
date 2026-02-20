---
id: house-green-medium
size: [5, 4]
palette: village-premium
objectRef: house.green-medium-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [2, 3]
  - ref: [window-frame-green](../../molecules/window-frame.md)
    at: [1, 2]
  - ref: [window-frame-green](../../molecules/window-frame.md)
    at: [4, 2]
  - ref: [chimney](../../molecules/chimney.md)
    at: [4, 0]
---
# Medium Green House

A spacious woodland dwelling built from timber stained deep juniper green, standing among the old trees of Ambergrove. The walls are thick enough to muffle the wind that rolls through the canopy, and the steep roof sheds autumn leaves as readily as rain. A stone chimney on the right side vents the herb-drying hearth that fills the house with the scent of rosemary and sage.

Medium green houses belong to Ambergrove's established residents -- the ranger who patrols the grove's eastern boundary, the herbalist whose garden spills out the back door, the charcoal-burner's widow who now tends the village's seed library. The house is larger than a woodcutter's cottage but modest compared to the grove-keeper's lodge, reflecting the settlement's ethos that no one needs more space than the forest offers freely.

## Layers

### ground
| | | | | |
|---|---|---|---|---|
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |

## Collision
| | | | | |
|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 |
| 0 | 0 | 0 | 0 | 0 |

## Visuals
- **building**: `house.green-medium-1` at position (0, 0)

## Objects
- **door**: position (2, 3), type: transition

## Anchors
- **entrance**: position (2, 3)
- **front-left**: position (1, 3) -- herb garden or bush placement
- **front-right**: position (3, 3) -- NPC standing spot or lantern post

## Notes

- `house.green-medium-2` and `house.green-medium-alt-1` provide facade alternatives following the same localTileId pattern as other medium variants.
- Green houses use `terrain:ground.dark-grass` as their base layer, matching the forest floor aesthetic established by the small green variant.
- Bush visual objects (`bush.emerald-1`, `bush.emerald-2`) and fern props (`prop.fern-cluster`) typically flank the front row, blurring the boundary between building and forest.
- The chimney on green houses is rougher fieldstone rather than dressed masonry, matching the rural woodland construction. Smoke curls up into the canopy where it disperses among the branches.
- For the ranger's house in Scene 6, the door transition targets the `ambergrove-ranger-house` interior map, and a bow rack prop sits at front-right.
