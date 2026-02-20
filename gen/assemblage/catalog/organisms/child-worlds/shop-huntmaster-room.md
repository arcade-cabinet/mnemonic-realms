---
id: shop-huntmaster-room
size: [26, 17]
palette: interior-premium
---
# Huntmaster's Lodge Interior

A wide, low-ceilinged lodge that smells of tanned leather and woodsmoke.
Mounted trophies line the walls -- an animal skull, crossed bows, and a
faded painting of a great hunt. A long table dominates the center, covered
with maps of hunting grounds and a half-eaten haunch of venison.

Derived from **Huntmaster_1.tmx** (26x17, 16px tiles).

## Room Structure

A single wide room with a bedroom alcove on the east side:
- **Main hall** (cols 2-16, rows 4-14): Hunting lodge proper with central table
- **Bedroom alcove** (cols 17-23, rows 4-14): Private sleeping quarters separated
  by a partition wall

### Floor
Wood plank flooring throughout. A red carpet (`carpet-obj.1`) runs along
the center of the main hall.

### Walls
Gray stone walls with wooden windows (`window.wood-2`) on the north wall.

## Objects
- **table-large**: position (5, 8), type: furniture -- `table.large-white-stripe` (64x48)
- **skull-mount**: position (7, 3), type: furniture -- `skull.animal` (48x32, wall-mounted)
- **bow-mount-1**: position (4, 5), type: furniture -- `wall-art.bow-1` (16x32)
- **bow-mount-2**: position (12, 5), type: furniture -- `wall-art.bow-2` (16x32)
- **painting**: position (14, 4), type: furniture -- `wall-art.painting-small-2` (32x16)
- **weapon-stand**: position (2, 5), type: furniture -- `weapon-stand.green-7` (32x48)
- **shelf-closet**: position (14, 6), type: furniture -- `shelf.tall-closet-2` (32x64)
- **shelf-side**: position (2, 8), type: furniture -- `shelf.side-medium-left-3` (16x64)
- **shelf-bottles**: position (14, 10), type: furniture -- `shelf.short-bottles-3` (48x32)
- **bed**: position (19, 4), type: furniture -- `bed.fancy-green` (48x64)
- **bedtable**: position (18, 5), type: furniture -- `bedtable.medium` (32x32)
- **desk-side-1**: position (22, 7), type: furniture -- `desk.side-1` (16x48)
- **desk-side-2**: position (17, 10), type: furniture -- `desk.side-3` (16x64)
- **barrel-covered**: position (13, 12), type: furniture -- `barrel.covered` (32x32)
- **barrel-arrows**: position (2, 12), type: furniture -- `barrel.small-arrows`
- **barrel-water**: position (3, 12), type: furniture -- `barrel.small-water`
- **bench-1**: position (5, 10), type: furniture -- `bench.front` (16x32)
- **bench-2**: position (9, 7), type: furniture -- `bench.long-1` (32x16)
- **bench-3**: position (9, 10), type: furniture -- `bench.small`
- **bench-4**: position (13, 8), type: furniture -- `bench.long-2` (32x16)
- **bench-5**: position (3, 10), type: furniture -- `bench.back` (16x32)
- **bench-6**: position (13, 10), type: furniture -- `bench.long-3` (32x16)
- **crate**: position (22, 12), type: furniture -- `crate.medium-closed` (16x32)
- **chest**: position (20, 12), type: chest -- `chest.gold-open` (32x32)
- **cleaver**: position (10, 8), type: furniture -- `cleaver.1` (16x32, on table)
- **food-meat**: position (7, 8), type: furniture -- `food.meat` (on table)
- **bottle-hanging**: position (15, 5), type: furniture -- `bottle.hanging-red`
- **bottle-green**: position (8, 8), type: furniture -- `bottle.green` (on table)
- **bottle-blue**: position (12, 10), type: furniture -- `bottle.small-blue`
- **candle-1**: position (6, 8), type: furniture -- `candle.1` (on table)
- **candle-2**: position (10, 4), type: furniture -- `candle.2`
- **candleholder**: position (17, 8), type: furniture -- `candleholder.steel-2`
- **candleholder-short**: position (22, 5), type: furniture -- `candleholder.steel-1`
- **bucket**: position (15, 12), type: furniture -- `bucket.1`
- **package**: position (21, 12), type: furniture -- `package.small`
- **pot**: position (22, 10), type: furniture -- `pot.stone-tall-2`
- **carpet**: position (5, 7), type: furniture -- `carpet-obj.1` (64x48)
- **vase**: position (2, 6), type: furniture -- `vase.small`
- **window**: position (7, 3), type: furniture -- `window.wood-2` (north wall)
- **keeper-spawn**: position (6, 9), type: npc -- huntmaster sits at head of table
- **door-south**: position (10, 15), type: transition -- exit to village

## Notes

- The huntmaster's lodge serves as both a quest hub and a shop for hunting supplies
  (arrows, traps, provisions).
- The mounted animal skull and crossed bows immediately establish the occupant's
  profession -- no generic "Welcome to the shop" here.
- The bedroom alcove with a fancy bed suggests the huntmaster has some status
  in the village -- perhaps a former guild leader.
- The long central table with food and drink suggests this is also a gathering
  place for hunting parties.
