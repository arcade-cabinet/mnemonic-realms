---
id: frontier-gate
size: [9, 6]
palette: frontier-seasons
---
# Frontier Gate

The threshold between the Settled Lands and the Frontier. A weathered stone arch spans the road, flanked by wooden watchtowers. Banners snap in the wind, their colors faded from seasons of sun and rain. Beyond the gate, the road narrows to a dirt track and the trees grow thicker, their leaves an impossible mix of green, gold, and crimson. A signpost warns travelers: "Beyond this point, the world forgets."

## Layers

### ground
| | | | | | | | | |
|---|---|---|---|---|---|---|---|---|
| terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass |

### road
| | | | | | | | | |
|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road |
| terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road | terrain:road |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Collision
| | | | | | | | | |
|---|---|---|---|---|---|---|---|---|
| 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Objects
- **gate-arch**: position (3, 0), type: visual, ref: arch.white
- **watchtower-left**: position (1, 0), type: visual, ref: watchtower.wood-stone
- **watchtower-right**: position (7, 0), type: visual, ref: watchtower.wood-stone
- **banner-left**: position (2, 1), type: visual, ref: banner.blue
- **banner-right**: position (6, 1), type: visual, ref: banner.blue
- **signpost**: position (3, 4), type: visual, ref: prop.sign-1
- **lamppost-left**: position (2, 4), type: visual, ref: prop.lamppost-1
- **lamppost-right**: position (6, 4), type: visual, ref: prop.lamppost-1
- **gate-transition-west**: position (0, 2), type: transition, properties: { "direction": "west", "target": "settled-lands" }
- **gate-transition-east**: position (8, 2), type: transition, properties: { "direction": "east", "target": "frontier" }
- **gatekeeper-spawn**: position (4, 3), type: npc
