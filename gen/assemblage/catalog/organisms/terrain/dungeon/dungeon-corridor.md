---
id: dungeon-corridor
size: [3, 8]
palette: dungeon-depths
tags: [dungeon, corridor, passage]
---
# Dungeon Corridor

A narrow stone passage stretching into darkness. Candles flicker in iron sconces bolted to the walls, casting trembling shadows between the close-set stones. The air is cool and faintly damp, carrying the mineral smell of deep earth. Footsteps echo differently here than on the surface -- sharper, more contained, swallowed quickly by the weight of stone overhead.

## Layers

### ground
| | | |
|---|---|---|
| terrain:wall.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:wall.stone |

### detail
| | | |
|---|---|---|
| 0 | 0 | 0 |
| fixed:candle.sconce-1 | 0 | 0 |
| 0 | 0 | 0 |
| 0 | 0 | 0 |
| 0 | 0 | 0 |
| 0 | 0 | fixed:candle.sconce-2 |
| 0 | 0 | 0 |
| 0 | 0 | 0 |

## Collision
| | | |
|---|---|---|
| 1 | 0 | 1 |
| 1 | 0 | 1 |
| 1 | 0 | 1 |
| 1 | 0 | 1 |
| 1 | 0 | 1 |
| 1 | 0 | 1 |
| 1 | 0 | 1 |
| 1 | 0 | 1 |

## Anchors
- **north**: position (1, 0), edge: north
- **south**: position (1, 7), edge: south
