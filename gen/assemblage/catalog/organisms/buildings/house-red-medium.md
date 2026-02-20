---
id: house-red-medium
size: [5, 4]
palette: village-premium
objectRef: house.red-medium-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [2, 3]
  - ref: [window-frame-red](../../molecules/window-frame.md)
    at: [1, 2]
  - ref: [window-frame-red](../../molecules/window-frame.md)
    at: [4, 2]
  - ref: [chimney](../../molecules/chimney.md)
    at: [4, 0]
---
# Medium Red House

A two-room dwelling with a central hearth, flanked windows, and a stone chimney rising from the right side of the roof. Medium houses belong to established families -- the elder's residence, a senior farmer's homestead, or a retired adventurer's retreat. They are taller and wider than the cottages, with a visible second story implied by the window placement.

The Everwick elder Artun lives in the largest medium red house on the north side of the village square. It is the first interior the player enters in Act 1, Scene 1.

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
- **building**: `house.red-medium-1` at position (0, 0)

## Objects
- **door**: position (2, 3), type: transition

## Anchors
- **entrance**: position (2, 3)
- **front-left**: position (1, 3) -- NPC standing spot
- **front-right**: position (3, 3) -- NPC standing spot

## Notes

- `house.red-medium-2` (localTileId 455) and `house.red-medium-alt-1` (localTileId 457) offer alternative facades.
- The door sits centered at column 2. The collision opens column 2, row 2 for the doorway.
- For Artun's house specifically, the door transition targets the `everwick-elders-house` interior map.
- The chimney molecule at (4, 0) extends above the roofline. Smoke particle is optional and vibrancy-gated (appears when settlement vibrancy >= 2).
