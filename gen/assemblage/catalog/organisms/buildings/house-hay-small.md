---
id: house-hay-small
size: [4, 3]
palette: village-premium
objectRef: house.hay-small-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [1, 2]
  - ref: [window-frame-hay](../../molecules/window-frame.md)
    at: [3, 1]
---
# Small Hay House

A humble farmstead cottage built from wattle-and-daub walls with a thick thatched roof that slopes nearly to the ground on the back side. These are the dwellings of Heartfield's tenant farmers -- simple, practical, and warm in winter thanks to the insulating thatch. The walls are unpainted, showing the natural brown of dried mud and straw, and the doorframe is a rough-hewn oak beam darkened by years of smoke.

Small hay houses scatter across Heartfield's rolling farmland, each one standing beside its family's crop fields and connected by dirt paths to the central farmstead road.

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
- **building**: `house.hay-small-1` at position (0, 0)

## Objects
- **door**: position (1, 2), type: transition

## Anchors
- **entrance**: position (1, 2)
- **front**: position (2, 2)

## Notes

- The `Objects_Buildings` hay collection (localTileId 310) renders as a rustic single-story structure.
- Hay houses pair naturally with `crop-row` molecules and `farm-field` terrain organisms to create complete farmstead compositions.
- In Heartfield, hay houses are more common than any colored-wood variant. The colored houses appear only at the crossroads near the old windmill where traveling merchants have settled.
- Prop objects like `prop.barrel-empty` and `prop.crate-medium` placed at (0, 2) or (3, 2) give the farmstead a lived-in quality.
