---
id: shop-butchery-room
size: [20, 20]
palette: interior-premium
---
# Butchery Interior

A working slaughterhouse that makes no attempt to hide its trade. Blood stains
the floor near the cutting block, sides of meat hang from ceiling hooks, and
the sharp tang of iron fills the air. The front counter displays the day's cuts,
while the back room stores barrels of preserved meat and steel tools.

Derived from **Butchery_1.tmx** (20x20, 16px tiles).

## Room Structure

Two rooms divided by a horizontal counter/wall:
- **Back room** (rows 3-9): Butchering workspace with cutting block, hanging meat,
  storage barrels
- **Front room** (rows 11-17): Customer area with counter, shelves of bottled goods,
  and a display table

### Floor
Wood plank flooring. Blood stains (`blood.small`, `blood.large`) near the
cutting area in the back room. Carpet pieces near the counter and entrance.

### Walls
Gray stone walls. The dividing wall has a counter opening for serving customers.

## Objects
- **counter**: position (4, 10), type: furniture -- shop counter dividing rooms
- **table-large**: position (5, 14), type: furniture -- `table.large-1` (64x48, display table)
- **shelf-tall-bottles**: position (14, 4), type: furniture -- `shelf.tall-bottles-3` (48x64)
- **shelf-medium-bottles**: position (14, 8), type: furniture -- `shelf.medium-bottles-2` (32x48)
- **shelf-side-tall**: position (2, 5), type: furniture -- `shelf.side-tall-left-3` (16x64)
- **shelf-side-medium**: position (17, 11), type: furniture -- `shelf.side-medium-right-2` (16x48)
- **shelf-wall-1**: position (4, 4), type: furniture -- `shelf.wall-3` (32x32)
- **shelf-wall-2**: position (8, 10), type: furniture -- `shelf.wall-large-3` (48x32)
- **barrel-meat-1**: position (3, 5), type: furniture -- `barrel.meat` (32x48)
- **barrel-steel**: position (5, 5), type: furniture -- `barrel.steel-bars` (32x48)
- **barrel-covered**: position (3, 8), type: furniture -- `barrel.covered` (32x32)
- **barrel-small-meat**: position (12, 5), type: furniture -- `barrel.small-meat`
- **barrel-small-water**: position (13, 5), type: furniture -- `barrel.small-water`
- **crate-1**: position (3, 14), type: furniture -- `crate.large-closed` (32x32)
- **crate-2**: position (3, 16), type: furniture -- `crate.large-empty` (32x32)
- **crate-3**: position (10, 5), type: furniture -- `crate.medium-left` (32x32)
- **crate-carrots**: position (12, 14), type: furniture -- `crate.small-carrots`
- **crate-water**: position (14, 14), type: furniture -- `crate.water` (16x32)
- **food-meat**: position (6, 7), type: furniture -- `food.meat`
- **food-steak-1**: position (7, 7), type: furniture -- `food.steak-1`
- **food-steak-2**: position (8, 7), type: furniture -- `food.steak-2`
- **cleaver**: position (6, 6), type: furniture -- `cleaver.1` (16x32, on cutting block)
- **blood-1**: position (7, 8), type: furniture -- `blood.small` (floor stain)
- **blood-2**: position (8, 8), type: furniture -- `blood.large` (floor stain)
- **bottle-hanging-1**: position (10, 4), type: furniture -- `bottle.hanging-red`
- **bottle-hanging-2**: position (12, 10), type: furniture -- `bottle.hanging-blue`
- **bottle-1**: position (6, 14), type: furniture -- `bottle.red`
- **bottle-2**: position (7, 14), type: furniture -- `bottle.red` (with label)
- **bottle-3**: position (8, 14), type: furniture -- `bottle.green`
- **bottle-4**: position (9, 14), type: furniture -- `bottle.blue`
- **plate**: position (8, 15), type: furniture -- `plate.1`
- **candle-1**: position (6, 10), type: furniture -- `candle.1`
- **candle-2**: position (12, 8), type: furniture -- `candle.2`
- **candle-3**: position (15, 14), type: furniture -- `candle.4`
- **candleholder-1**: position (2, 7), type: furniture -- `candleholder.steel-1`
- **candleholder-2**: position (17, 7), type: furniture -- `candleholder.steel-2`
- **bench-1**: position (8, 12), type: furniture -- `bench.side` (32x16)
- **bench-2**: position (12, 16), type: furniture -- `bench.long-3` (32x16)
- **sack**: position (3, 7), type: furniture -- `sack.large-1` (32x32)
- **package**: position (14, 16), type: furniture -- `package.small`
- **chest**: position (15, 16), type: chest -- `chest.wood-closed` (32x32)
- **carpet-1**: position (10, 11), type: furniture -- `carpet-obj.2` (64x48)
- **carpet-2**: position (5, 15), type: furniture -- `carpet-obj.3` (64x48)
- **chair**: position (10, 16), type: furniture -- `chair.right-1`
- **keeper-spawn**: position (5, 9), type: npc -- butcher stands behind counter
- **door-south**: position (8, 18), type: transition -- exit to village

## Notes

- The butchery is deliberately grittier than other shops -- blood on the floor,
  raw meat on display, utilitarian furniture.
- The bottle selection suggests the butcher also sells preserved goods and sauces.
- The cutting block area (back room center) with cleaver and blood stains tells
  a story without any dialogue needed.
- Could include a quest hook: the butcher needs specific game meat from the
  frontier zones (Act 2 content).
