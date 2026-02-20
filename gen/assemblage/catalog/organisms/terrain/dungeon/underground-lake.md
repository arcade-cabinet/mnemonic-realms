---
id: underground-lake
size: [10, 8]
palette: dungeon-depths
tags: [dungeon, water, lake, underground]
---
# Underground Lake

The corridor opens onto a cavern where the ceiling disappears upward into absolute darkness and the floor gives way to black, still water. The lake stretches farther than the feeble candlelight can reach, its surface so motionless it could be glass -- or a void. A narrow stone walkway, slick with moisture, hugs the cavern wall along the eastern edge. Clusters of pale, luminous mushrooms grow in the cracks between stones where the walkway meets the water, their glow casting a ghostly blue-green light across the nearest few feet of surface. Occasionally, a ripple disturbs the stillness from somewhere in the center of the lake, though nothing is visible to cause it.

## Layers

### ground
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone |

### detail
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:foliage.mushroom-1 | 0 | 0 | 0 | 0 | 0 | 0 | fixed:candle.sconce-1 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:foliage.mushroom-2 | 0 | 0 | 0 | 0 | 0 | 0 | fixed:candle.sconce-2 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Collision
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 |

## Anchors
- **north-entry**: position (7, 0), edge: north
- **south-entry**: position (7, 7), edge: south

## Objects
- **lake-inspect**: position (4, 3), type: trigger, width: 2, height: 2
