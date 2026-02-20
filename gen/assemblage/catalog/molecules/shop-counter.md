---
id: shop-counter
size: [5, 2]
palette: interior-premium
---
# Shop Counter

A horizontal serving counter that divides the shopkeeper's area from the customer space.
Used in weapon shops, general stores, butcheries, and taverns.
The counter is built from wall tiles arranged as a waist-high barrier.

## Variants

### Standard Counter (3 wide)

The counter is composed of south-facing wall tiles repurposed as furniture.
In the reference TMXes, counters use wall tile IDs for the counter surface
with a specific arrangement of left-edge, center, right-edge tiles.

#### Walls
| | | | | |
|---|---|---|---|---|
| 0 | wall.counter-l | wall.counter | wall.counter | wall.counter-r |
| 0 | 0 | 0 | 0 | 0 |

### L-Shaped Counter (for corner shops)

Extends the standard counter with a side desk piece for an L-turn.

## Collision
| | | | | |
|---|---|---|---|---|
| 0 | 1 | 1 | 1 | 1 |
| 0 | 0 | 0 | 0 | 0 |

## Objects
- **keeper-spawn**: position (0, 0), type: npc -- shopkeeper stands behind the counter
- **customer-zone**: position (2, 1), type: trigger -- interaction zone for shopping

## Notes

- The counter separates the keeper NPC from the player.
- Place shelves and weapon stands behind the counter (north side) for shop inventory display.
- The keeper-spawn anchor lets the room assemblage position the shopkeeper NPC.
- Counter surfaces often have candles, bottles, or plates placed as decoration objects.
