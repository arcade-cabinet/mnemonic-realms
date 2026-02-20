---
id: marsh-hut
size: [8, 7]
palette: frontier-seasons
---
# Marsh Hut

A humble dwelling perched on a muddy clearing above the waterline. Crooked fence posts mark a yard of trampled earth, and smoke curls from a stone fireplace out front. The kind of place where a frontier hermit brews marsh-root tea and watches the mist roll in.

## Layers

### ground
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh |
| terrain:ground.marsh | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.marsh |
| terrain:ground.marsh | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.marsh |
| terrain:ground.marsh | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.marsh |
| terrain:ground.marsh | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.marsh |
| terrain:ground.marsh | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.marsh |
| terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh | terrain:ground.marsh |

## Collision
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 | 0 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

## Objects
- **hut**: position (2, 1), type: visual, ref: house.hay-small
- **fireplace**: position (3, 5), type: visual, ref: prop.fireplace
- **door**: position (4, 4), type: transition
- **resident-spawn**: position (3, 3), type: npc
