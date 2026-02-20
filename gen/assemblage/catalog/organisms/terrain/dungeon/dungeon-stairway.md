---
id: dungeon-stairway
size: [5, 6]
palette: dungeon-depths
tags: [dungeon, stairs, transition, vertical]
---
# Dungeon Stairway

A spiraling descent carved into the living rock, each step worn smooth at the center by the passage of forgotten feet. The walls narrow as the stairway drops, and the air grows heavier with each turn. Iron brackets line the walls where torches once burned; some still hold blackened stubs. A cold updraft rises from below, carrying a sound that might be distant water, or might be breathing.

## Layers

### ground
| | | | | |
|---|---|---|---|---|
| terrain:wall.stone | terrain:wall.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:wall.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone |

### detail
| | | | | |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:candle.sconce-1 | 0 | 0 | 0 |
| 0 | 0 | fixed:door.exit-top | 0 | 0 |
| 0 | 0 | fixed:door.exit-bot | 0 | 0 |
| 0 | 0 | 0 | fixed:candle.sconce-2 | 0 |
| 0 | 0 | 0 | 0 | 0 |

## Collision
| | | | | |
|---|---|---|---|---|
| 1 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 1 | 0 | 1 | 1 |

## Anchors
- **upper-entry**: position (2, 0), edge: north
- **lower-exit**: position (2, 5), edge: south

## Objects
- **stairs-down**: position (2, 2), type: transition, width: 1, height: 2
