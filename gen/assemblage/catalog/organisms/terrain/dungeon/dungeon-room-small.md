---
id: dungeon-room-small
size: [6, 6]
palette: dungeon-depths
tags: [dungeon, room, small, puzzle]
---
# Dungeon Room (Small)

A cramped chamber hewn from bedrock, barely wide enough for two people to stand abreast. Cobwebs cling to the corners where wall meets ceiling. Something glints in the dim light near the back wall -- perhaps a forgotten trinket, perhaps a trap. The stones here are older than those in the corridors, worn smooth by centuries of seeping groundwater.

## Layers

### ground
| | | | | | |
|---|---|---|---|---|---|
| terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone |

### detail
| | | | | | |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:candle.single-1 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | fixed:detail.bones-1 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:detail.crate-1 | 0 | 0 | fixed:candle.single-2 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 |

## Collision
| | | | | | |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 1 |
| 1 | 1 | 0 | 0 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 | 1 |

## Anchors
- **south-entry**: position (2, 5), edge: south

## Objects
- **puzzle-trigger**: position (3, 2), type: trigger
