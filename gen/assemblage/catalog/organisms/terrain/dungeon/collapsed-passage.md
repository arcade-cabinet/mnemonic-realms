---
id: collapsed-passage
size: [7, 5]
palette: dungeon-depths
tags: [dungeon, collapsed, rubble, obstacle]
---
# Collapsed Passage

The corridor ahead tells a violent story. The ceiling has buckled inward, spilling tons of broken stone across the floor in a jagged heap that nearly reaches the surviving roof beams. Dust still hangs in the air, though whatever catastrophe caused this happened long ago. A narrow gap remains along the left wall -- barely wide enough for a person to squeeze through sideways, scraping against raw stone on both sides. The rubble is not random: mixed among the broken masonry are fragments of carved stone, pieces of what might have been a supporting arch or a decorative frieze. Something structural gave way here, and the passage beyond is darker and more cramped than what came before it.

## Layers

### ground
| | | | | | | |
|---|---|---|---|---|---|---|
| terrain:wall.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.dirt | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.dirt | terrain:wall.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.dirt | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |

### detail
| | | | | | | |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | fixed:detail.rubble-1 | fixed:detail.brick-pile-1 | 0 | 0 | 0 |
| 0 | 0 | fixed:detail.rubble-2 | fixed:detail.brick-pile-2 | fixed:detail.rubble-1 | 0 | 0 |
| 0 | 0 | fixed:detail.brick-pile-1 | fixed:detail.rubble-2 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Collision
| | | | | | | |
|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 | 1 |

## Anchors
- **north-squeeze**: position (1, 0), edge: north
- **south-squeeze**: position (1, 4), edge: south

## Objects
- **rubble-inspect**: position (3, 2), type: trigger
