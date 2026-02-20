---
id: house-hay-large
size: [6, 5]
palette: village-premium
objectRef: house.hay-large-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [2, 4]
  - ref: [window-frame-hay](../../molecules/window-frame.md)
    at: [1, 3]
  - ref: [window-frame-hay](../../molecules/window-frame.md)
    at: [4, 3]
  - ref: [window-frame-hay](../../molecules/window-frame.md)
    at: [1, 2]
  - ref: [window-frame-hay](../../molecules/window-frame.md)
    at: [4, 2]
  - ref: [chimney](../../molecules/chimney.md)
    at: [5, 0]
---
# Large Hay House

The Granary at Heartfield's crossroads -- a barn-like structure with a massive thatched roof that sweeps down almost to ground level on the back side, wattle-and-daub walls braced by exposed oak beams, and a wide double-door entrance built for loading grain carts. This is the largest building in the farming settlement, part communal storehouse and part gathering hall where Heartfield's families meet during planting season and harvest festivals.

The Granary's interior is a single cavernous space divided by timber columns. Grain sacks line the walls, dried herbs hang from the rafters, and a broad clay hearth occupies the northeast corner. The chimney is rougher than any in Everwick -- a tapered stack of river stones mortared with clay, blackened by decades of cook-smoke.

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
- **building**: `house.hay-large-1` at position (0, 0)

## Objects
- **door**: position (2, 4), type: transition

## Anchors
- **entrance**: position (2, 4)
- **front-left**: position (0, 4) -- hay bale or grain sack prop
- **front-right**: position (5, 4) -- cart or barrel cluster

## Notes

- The `Objects_Buildings` hay-large sprite (`house.hay-large-1`, localTileId 321) renders as a barn-like structure, wider and taller than the medium hay variant. The hay-medium notes reference this ID.
- The building sprite from `Objects_Buildings` may exceed the 6x5 tile footprint in pixel dimensions. The collision grid represents the walkable/blocked area, not the visual bounds.
- In Heartfield, the Granary sits at the crossroads where the road from Everwick meets the farm tracks. It serves as the scene location for Act 1, Scene 5 (First Journey) when the player first arrives from Everwick and seeks the local elder.
- Hay bale props (`prop.haybale-1`, `prop.haybale-2`), grain sack stacks (`prop.sack-grain`), and a wooden cart (`prop.cart-wood`) compose along the front row at the organism level to create the working-farmstead atmosphere.
- The chimney on the large hay house is the roughest of all variants: uncut river stones with visible mortar gaps. At vibrancy 0, no smoke rises; at vibrancy 2+, a steady plume signals that the communal hearth is lit and Heartfield is thriving again.
- Fence sections typically extend from the building corners to enclose a yard that connects to the adjacent crop fields, creating a unified farmstead compound.
