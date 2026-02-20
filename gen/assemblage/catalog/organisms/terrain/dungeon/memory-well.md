---
id: memory-well
size: [7, 7]
palette: dungeon-depths
tags: [dungeon, memory, well, mystical, narrative]
---
# Memory Well

At the heart of this circular chamber, the stone floor drops away into a well of impossible depth. Leaning over the edge reveals not water but a swirling luminescence -- pale blue light that shifts and eddies like fog trapped in a bottle. The air above the well shimmers with half-formed images: a child's laughter, a field of wheat under summer sun, the smell of bread baking. These are not hallucinations but memory fragments, concentrated here by whatever force carved these tunnels through the bedrock. The well's rim is inscribed with text in a language older than the dungeon itself, though certain phrases seem almost recognizable, as if they were the roots from which modern words grew. Standing near the well is both intoxicating and unsettling -- the memories are vivid but belong to no one living, and lingering too long makes the boundary between one's own recollections and the well's offerings dangerously thin.

## Layers

### ground
| | | | | | | |
|---|---|---|---|---|---|---|
| terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.dirt | terrain:water.deep | terrain:floor.dirt | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.dirt | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:floor.stone | terrain:wall.stone |
| terrain:wall.stone | terrain:wall.stone | terrain:wall.stone | terrain:floor.stone | terrain:wall.stone | terrain:wall.stone | terrain:wall.stone |

### detail
| | | | | | | |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:candle.candelabra-1 | 0 | 0 | 0 | fixed:candle.candelabra-2 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | fixed:candle.candelabra-1 | 0 | 0 | 0 | fixed:candle.candelabra-2 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Collision
| | | | | | | |
|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 | 1 | 1 | 1 |

## Anchors
- **north-entry**: position (3, 0), edge: north
- **south-entry**: position (3, 6), edge: south

## Objects
- **memory-well**: position (3, 3), type: trigger
- **well-resonance**: position (2, 2), type: trigger, width: 3, height: 3
