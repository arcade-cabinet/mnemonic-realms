---
id: inn-tavern-room
size: [31, 24]
palette: interior-premium
---
# Tavern Interior (Bright Hearth Inn)

The largest and liveliest interior in Everwick. Warm candlelight flickers off
dark wood paneling, and the murmur of conversation fills the air. A long bar
counter divides the kitchen from the dining hall. Travelers' tables crowd the
main floor while a quieter sitting area occupies the east wing. The fireplace
is always burning.

Derived from **Tavern_1.tmx** (31x24, 16px tiles).

## Room Structure

Three distinct areas connected by an open floor plan:
- **Kitchen/bar area** (cols 3-7, rows 7-15): Behind the bar counter, storage
  and food preparation. Wood plank floor.
- **Main dining hall** (cols 10-19, rows 7-20): Central seating area with large
  tables, benches, and the bar counter on the west side. Stone tile floor with
  carpet accents.
- **East wing** (cols 22-27, rows 9-20): Quieter private dining/sitting area.
  Stone tile floor.

The three areas share a continuous space (rows 11-13) where the bar opens to
the dining hall which opens to the east wing.

### Floor
Mixed flooring: wood planks in the kitchen area, stone tiles in the dining
halls. Carpet runners (`carpet.red` auto-tiled) connect the bar to the
seating areas. Individual carpet objects near tables.

### Walls
Two wall styles in the same building:
- **Wood paneling** (kitchen/bar area, cols 2-8) -- `wall.wood-*` variant
- **Stone** (dining halls, cols 9-28) -- uses style matching Tavern_1 reference

A large fireplace occupies the south wall of the dining hall.

## Objects
- **bar-counter**: position (9, 11), extends 7 tiles -- tavern-bar molecule
- **bartender-bottles**: position (4, 8), type: furniture -- `shelf.wall-2` (32x32)
- **bartender-shelf**: position (6, 8), type: furniture -- `shelf.wall-3` (32x32)
- **barrel-horizontal**: position (3, 9), type: furniture -- `barrel.horizontal-1` (32x32)
- **barrel-water**: position (3, 11), type: furniture -- `barrel.water` (32x32)
- **barrel-meat**: position (5, 11), type: furniture -- `barrel.meat` (32x48)
- **barrel-small-covered**: position (3, 13), type: furniture -- `barrel.small-covered`
- **barrel-small-fish**: position (4, 13), type: furniture -- `barrel.small-fish`
- **barrel-small-meat**: position (5, 13), type: furniture -- `barrel.small-meat`
- **brazier**: position (7, 14), type: furniture -- `brazier.small-pot` (32x48)
- **crate-eggplants**: position (3, 15), type: furniture -- `crate.small-eggplants`
- **crate-tomatoes**: position (4, 15), type: furniture -- `crate.small-tomatoes`
- **crate-carrots**: position (5, 15), type: furniture -- `crate.small-carrots`
- **crate-steel**: position (6, 15), type: furniture -- `crate.steel-1`
- **crate-large**: position (3, 16), type: furniture -- `crate.large-empty` (32x32)
- **basket-tomatoes**: position (5, 16), type: furniture -- `basket.tomatoes` (32x32)
- **basket-carrots**: position (7, 16), type: furniture -- `basket.carrots` (32x32)
- **cloth-rolled-red**: position (6, 13), type: furniture -- `cloth.rolled-red`
- **cloth-rolled-green**: position (7, 13), type: furniture -- `cloth.rolled-green`
- **food-meat**: position (10, 10), type: furniture -- `food.meat` (on bar counter)
- **food-cheese**: position (12, 10), type: furniture -- `food.cheese` (on bar counter)
- **food-steak**: position (14, 10), type: furniture -- `food.steak-1` (on bar counter)
- **fish-hanging**: position (3, 7), type: furniture -- `fish.hanging-white`
- **skull-mount**: position (15, 7), type: furniture -- `skull.animal` (48x32, wall trophy)
- **shield-swords**: position (18, 7), type: furniture -- `shield.swords-red` (wall mount)
- **table-large-1**: position (12, 13), type: furniture -- `table.large-red-stripe` (64x48)
- **table-large-2**: position (12, 17), type: furniture -- `table.large-1` (64x48)
- **table-small-1**: position (18, 14), type: furniture -- `table.small-1` (48x32)
- **table-small-2**: position (18, 18), type: furniture -- `table.small-red` (48x32)
- **table-east-1**: position (23, 15), type: furniture -- `carpet-obj.2` (64x48)
- **bench-1**: position (12, 15), type: furniture -- `bench.long-2` (south of table-large-1)
- **bench-2**: position (15, 15), type: furniture -- `bench.long-3`
- **bench-3**: position (12, 19), type: furniture -- `bench.long-2` (south of table-large-2)
- **bench-4**: position (15, 19), type: furniture -- `bench.long-3`
- **bench-5**: position (18, 15), type: furniture -- `bench.front`
- **bench-6**: position (20, 14), type: furniture -- `bench.back`
- **bench-7**: position (18, 19), type: furniture -- `bench.long-3`
- **chest-1**: position (24, 7), type: chest -- `chest.steel-closed` (32x32)
- **chest-2**: position (26, 7), type: chest -- `chest.steel-open` (32x32)
- **bottle-hanging-1**: position (12, 7), type: furniture -- `bottle.hanging-green`
- **bottle-hanging-2**: position (14, 7), type: furniture -- `bottle.hanging-blue`
- **bottle-hanging-3**: position (16, 7), type: furniture -- `bottle.hanging-red`
- **bottle-1**: position (10, 11), type: furniture -- `bottle.blue` (on bar)
- **bottle-2**: position (13, 11), type: furniture -- `bottle.green` (on bar)
- **bottle-3**: position (15, 11), type: furniture -- `bottle.red` (on bar)
- **bottle-round-1**: position (13, 14), type: furniture -- `bottle.round-red`
- **bottle-round-2**: position (19, 14), type: furniture -- `bottle.round-blue`
- **bottle-small-1**: position (14, 17), type: furniture -- `bottle.small-blue`
- **bottle-small-2**: position (14, 18), type: furniture -- `bottle.small-green`
- **glass-1**: position (13, 13), type: furniture -- `glass.2`
- **glass-2**: position (15, 17), type: furniture -- `glass.2`
- **plate-1**: position (13, 17), type: furniture -- `plate.1`
- **plate-2**: position (19, 18), type: furniture -- `plate.2`
- **candle-1**: position (11, 11), type: furniture -- `candle.1` (bar)
- **candle-2**: position (14, 13), type: furniture -- `candle.2` (table)
- **candle-3**: position (19, 14), type: furniture -- `candle.3` (table)
- **candle-4**: position (14, 17), type: furniture -- `candle.4` (table)
- **candle-5**: position (25, 15), type: furniture -- `candle.5` (east wing)
- **candleholder-1**: position (10, 7), type: furniture -- `candleholder.steel-1`
- **candleholder-2**: position (20, 7), type: furniture -- `candleholder.steel-2`
- **candleholder-3**: position (27, 10), type: furniture -- `candleholder.steel-3`
- **lantern**: position (22, 13), type: furniture -- `lantern.small`
- **pot-1**: position (3, 8), type: furniture -- `pot.ceramic-tall-1` (kitchen)
- **pot-2**: position (7, 8), type: furniture -- `pot.ceramic-small-2` (kitchen)
- **pot-3**: position (22, 19), type: furniture -- `pot.stone-tall-1` (east wing)
- **vase-1**: position (22, 9), type: furniture -- `vase.small`
- **vase-2**: position (26, 17), type: furniture -- `vase.tall`
- **sack**: position (7, 16), type: furniture -- `sack.small`
- **package**: position (25, 19), type: furniture -- `package.small`
- **carpet-1**: position (12, 12), type: furniture -- `carpet-obj.1` (64x48, dining)
- **carpet-2**: position (12, 16), type: furniture -- `carpet-obj.2` (64x48, dining)
- **carpet-3**: position (23, 17), type: furniture -- `carpet-obj.3` (64x48, east wing)
- **carpet-east**: position (22, 17), type: furniture -- `carpet-obj.5` (64x32, runner)
- **window-1**: position (10, 5), type: furniture -- `window.wood-2` (north wall)
- **window-2**: position (16, 5), type: furniture -- `window.wood-3` (north wall)
- **window-3**: position (25, 9), type: furniture -- `window.wood-6` (east wing)
- **bartender-spawn**: position (8, 11), type: npc -- bartender behind bar
- **patron-1-spawn**: position (13, 15), type: npc -- seated patron
- **patron-2-spawn**: position (19, 15), type: npc -- seated patron
- **door-south-1**: position (14, 22), type: transition -- main entrance
- **door-east**: position (27, 17), type: transition -- side door to inn rooms

## Notes

- The Bright Hearth is Everwick's only inn and the social hub of the village.
- The bartender is the primary source of rumors, quest hooks, and village gossip.
- Seated patron NPCs rotate based on story progress -- different characters
  appear in different acts.
- The east wing quieter area could serve as a private meeting point for
  story-critical conversations.
- The large fireplace provides natural warmth that contrasts with the dormant,
  memory-faded world outside.
- Kitchen storage behind the bar tells the story of a working establishment --
  barrels, crates, produce, cooking equipment.
