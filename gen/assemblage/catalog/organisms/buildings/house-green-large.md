---
id: house-green-large
size: [6, 5]
palette: village-premium
objectRef: house.green-large-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [2, 4]
  - ref: [window-frame-green](../../molecules/window-frame.md)
    at: [1, 3]
  - ref: [window-frame-green](../../molecules/window-frame.md)
    at: [4, 3]
  - ref: [window-frame-green](../../molecules/window-frame.md)
    at: [1, 2]
  - ref: [window-frame-green](../../molecules/window-frame.md)
    at: [4, 2]
  - ref: [chimney](../../molecules/chimney.md)
    at: [5, 0]
---
# Large Green House

The grove-keeper's lodge -- the largest building in Ambergrove, rising two stories among ancient oaks whose branches have grown around it as if the forest were slowly reclaiming the structure. The walls are stained the same deep juniper as every green dwelling, but the timber here is older and thicker, cut from trees that fell naturally rather than felled by axe. A wide entrance faces south toward the settlement path, and four shuttered windows look out through gaps in the canopy where shafts of golden light reach the forest floor.

The lodge serves as Ambergrove's meeting hall, archive, and the grove-keeper's personal residence. The ground floor is a single open room with a long table, map-covered walls, and a stone fireplace. The upper floor -- reached by an interior staircase -- holds the keeper's quarters and a balcony that opens into the crown of the canopy.

## Layers

### ground
| | | | | | |
|---|---|---|---|---|---|
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |

## Collision
| | | | | | |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 | 1 |
| 0 | 0 | 0 | 0 | 0 | 0 |

## Visuals
- **building**: `house.green-large-1` at position (0, 0)

## Objects
- **door**: position (2, 4), type: transition

## Anchors
- **entrance**: position (2, 4)
- **front-left**: position (0, 4) -- moss-covered stone bench or lantern
- **front-right**: position (5, 4) -- herb drying rack or wood stack

## Notes

- `house.green-large-2` provides an alternate facade. The green-small notes reference the availability of medium and large green variants in the palette.
- The building sprite from `Objects_Buildings` may exceed the 6x5 tile footprint in pixel dimensions. The collision grid represents the walkable/blocked area, not the visual bounds.
- The dark-grass ground layer continues the forest-floor aesthetic. Tree trunk visual objects (`object:tree.oak-trunk`) can be placed at front-left or front-right to reinforce the sense that the building grows among the trees.
- In Act 1, Scene 6 (The Ancient Grove), the grove-keeper's lodge is the central landmark in Ambergrove. The player arrives from the south path and may enter the lodge to speak with the grove-keeper about the memory fragment detected in the deeper woods.
- Mushroom cluster props (`prop.mushroom-1`, `prop.mushroom-2`) and fallen-log objects scatter around the lodge's perimeter, establishing the wild, half-tamed character of Ambergrove's architecture.
