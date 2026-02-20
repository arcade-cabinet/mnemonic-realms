---
id: sewer-junction
size: [8, 8]
palette: dungeon-depths
tags: [dungeon, sewer, water, pipes, junction]
---
# Sewer Junction

The stone gives way to older, rougher brickwork, and the air turns sharp with the tang of stagnant water. This is where the ancient drainage channels converge -- three tunnels meeting at a central basin where green-tinged water swirls in sluggish circles. Thick iron pipes run along the walls, some still intact, others fractured and weeping a slow trickle of moisture that feeds the central pool. A narrow maintenance walkway of crumbling brick circles the basin, connecting the tunnel mouths. The ceiling is lower here, close enough to touch, and thick with mineral deposits that hang like frozen drips of candle wax. Something moves in the water occasionally -- too large to be a rat, too small to be a person.

## Layers

### ground
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| terrain:wall.brick | terrain:wall.brick | terrain:wall.brick | terrain:floor.stone | terrain:floor.stone | terrain:wall.brick | terrain:wall.brick | terrain:wall.brick |
| terrain:wall.brick | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.brick |
| terrain:wall.brick | terrain:floor.stone | terrain:water.toxic | terrain:water.toxic | terrain:water.toxic | terrain:water.toxic | terrain:floor.stone | terrain:wall.brick |
| terrain:floor.stone | terrain:floor.stone | terrain:water.toxic | terrain:water.toxic | terrain:water.toxic | terrain:water.toxic | terrain:floor.stone | terrain:floor.stone |
| terrain:floor.stone | terrain:floor.stone | terrain:water.toxic | terrain:water.toxic | terrain:water.toxic | terrain:water.toxic | terrain:floor.stone | terrain:floor.stone |
| terrain:wall.brick | terrain:floor.stone | terrain:water.toxic | terrain:water.toxic | terrain:water.toxic | terrain:water.toxic | terrain:floor.stone | terrain:wall.brick |
| terrain:wall.brick | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.brick |
| terrain:wall.brick | terrain:wall.brick | terrain:wall.brick | terrain:floor.stone | terrain:floor.stone | terrain:wall.brick | terrain:wall.brick | terrain:wall.brick |

### detail
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:sewer.pipe-corner-tl | fixed:sewer.pipe-h | 0 | 0 | fixed:sewer.pipe-h | fixed:sewer.pipe-corner-tr | 0 |
| 0 | fixed:sewer.pipe-v | 0 | 0 | 0 | 0 | fixed:sewer.pipe-v | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:sewer.pipe-v | 0 | 0 | 0 | 0 | fixed:sewer.pipe-v | 0 |
| 0 | fixed:sewer.pipe-corner-bl | fixed:sewer.pipe-h | 0 | 0 | fixed:sewer.pipe-h | fixed:sewer.pipe-corner-br | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Collision
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 0 | 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 | 0 | 1 |
| 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 | 0 | 1 | 1 | 1 |

## Anchors
- **north-tunnel**: position (3, 0), edge: north
- **south-tunnel**: position (3, 7), edge: south
- **west-tunnel**: position (0, 3), edge: west
- **east-tunnel**: position (7, 3), edge: east

## Objects
- **sewer-water-inspect**: position (3, 3), type: trigger, width: 2, height: 2
