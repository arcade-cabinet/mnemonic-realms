---
id: seasonal-farmhouse
size: [10, 9]
palette: frontier-seasons
---
# Seasonal Farmhouse

A sturdy farmstead surrounded by a patchwork of seasonal fields. One corner grows autumn pumpkins while another blooms with summer flowers. The frontier's unstable memory bleeds through here: the farmer has learned to plant all seasons at once, harvesting whatever the world decides to remember that day.

## Layers

### ground
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.autumn | terrain:ground.autumn | terrain:ground.autumn | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.cherry | terrain:ground.cherry | terrain:ground.cherry | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.autumn | terrain:ground.autumn | terrain:ground.autumn | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.cherry | terrain:ground.cherry | terrain:ground.cherry | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.autumn | terrain:ground.autumn | terrain:ground.autumn | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.cherry | terrain:ground.cherry | terrain:ground.cherry | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass | terrain:ground.grass |

## Collision
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 1 | 0 |
| 0 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 1 | 0 |
| 0 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 1 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Objects
- **farmhouse**: position (2, 1), type: visual, ref: house.hay-farmstead
- **pumpkin-patch-1**: position (1, 5), type: visual, ref: plant.pumpkin-1
- **pumpkin-patch-2**: position (2, 6), type: visual, ref: plant.pumpkin-2
- **sunflower-row**: position (7, 5), type: visual, ref: plant.sunflower
- **haystack**: position (8, 1), type: visual, ref: prop.haystack-2
- **woodcart**: position (1, 3), type: visual, ref: prop.woodcart-hay
- **door**: position (4, 4), type: transition
- **farmer-spawn**: position (4, 6), type: npc
