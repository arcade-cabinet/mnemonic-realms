---
id: well-structure
size: [2, 2]
palette: village-premium
variants:
  - id: well-generic
    objectRef: well.generic
    description: Fieldstone well with wooden bucket and winch
  - id: well-blue
    objectRef: well.blue
    description: Blue-trimmed well matching Millbrook's palette
  - id: well-green
    objectRef: well.green
    description: Green-trimmed well for Ambergrove settlements
  - id: well-red
    objectRef: well.red
    description: Red-trimmed well matching Everwick's houses
---
# Well Structure

A two-by-two water well with a stone basin, wooden A-frame, and rope-and-bucket mechanism. Wells serve as minor interaction points -- the player can examine them for flavor text, and some conceal memory fragments in their depths.

The visual object is placed from `Objects_Buildings` (the well collection). The ground beneath is dirt. The entire structure is impassable except the southern approach tile.

## Layers

### ground
| | |
|---|---|
| terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt |

## Collision
| | |
|---|---|
| 1 | 1 |
| 0 | 0 |

## Visuals
- **well**: object from `Objects_Buildings` at position (0, 0)
  - Generic: `well.generic` (localTileId 291)
  - Blue: `well.blue` (localTileId 293)
  - Green: `well.green` (localTileId 294)
  - Red: `well.red` (localTileId 296)

## Anchors
- **approach**: position (0, 1) -- player interacts from the south

## Objects
- **well-interact**: position (0, 1), type: trigger, properties: { eventType: action, description: "A deep stone well. The water below catches the light strangely." }

## Notes

- The `Objects_Buildings` TSX defines wells as collection objects with varying sizes. They render as full sprites above the tile grid.
- In Everwick, the red-trimmed well sits near the memorial garden path. In Millbrook, the blue well marks the town square near the waterfront.
- Wells near stagnation zones have a visual shimmer effect and altered interaction text ("The water is perfectly still -- too still").
