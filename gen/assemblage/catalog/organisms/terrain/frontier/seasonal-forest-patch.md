---
id: seasonal-forest-patch
size: [10, 8]
palette: frontier-seasons
---
# Seasonal Forest Patch

A clearing in the frontier woods where trees of every season crowd together in botanical impossibility. A crimson maple stands shoulder-to-shoulder with a cherry blossom, both shading a carpet of golden leaves that crunch underfoot beside fresh green moss. The forest floor is littered with mushrooms, fallen logs, and exposed roots. A narrow path threads through the chaos.

## Layers

### ground
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| terrain:ground.dark-autumn | terrain:ground.dark-autumn | terrain:ground.autumn | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.cherry | terrain:ground.cherry | terrain:ground.dark-autumn | terrain:ground.dark-autumn |
| terrain:ground.dark-autumn | terrain:ground.autumn | terrain:ground.autumn | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.cherry | terrain:ground.cherry | terrain:ground.dark-autumn |
| terrain:ground.autumn | terrain:ground.autumn | terrain:ground.grass | terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass | terrain:ground.grass | terrain:ground.cherry | terrain:ground.cherry |
| terrain:ground.autumn | terrain:ground.grass | terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass | terrain:ground.grass | terrain:ground.cherry |
| terrain:ground.dark-autumn | terrain:ground.grass | terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass | terrain:ground.grass | terrain:ground.dark-autumn |
| terrain:ground.dark-autumn | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.dark-autumn |
| terrain:ground.dark-autumn | terrain:ground.dark-autumn | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.dark-autumn | terrain:ground.dark-autumn |
| terrain:ground.dark-autumn | terrain:ground.dark-autumn | terrain:ground.dark-autumn | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.dark-autumn | terrain:ground.dark-autumn | terrain:ground.dark-autumn |

### vegetation
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| terrain:leaves.red | terrain:leaves.red | 0 | 0 | 0 | 0 | 0 | 0 | terrain:leaves.yellow | terrain:leaves.yellow |
| terrain:leaves.red | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | terrain:leaves.yellow |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| terrain:leaves.green | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | terrain:leaves.red |
| terrain:leaves.green | terrain:leaves.green | 0 | 0 | 0 | 0 | 0 | 0 | terrain:leaves.red | terrain:leaves.red |

## Collision
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |

## Objects
- **tree-red-1**: position (0, 0), type: visual, ref: tree.red-3
- **tree-red-2**: position (1, 0), type: visual, ref: tree.red-2
- **tree-yellow-1**: position (8, 0), type: visual, ref: tree.yellow-3
- **tree-yellow-2**: position (9, 0), type: visual, ref: tree.yellow-2
- **tree-pink-1**: position (8, 6), type: visual, ref: tree.pink-3
- **tree-emerald-1**: position (0, 6), type: visual, ref: tree.emerald-3
- **tree-emerald-2**: position (1, 7), type: visual, ref: tree.emerald-2
- **bush-red**: position (5, 0), type: visual, ref: bush.red-1
- **bush-yellow**: position (3, 7), type: visual, ref: bush.yellow-1
- **mushroom-1**: position (2, 2), type: visual, ref: mushroom.1
- **mushroom-2**: position (7, 4), type: visual, ref: mushroom.4
- **root-1**: position (1, 5), type: visual, ref: root.1
- **root-2**: position (8, 5), type: visual, ref: root.2
- **log-fallen**: position (6, 6), type: visual, ref: log.mushroom
- **stump**: position (3, 1), type: visual, ref: stump.axe
- **clearing-path-north**: position (4, 0), type: transition, properties: { "direction": "north" }
- **clearing-path-south**: position (4, 7), type: transition, properties: { "direction": "south" }
