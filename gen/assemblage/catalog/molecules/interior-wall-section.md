---
id: interior-wall-section
size: [5, 4]
palette: interior-premium
---
# Interior Wall Section

A reusable 5-tile-wide north-facing wall segment used in all interior maps.
Walls are 4 tiles tall: ceiling edge, upper face, decorative mid-strip, and baseboard shadow.
The pattern tiles horizontally for any room width; corners and side walls are separate molecules.

## Variants

### Gray Stone (shops, common houses)

#### Walls
| | | | | |
|---|---|---|---|---|
| wall.gray-tl | wall.gray-t | wall.gray-t | wall.gray-t | wall.gray-tr |
| wall.gray-face-l | wall.gray-face | wall.gray-face | wall.gray-face | wall.gray-face-r |
| wall.gray-mid-l | wall.gray-mid | wall.gray-mid | wall.gray-mid | wall.gray-mid-r |
| wall.gray-bot-l | wall.gray-bot | wall.gray-bot | wall.gray-bot | wall.gray-bot-r |

### Warm Wood (taverns, inns)

#### Walls
| | | | | |
|---|---|---|---|---|
| wall.wood-tl | wall.wood-t | wall.wood-t | wall.wood-t | wall.wood-tr |
| wall.wood-face-l | wall.wood-face | wall.wood-face | wall.wood-face | wall.wood-face-r |
| wall.wood-mid-l | wall.wood-mid | wall.wood-mid | wall.wood-mid | wall.wood-mid-r |
| wall.wood-bot-l | wall.wood-bot | wall.wood-bot | wall.wood-bot | wall.wood-bot-r |

### Castle Stone (libraries, grand halls)

#### Walls
| | | | | |
|---|---|---|---|---|
| wall.castle-tl | wall.castle-t | wall.castle-t | wall.castle-t | wall.castle-tr |
| wall.castle-face-l | wall.castle-face | wall.castle-face | wall.castle-face | wall.castle-face-r |
| wall.castle-mid-l | wall.castle-mid | wall.castle-mid | wall.castle-mid | wall.castle-mid-r |
| wall.castle-bot-l | wall.castle-bot | wall.castle-bot | wall.castle-bot | wall.castle-bot-r |

## Collision
| | | | | |
|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 |
| 0 | 0 | 0 | 0 | 0 |

## Notes

- Bottom row (baseboard) is walkable -- the player walks right up to the wall face.
- Side walls (`wall.*.side-l` / `wall.*.side-r`) handle vertical wall runs.
- South walls (`wall.*.south-*`) face the player at the bottom of rooms.
- Use T-junction partitions (`wall.partition-*`) for room dividers.
