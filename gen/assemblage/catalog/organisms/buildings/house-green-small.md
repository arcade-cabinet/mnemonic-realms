---
id: house-green-small
size: [4, 3]
palette: village-premium
objectRef: house.green-small-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [1, 2]
  - ref: [window-frame-green](../../molecules/window-frame.md)
    at: [3, 1]
---
# Small Green House

A forest-green cottage nestled among the trees of Ambergrove, its stained timber blending with the surrounding canopy. The green pigment is brewed from crushed juniper berries and bark -- a recipe the grove-keepers have passed down since the settlement was founded at the edge of the amber woodland.

Green houses in Ambergrove are deliberately understated, built low to the ground with wide eaves that collect rainwater into garden troughs. Their inhabitants are herbalists, woodcutters, and the quiet folk who prefer the company of trees to the bustle of Everwick's square.

## Layers

### ground
| | | | |
|---|---|---|---|
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |

## Collision
| | | | |
|---|---|---|---|
| 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 |
| 0 | 0 | 0 | 0 |

## Visuals
- **building**: `house.green-small-1` at position (0, 0)

## Objects
- **door**: position (1, 2), type: transition

## Anchors
- **entrance**: position (1, 2)
- **front**: position (2, 2)

## Notes

- `house.green-small-2` (localTileId 374) provides the alternate facade.
- Green houses use `terrain:ground.dark-grass` as their base layer instead of dirt, reflecting the forest floor around them.
- The medium and large green variants (`house.green-medium-1`, `house.green-large-1`) are available for Ambergrove's ranger station and the grove-keeper's lodge.
- Bush visual objects (`bush.emerald-1`, `bush.emerald-2`) are typically placed beside green houses to reinforce the forest-embedded feeling.
