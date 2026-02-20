---
id: fountain-base
size: [3, 3]
palette: village-premium
---
# Fountain Base

A three-by-three stone fountain basin, the centerpiece of Everwick's village square and other settlement gathering places. The outer ring is a low stone wall (impassable); the center tile contains the animated water spout from `Animation_Fountain_1`.

The ground beneath the fountain is cobblestone road (`terrain:road.brick`), reflecting the paved square that typically surrounds it. The fountain visual object is placed from the `Animation_Fountain_1` tileset for the animated water effect.

## Layers

### ground
| | | |
|---|---|---|
| terrain:road.brick | terrain:road.brick | terrain:road.brick |
| terrain:road.brick | terrain:road.brick | terrain:road.brick |
| terrain:road.brick | terrain:road.brick | terrain:road.brick |

### water
| | | |
|---|---|---|
| 0 | 0 | 0 |
| 0 | terrain:water.shallow | 0 |
| 0 | 0 | 0 |

## Collision
| | | |
|---|---|---|
| 1 | 1 | 1 |
| 1 | 1 | 1 |
| 0 | 0 | 0 |

## Visuals
- **fountain**: object `Animation_Fountain_1` at position (0, 0), animated water spout

## Anchors
- **south**: position (1, 2) -- approach from the village square

## Notes

- The `Animation_Fountain_1` TSX provides a multi-frame animated fountain. The visual object reference handles the animation automatically.
- The bottom row (south side) is walkable so the player can approach and interact.
- In Everwick, the fountain sits at the center of the brick-paved village square, surrounded by roads leading to the elder's house (north), the shop (east), the forge (west), and the memorial garden (south).
- A resonance stone trigger can be placed at (1, 2) for the village square scene interaction.
