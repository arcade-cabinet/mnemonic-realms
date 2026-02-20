---
id: frontier-road
size: [12, 5]
palette: frontier-seasons
---
# Frontier Road

An overgrown dirt track winding through frontier territory. Tall grass encroaches from both sides, and fallen autumn leaves crunch underfoot. A broken signpost leans at the roadside, its lettering worn to ghosts. Stumps from cleared trees mark where settlers once tried to tame this stretch of land before the world forgot their efforts.

## Layers

### ground
| | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|
| terrain:ground.autumn | terrain:ground.grass | terrain:ground.grass | terrain:ground.dark-autumn | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.dark-grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.dark-autumn |
| terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.dark-grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.dark-autumn | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.autumn | terrain:ground.grass | terrain:ground.dark-grass | terrain:ground.grass |

### road
| | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| terrain:road.faint | terrain:road.faint | terrain:road.faint | terrain:road.faint | terrain:road.faint | terrain:road.faint | terrain:road.faint | terrain:road.faint | terrain:road.faint | terrain:road.faint | terrain:road.faint | terrain:road.faint |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### grass-overlay
| | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|
| terrain:tallgrass.autumn | 0 | 0 | terrain:tallgrass.autumn | 0 | 0 | 0 | terrain:tallgrass | 0 | 0 | 0 | terrain:tallgrass.autumn |
| 0 | terrain:tallgrass | 0 | 0 | 0 | terrain:tallgrass.flower | 0 | 0 | 0 | terrain:tallgrass | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | terrain:tallgrass.autumn | 0 | 0 | 0 | terrain:tallgrass | 0 | 0 | 0 | terrain:tallgrass.flower | 0 |
| terrain:tallgrass | 0 | 0 | 0 | terrain:tallgrass.autumn | 0 | 0 | terrain:tallgrass | 0 | 0 | 0 | terrain:tallgrass |

## Collision
| | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |

## Objects
- **signpost-broken**: position (3, 0), type: visual, ref: prop.sign-2
- **stump-1**: position (8, 4), type: visual, ref: stump.axe
- **stump-2**: position (1, 0), type: visual, ref: stump.small
- **bush-autumn**: position (10, 0), type: visual, ref: bush.red-1
- **bush-green**: position (7, 4), type: visual, ref: bush.emerald-3
- **rock-roadside**: position (5, 3), type: visual, ref: rock.moss-1
- **log-fallen**: position (0, 3), type: visual, ref: log.horizontal
- **road-west**: position (0, 2), type: transition, properties: { "direction": "west" }
- **road-east**: position (11, 2), type: transition, properties: { "direction": "east" }
