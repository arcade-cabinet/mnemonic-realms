---
id: shop-tailor-room
size: [18, 16]
palette: interior-premium
---
# Tailor's Shop Interior

Color everywhere. Bolts of fabric lean against every wall in cascading
stacks of crimson, indigo, saffron, and emerald. A cutting table stretches
across the center of the room, its surface scarred by a thousand careful
blade strokes, scattered with pins, chalk marks, and half-cut patterns.
Mannequins stand in the corners like silent sentinels, draped in garments
at various stages of completion -- one wears a traveling cloak with an
unfinished hem, another displays a ceremonial sash stitched with geometric
memory-patterns.

The tailor works by the window where the light is best, a measuring tape
perpetually draped around their neck and a pair of silver shears never far
from hand. Thread spools in every conceivable shade hang from a wall-mounted
rack, and the air carries the clean scent of fresh linen and beeswax.

## Room Structure

A single open room organized around the central cutting table:
- **Window workspace** (cols 2-6, rows 3-7): The tailor's primary work
  area with natural light, reference materials, and precision tools
- **Cutting table** (cols 5-12, rows 7-10): The large central table where
  fabric is measured, cut, and assembled
- **Fabric storage** (cols 13-16, rows 3-10): Bolts, barrels of cloth,
  and shelving along the east wall
- **Display/sales area** (cols 2-8, rows 11-13): Finished garments on
  mannequins and a small counter for transactions

### Floor
Wood plank flooring with fabric scraps visible near the cutting table.
A carpet (`carpet-obj.2`) defines the customer-facing sales area.

### Walls
Gray stone walls. The west wall has two large windows for work lighting.
Hanging bottles of dye line the upper walls. Thread spools and fabric
samples are pinned directly to the stone above the workspace.

## Objects
- **cutting-table**: position (6, 7), type: furniture -- `table.large-red-stripe` (64x48)
- **counter**: position (3, 11), type: furniture -- `table.small-1` (48x32) sales counter
- **shelf-tall-1**: position (14, 3), type: furniture -- `shelf.tall-closet-2` (32x64)
- **shelf-tall-2**: position (14, 7), type: furniture -- `shelf.tall-bottles-3` (48x64)
- **shelf-wall**: position (7, 3), type: furniture -- `shelf.wall-3` (32x32)
- **shelf-side**: position (16, 5), type: furniture -- `shelf.side-medium-right-3` (16x64)
- **cloth-rolled-red**: position (13, 5), type: furniture -- `cloth.rolled-red`
- **cloth-rolled-purple**: position (13, 6), type: furniture -- `cloth.rolled-purple`
- **cloth-rolled-blue**: position (14, 6), type: furniture -- `cloth.rolled-blue`
- **cloth-folded-red**: position (8, 7), type: furniture -- `cloth.red`
- **cloth-folded-green**: position (9, 7), type: furniture -- `cloth.green`
- **cloth-folded-blue**: position (10, 7), type: furniture -- `cloth.blue`
- **barrel-cloth**: position (13, 9), type: furniture -- `barrel.cloth` (32x48)
- **barrel-covered**: position (15, 9), type: furniture -- `barrel.covered` (32x32)
- **bottle-hanging-1**: position (3, 3), type: furniture -- `bottle.hanging-purple` (dye)
- **bottle-hanging-2**: position (5, 3), type: furniture -- `bottle.hanging-blue` (dye)
- **bottle-hanging-3**: position (9, 3), type: furniture -- `bottle.hanging-green` (dye)
- **bottle-hanging-4**: position (11, 3), type: furniture -- `bottle.hanging-red` (dye)
- **bottle-dye-1**: position (3, 5), type: furniture -- `bottle.red`
- **bottle-dye-2**: position (4, 5), type: furniture -- `bottle.blue`
- **writing-desk**: position (2, 4), type: furniture -- `writing-desk.map-3` (16x48)
- **bench-cutting**: position (6, 9), type: furniture -- `bench.long-2` (32x16)
- **bench-display**: position (3, 12), type: furniture -- `bench.side` (32x16)
- **basket-thread**: position (5, 5), type: furniture -- `basket.empty` (32x32)
- **basket-fabric**: position (11, 9), type: furniture -- `basket.tomatoes` (32x32)
- **crate**: position (15, 11), type: furniture -- `crate.medium-right` (32x32)
- **sack**: position (15, 12), type: furniture -- `sack.small`
- **chest**: position (13, 12), type: chest -- `chest.steel-closed` (32x32)
- **candle-1**: position (7, 7), type: furniture -- `candle.1` (on cutting table)
- **candle-2**: position (4, 11), type: furniture -- `candle.4` (on counter)
- **candleholder**: position (11, 5), type: furniture -- `candleholder.steel-2`
- **lantern**: position (10, 11), type: furniture -- `lantern.small`
- **carpet-sales**: position (4, 11), type: furniture -- `carpet-obj.2` (64x48)
- **pot**: position (2, 9), type: furniture -- `pot.ceramic-tall-2`
- **vase**: position (16, 3), type: furniture -- `vase.small`
- **package**: position (16, 12), type: furniture -- `package.small`
- **window-1**: position (1, 4), type: furniture -- `window.wood-2` (west wall)
- **window-2**: position (1, 8), type: furniture -- `window.wood-3` (west wall)
- **keeper-spawn**: position (4, 8), type: npc -- tailor works near the cutting table
- **return-door**: position (8, 14), type: transition -- exit to village exterior

## Notes

- The tailor's shop sells cosmetic gear, traveling cloaks, and class-specific
  ceremonial garments. Equipment here is about identity, not raw stats.
- The memory-pattern sash on the mannequin foreshadows a later mechanic:
  garments stitched with specific memory fragments gain passive effects.
  The tailor is unknowingly practicing a form of Mnemonic Architecture
  through their craft.
- The hanging dye bottles echo the reagent shelf in Hana's workshop --
  pigment and memory essence are chemically similar in this world. The
  tailor doesn't know this. Hana does.
- As vibrancy increases, the fabric colors become more vivid and the tailor
  gains access to rarer materials: shimmer-silk from Flickerveil moths,
  sun-thread from Sunridge looms, echo-weave from Ambergrove spiders.
- The cutting table's scars tell a story of years of careful work. Unlike
  the butcher's blood-stained floor, these marks speak of creation rather
  than consumption.
