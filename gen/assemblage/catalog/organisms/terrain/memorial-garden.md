---
id: memorial-garden
size: [10, 10]
palette: village-premium
extends: garden
variant: memorial
composes:
  - ref: [fountain-base](../../molecules/fountain-base.md)
    at: [4, 4]
---
# Memorial Garden

The formal garden at the heart of Everwick where the names of the departed are inscribed on three Resonance Stones arranged along a central brick pathway. This is where Lira first discovers her ability to sense memory fragments (Act 1, Scene 2) and where the vibrancy system is introduced to the player.

The garden is enclosed by a low cobblestone border with an entrance on the south side. A central brick path runs north-to-south, flanked by flower beds that bloom more vividly as the player collects fragments. A small fountain sits at the garden's center, its basin always holding clear water even when the rest of Everwick feels faded and grey.

Three memorial Resonance Stones are positioned along the path -- one near the entrance, one beside the fountain, and one at the northern end. Each holds fragments of Everwick's collective memory.

## Layers

### ground
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick |
| terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick | terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick |
| terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick | terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick |
| terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick | terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick |
| terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick | terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick |
| terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick | terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick |
| terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick | terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick |
| terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick | terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick |
| terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick | terrain:road.brick | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:road.brick |
| terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick | terrain:road.brick |

### ground2 (detail / flower overlay)
Flower tiles (`terrain:tallgrass.flower`) scattered at ~50% density in the grass cells. Empty (0) on all path and border cells.

## Collision
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

The fountain base (rows 4-5, columns 4-5) is impassable. Border is impassable. Everything else is walkable.

## Visuals
- **fountain**: `Animation_Fountain_1` at position (4, 4) -- composed from `fountain-base` molecule

## Objects
- **rs-ew-01**: position (4, 8), type: trigger -- "Southern Stone: A smooth granite pillar inscribed with names you almost recognize"
- **rs-ew-02**: position (4, 5), type: trigger -- "Fountain Stone: Embedded in the fountain's rim, droplets catch in its worn grooves"
- **rs-ew-03**: position (4, 1), type: trigger -- "Northern Stone: The oldest of the three, leaning slightly as if listening to the wind"

## Anchors
- **entrance**: position (4, 9) -- south entry from the village square

## Notes

- This is a concrete instantiation of the `garden` organism (memorial variant) specifically for Everwick.
- The three resonance stones are story-critical. RS-EW-01 triggers the first memory fragment tutorial. RS-EW-02 and RS-EW-03 become available after Act 1, Scene 2 dialogue with Artun.
- Flower density on the ground2 layer increases as the player collects fragments: 20% at vibrancy 0, 50% at vibrancy 2, 80% at vibrancy 4.
- The fountain composes the `fountain-base` molecule at position (4, 4), adding water layer and collision.
