---
id: shop-general-room
size: [16, 23]
palette: interior-premium
---
# General Goods Shop Interior

A cluttered but warm shop selling cloth, dyes, thread, and everyday supplies.
Bolts of colorful fabric hang from the rafters, and the air smells faintly
of lavender and lanolin. A central workbench holds scissors, pins, and
half-finished garments.

Derived from **TailorShop_1.tmx** (16x23, 16px tiles).

## Room Structure

A two-room layout divided by an interior wall:
- **Upper room** (rows 3-10): Workshop with cloth storage, dye barrels, shelves
- **Lower room** (rows 12-20): Sales floor with counter and customer space
- Connected by a doorway in the dividing wall (col 4-5, row 11)

### Floor
Wood plank flooring in both rooms. A small carpet (`carpet-obj.3`) decorates
the lower sales area.

### Walls
Gray stone walls with castle-stone windows (`window.stone-2`, `window.stone-6`)
on the east and west walls.

## Objects
- **counter**: position (4, 14), type: furniture -- `table.medium-green` sales counter
- **cloth-barrel**: position (3, 5), type: furniture -- `barrel.cloth` (32x48)
- **barrel-covered**: position (5, 5), type: furniture -- `barrel.covered` (32x32)
- **cloth-folded-red**: position (7, 6), type: furniture -- `cloth.red`
- **cloth-folded-green**: position (8, 6), type: furniture -- `cloth.green`
- **cloth-folded-blue**: position (9, 6), type: furniture -- `cloth.blue`
- **cloth-rolled-red**: position (3, 8), type: furniture -- `cloth.rolled-red`
- **cloth-rolled-purple**: position (4, 8), type: furniture -- `cloth.rolled-purple`
- **cloth-rolled-blue**: position (5, 8), type: furniture -- `cloth.rolled-blue`
- **shelf-bottles**: position (11, 4), type: furniture -- `shelf.tall-bottles-3` (48x64)
- **shelf-side**: position (1, 6), type: furniture -- `shelf.side-medium-right-3` (16x64)
- **shelf-wall**: position (8, 3), type: furniture -- `shelf.wall-3` (32x32)
- **short-shelf-bottles**: position (11, 9), type: furniture -- `shelf.short-bottles-2` (32x32)
- **bottle-hanging-1**: position (7, 4), type: furniture -- `bottle.hanging-purple`
- **bottle-hanging-2**: position (9, 4), type: furniture -- `bottle.hanging-blue`
- **bottle-hanging-3**: position (10, 4), type: furniture -- `bottle.hanging-green`
- **basket**: position (6, 9), type: furniture -- `basket.empty` (32x32)
- **package**: position (11, 16), type: furniture -- `package.large` (32x32)
- **crate**: position (2, 16), type: furniture -- `crate.medium-right` (32x32)
- **sack**: position (12, 18), type: furniture -- `sack.small`
- **pot**: position (2, 9), type: furniture -- `pot.ceramic-tall-1`
- **bucket**: position (13, 9), type: furniture -- `bucket.1`
- **chest**: position (12, 17), type: chest -- `chest.steel-full` (32x32)
- **candle-1**: position (6, 14), type: furniture -- `candle.2`
- **candle-2**: position (10, 6), type: furniture -- `candle.4`
- **carpet**: position (4, 16), type: furniture -- `carpet-obj.3` (64x48)
- **window-1**: position (1, 6), type: furniture -- `window.stone-2` (on west wall)
- **window-2**: position (14, 14), type: furniture -- `window.stone-6` (on east wall)
- **keeper-spawn**: position (5, 13), type: npc -- tailor stands behind counter
- **door-south**: position (7, 21), type: transition -- exit to village exterior

## Notes

- In Mnemonic Realms, the Everwick general shop is run by **Khali**, a shrewd
  merchant with an eye for quality fabrics and a tongue for gossip.
- The hanging bottles contain dyes -- the tailor doubles as a dyer in a small village.
- The two-room layout creates a natural flow: workshop (private) and storefront (public).
- Cloth goods scattered around the workshop convey an active, busy trade.
