---
id: marsh-bridge
size: [8, 5]
palette: frontier-seasons
---
# Marsh Bridge

A rickety stone bridge spanning a band of dark marsh water. Cattails crowd the banks, and lily pads drift lazily in the shallows beneath. The stones are slick with moss and the whole structure groans when you cross it, but it holds. It always holds. The world remembers bridges because people need them.

## Layers

### ground
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dirt | terrain:water | terrain:water | terrain:water | terrain:water | terrain:ground.dirt | terrain:ground.dark-grass |
| terrain:ground.dirt | terrain:ground.dirt | terrain:water | terrain:water | terrain:water | terrain:water | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dark-grass | terrain:ground.dirt | terrain:water | terrain:water | terrain:water | terrain:water | terrain:ground.dirt | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.dark-grass | terrain:ground.dark-grass |

## Collision
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 |

## Objects
- **bridge**: position (2, 1), type: visual, ref: bridge.stone-wide
- **cattail-left-1**: position (1, 0), type: visual, ref: cattail.green-1
- **cattail-left-2**: position (1, 4), type: visual, ref: cattail.red-1
- **cattail-right-1**: position (6, 0), type: visual, ref: cattail.yellow-1
- **lilypad-1**: position (3, 1), type: visual, ref: lilypad.green-large
- **lilypad-2**: position (4, 3), type: visual, ref: lilypad.red-large
- **rock-water**: position (5, 2), type: visual, ref: rock.water-small
- **crossing-west**: position (0, 2), type: transition, properties: { "direction": "west" }
- **crossing-east**: position (7, 2), type: transition, properties: { "direction": "east" }
