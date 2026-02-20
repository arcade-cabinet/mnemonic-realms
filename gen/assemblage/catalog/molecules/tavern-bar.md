---
id: tavern-bar
size: [7, 3]
palette: interior-premium
---
# Tavern Bar

The central serving bar found in tavern interiors. A long counter with
stools, bottles, and a bartender position. Derived from the Tavern_1.tmx
reference layout where the bar runs horizontally across the room,
separating the kitchen/storage area from the dining hall.

## Layout

The bar counter uses the same wall-tile counter construction as the
shop-counter molecule, but wider (5-7 tiles) and decorated with bottles,
glasses, plates, and candles on the surface.

### Walls
| | | | | | | |
|---|---|---|---|---|---|---|
| 0 | wall.counter-l | wall.counter | wall.counter | wall.counter | wall.counter-r | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Collision
| | | | | | | |
|---|---|---|---|---|---|---|
| 0 | 1 | 1 | 1 | 1 | 1 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Objects
- **bartender-spawn**: position (3, 0), type: npc -- barkeep stands behind the counter
- **bottle-1**: position (1, 0), type: furniture -- decorative bottle on counter
- **bottle-2**: position (5, 0), type: furniture -- second decorative bottle
- **glass-1**: position (2, 0), type: furniture -- drinking glass
- **glass-2**: position (4, 0), type: furniture -- drinking glass
- **candle-center**: position (3, 0), type: furniture -- candle for warm lighting
- **stool-1**: position (1, 2), type: furniture -- patron stool (bench.small)
- **stool-2**: position (3, 2), type: furniture -- patron stool
- **stool-3**: position (5, 2), type: furniture -- patron stool

## Notes

- In Tavern_1.tmx the bar divides the tavern into a public dining area (south)
  and a kitchen/cellar area (north).
- Barrel storage and cooking braziers go behind (north of) the bar.
- Seating tables with benches go in front (south of) the bar.
- The bartender NPC is the primary interaction point for ordering food/drink
  and hearing rumors.
