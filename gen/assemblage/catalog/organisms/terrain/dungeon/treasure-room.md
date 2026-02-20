---
id: treasure-room
size: [8, 7]
palette: dungeon-depths
tags: [dungeon, treasure, chest, guardians]
---
# Treasure Room

The door opens onto a chamber that glitters with promise and peril in equal measure. Candelabras flank a raised stone dais at the far wall, their flames steady despite no visible draft -- an unsettling stillness. An ornate chest rests on the dais, its iron bands etched with protective wards that glow faintly in the candlelight. Scattered coins and gem fragments litter the floor around it, as though someone once tried to carry away more than they could hold. The walls are lined with empty weapon racks and shattered display cases. Whatever other treasures this room once held, they were claimed long ago.

## Layers

### ground
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |

### detail
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:detail.crate-1 | 0 | fixed:candle.candelabra-1 | fixed:candle.candelabra-2 | 0 | fixed:detail.barrel-1 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | fixed:chest | 0 | 0 | 0 | 0 |
| 0 | fixed:detail.coin-pile | 0 | 0 | 0 | 0 | fixed:detail.gem-1 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Collision
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 | 0 | 1 | 1 | 1 |

## Anchors
- **south-entry**: position (3, 6), edge: south

## Objects
- **treasure-chest**: position (3, 3), type: chest
- **guardian-spawn-1**: position (2, 4), type: spawn
- **guardian-spawn-2**: position (5, 4), type: spawn
