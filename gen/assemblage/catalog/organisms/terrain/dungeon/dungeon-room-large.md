---
id: dungeon-room-large
size: [10, 10]
palette: dungeon-depths
tags: [dungeon, room, large, encounter]
---
# Dungeon Room (Large)

A broad, vaulted chamber that opens unexpectedly from the cramped corridors. Four stone columns rise from floor to ceiling, their surfaces carved with half-eroded sigils that might once have held meaning. The floor tiles are arranged in a deliberate mosaic pattern -- dirt and stone alternating in concentric rings around the room's center. Whatever purpose this chamber served, it was built to hold many people, or something very large.

## Layers

### ground
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |

### detail
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:candle.wall-1 | 0 | 0 | 0 | 0 | 0 | 0 | fixed:candle.wall-2 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | fixed:detail.column-1 | 0 | 0 | fixed:detail.column-2 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | fixed:detail.column-3 | 0 | 0 | fixed:detail.column-4 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:candle.wall-1 | 0 | 0 | 0 | 0 | 0 | 0 | fixed:candle.wall-2 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Collision
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 1 | 1 |

## Anchors
- **south-entry**: position (4, 9), edge: south
- **north-entry**: position (4, 0), edge: north, optional: true

## Objects
- **encounter-zone**: position (3, 3), type: trigger, width: 4, height: 4
