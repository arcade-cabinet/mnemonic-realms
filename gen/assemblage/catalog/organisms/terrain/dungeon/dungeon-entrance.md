---
id: dungeon-entrance
size: [8, 8]
palette: dungeon-depths
tags: [dungeon, entrance, surface, transition]
---
# Dungeon Entrance

The mouth of the depths yawns open in the hillside, framed by crumbling stonework that was once an archway of some grandeur. Vines creep down from the surface, curling around carved pillars that bear the faded remnants of protective wards. The transition from daylight to subterranean gloom is abrupt: three steps down and the world changes entirely. The air thickens, the temperature drops, and the familiar sounds of wind and birdsong are replaced by a resonant silence. A heavy wooden door, long since broken from its hinges, leans against the inner wall. Beyond it, the stone corridor descends at a gentle angle into darkness, lit only by whatever light the visitor carries with them.

## Layers

### ground
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |

### detail
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:foliage.vine-1 | 0 | 0 | 0 | 0 | fixed:foliage.vine-2 | 0 |
| 0 | 0 | fixed:detail.column-1 | 0 | 0 | fixed:detail.column-2 | 0 | 0 |
| 0 | 0 | 0 | fixed:door.enter-top | fixed:door.exit-top | 0 | 0 | 0 |
| 0 | 0 | 0 | fixed:door.enter-bot | fixed:door.exit-bot | 0 | 0 | 0 |
| 0 | fixed:candle.wall-1 | 0 | 0 | 0 | 0 | fixed:candle.wall-2 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Collision
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 0 | 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 1 | 0 | 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 | 0 | 1 | 1 | 1 |

## Anchors
- **surface-entry**: position (3, 0), edge: north
- **depths-exit**: position (3, 7), edge: south

## Objects
- **entrance-transition**: position (3, 0), type: transition, width: 2, height: 1
- **depths-transition**: position (3, 7), type: transition, width: 2, height: 1
- **entrance-sign**: position (1, 3), type: trigger
