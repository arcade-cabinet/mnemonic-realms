---
id: marsh-terrain
size: [12, 10]
palette: frontier-seasons
---
# Marsh Terrain

A stretch of low-lying marshland where dark water seeps between tussocks of sodden grass. Fallen logs bridge the mud, cattails sway at the waterline, and lily pads carpet the still pools. The air smells of peat and old rain. This is Shimmer Marsh at its most characteristic: not quite land, not quite water, not quite remembered, not quite forgotten.

## Layers

### ground
| | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.marsh | terrain:water | terrain:water | terrain:ground.marsh | terrain:ground.dark-grass | terrain:ground.marsh | terrain:water | terrain:water | terrain:ground.marsh | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.marsh | terrain:water | terrain:water | terrain:water | terrain:water | terrain:ground.marsh | terrain:water | terrain:water | terrain:water | terrain:water | terrain:ground.marsh |
| terrain:ground.marsh | terrain:water | terrain:water | terrain:water | terrain:ground.marsh | terrain:water | terrain:water | terrain:water | terrain:ground.marsh | terrain:water | terrain:water | terrain:water |
| terrain:ground.dark-grass | terrain:ground.marsh | terrain:water | terrain:ground.marsh | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.marsh | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.marsh | terrain:water | terrain:ground.marsh |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.marsh | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.marsh | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.marsh | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.marsh | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.marsh | terrain:water | terrain:ground.marsh | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.marsh | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.marsh | terrain:water | terrain:ground.marsh | terrain:ground.marsh | terrain:water | terrain:water | terrain:water | terrain:ground.marsh | terrain:ground.marsh | terrain:water | terrain:ground.marsh | terrain:ground.dark-grass |
| terrain:ground.marsh | terrain:water | terrain:water | terrain:water | terrain:water | terrain:water | terrain:water | terrain:water | terrain:water | terrain:water | terrain:water | terrain:ground.marsh |
| terrain:ground.dark-grass | terrain:ground.marsh | terrain:water | terrain:water | terrain:ground.marsh | terrain:water | terrain:water | terrain:water | terrain:ground.marsh | terrain:water | terrain:ground.marsh | terrain:ground.dark-grass |

## Collision
| | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 0 |
| 0 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 0 | 1 | 1 | 1 |
| 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| 0 | 0 | 1 | 1 | 0 | 1 | 1 | 1 | 0 | 1 | 0 | 0 |

## Objects
- **cattail-1**: position (0, 1), type: visual, ref: cattail.green-1
- **cattail-2**: position (6, 0), type: visual, ref: cattail.red-1
- **cattail-3**: position (11, 2), type: visual, ref: cattail.yellow-1
- **cattail-4**: position (1, 7), type: visual, ref: cattail.green-2
- **cattail-5**: position (9, 7), type: visual, ref: cattail.red-1
- **lilypad-1**: position (3, 0), type: visual, ref: lilypad.green-1
- **lilypad-2**: position (8, 1), type: visual, ref: lilypad.red-1
- **lilypad-3**: position (4, 8), type: visual, ref: lilypad.green-large
- **lilypad-4**: position (7, 8), type: visual, ref: lilypad.yellow-1
- **lotus-1**: position (2, 1), type: visual, ref: lotus.blue
- **lotus-2**: position (9, 8), type: visual, ref: lotus.white
- **floating-planks**: position (3, 2), type: visual, ref: floating.planks-2
- **floating-leaves**: position (10, 1), type: visual, ref: floating.leaves-autumn
- **rock-water-1**: position (4, 2), type: visual, ref: rock.water-1
- **rock-water-2**: position (8, 9), type: visual, ref: rock.water-2
- **log-across**: position (2, 6), type: visual, ref: log.long
- **stump-1**: position (5, 5), type: visual, ref: stump.small
