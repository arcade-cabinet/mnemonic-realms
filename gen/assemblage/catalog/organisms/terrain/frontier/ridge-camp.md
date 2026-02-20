---
id: ridge-camp
size: [9, 7]
palette: frontier-seasons
---
# Ridge Camp

A makeshift camp perched on a rocky ridge overlooking the frontier lowlands. A ring of stones surrounds a campfire, with bedrolls spread on the packed earth and a weapons rack propped against the cliff face. Frontier scouts use these camps as waypoints, leaving supplies for whoever passes through next.

## Layers

### ground
| | | | | | | | | |
|---|---|---|---|---|---|---|---|---|
| terrain:cliff.brown | terrain:cliff.brown | terrain:cliff.brown | terrain:cliff.brown | terrain:cliff.brown | terrain:cliff.brown | terrain:cliff.brown | terrain:cliff.brown | terrain:cliff.brown |
| terrain:cliff.brown | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:cliff.brown |
| terrain:cliff.brown | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:cliff.brown |
| terrain:cliff.brown | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:cliff.brown |
| terrain:cliff.brown | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:cliff.brown |
| terrain:cliff.brown | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:cliff.brown |
| terrain:cliff.brown | terrain:cliff.brown | terrain:cliff.brown | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:cliff.brown | terrain:cliff.brown | terrain:cliff.brown |

## Collision
| | | | | | | | | |
|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 | 1 |

## Objects
- **campfire**: position (3, 3), type: visual, ref: prop.fireplace
- **weapons-rack**: position (7, 2), type: visual, ref: weapons.rack-small
- **supply-crate**: position (1, 1), type: visual, ref: prop.crate-large
- **barrel**: position (2, 1), type: visual, ref: prop.barrel-covered
- **woodlogs**: position (6, 4), type: visual, ref: prop.woodlogs-1
- **stump-seat**: position (5, 3), type: visual, ref: stump.big
- **rock-1**: position (1, 4), type: visual, ref: rock.brown-1
- **rock-2**: position (6, 1), type: visual, ref: rock.gray-1
- **camp-entrance**: position (4, 6), type: transition, properties: { "direction": "south" }
- **supply-chest**: position (1, 2), type: chest, properties: { "loot": "frontier-supplies" }
- **scout-spawn**: position (4, 3), type: npc
