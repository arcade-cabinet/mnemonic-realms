---
id: residence-scholarly
size: [20, 16]
palette: interior-premium
---
# Scholar's Residence (Hana's Workshop)

The workshop of a traveling Mnemonic Architect who has temporarily made
Everwick her base of operations. Unlike Artun's cozy study, Hana's space
is precise and functional -- every object has a purpose. Glass vials of
distilled memory essence line the shelves in chromatic order: amber for
joy, indigo for sorrow, crimson for fury, silver for awe. A large
worktable dominates the center, its surface etched with geometric patterns
that glow faintly when memory fragments are placed upon them.

The room smells of ozone and crushed herbs. Amber lanterns hang from iron
hooks by the door -- the ones Artun mentions as landmarks. A reagent shelf
along the east wall holds ingredients the player will learn to recognize:
moonpetal dust, echo-moss, dissolved crystal shards. Hana's bedroll is
tucked in the far corner, barely used. She works more than she sleeps.

## Room Structure

An open workshop layout with distinct functional zones:
- **Worktable area** (cols 5-14, rows 5-10): Central table with the
  memory-etching pattern, surrounded by tools and reference materials
- **Reagent wall** (cols 15-18, rows 3-10): Shelves of ingredients, vials,
  and alchemical supplies along the east wall
- **Reading nook** (cols 2-5, rows 3-7): Bookshelves and a small desk
  where Hana keeps her research journals
- **Sleeping corner** (cols 15-18, rows 11-13): Bedroll, travel pack, and
  personal effects -- clearly an afterthought

### Floor
Wood plank flooring with a large decorative carpet (`carpet-obj.1`)
beneath the central worktable. The carpet's pattern subtly mirrors the
geometric etchings on the table surface.

### Walls
Gray stone walls. Two windows on the north wall and one on the east wall
provide natural light -- Hana insists on working by daylight when possible.
Wall-mounted shelves hold scrolls and additional reference materials.

## Objects
- **worktable**: position (7, 6), type: furniture -- `table.large-white-stripe` (64x48)
- **worktable-tools**: position (8, 6), type: furniture -- `books.row-3`
- **worktable-scroll**: position (10, 6), type: furniture -- `scroll.single`
- **worktable-vial**: position (9, 7), type: furniture -- `bottle.round-red`
- **desk-reading**: position (2, 4), type: furniture -- `writing-desk.map-3` (16x48)
- **desk-chair**: position (3, 5), type: furniture -- `chair.right-1`
- **shelf-scrolls-1**: position (2, 3), type: furniture -- `shelf.tall-scrolls-3` (48x64)
- **shelf-scrolls-2**: position (5, 3), type: furniture -- `shelf.tall-scrolls-2` (32x64)
- **shelf-reagent-1**: position (15, 3), type: furniture -- `shelf.tall-bottles-3` (48x64)
- **shelf-reagent-2**: position (17, 3), type: furniture -- `shelf.tall-bottles-2` (32x64)
- **shelf-reagent-low**: position (15, 8), type: furniture -- `shelf.short-bottles-2` (32x32)
- **shelf-wall**: position (8, 3), type: furniture -- `shelf.wall-3` (32x32)
- **shelf-side**: position (1, 6), type: furniture -- `shelf.side-medium-left-3` (16x64)
- **bottle-hanging-1**: position (10, 3), type: furniture -- `bottle.hanging-purple`
- **bottle-hanging-2**: position (12, 3), type: furniture -- `bottle.hanging-blue`
- **bottle-hanging-3**: position (14, 3), type: furniture -- `bottle.hanging-green`
- **bottle-1**: position (16, 8), type: furniture -- `bottle.blue`
- **bottle-2**: position (17, 8), type: furniture -- `bottle.green`
- **bottle-3**: position (11, 6), type: furniture -- `bottle.small-blue`
- **bed**: position (15, 11), type: furniture -- `bed.simple-2` (48x64)
- **sack-travel**: position (18, 11), type: furniture -- `sack.large-1` (32x32)
- **package**: position (18, 13), type: furniture -- `package.large` (32x32)
- **bench-table**: position (7, 8), type: furniture -- `bench.long-2` (32x16)
- **bench-wall**: position (13, 10), type: furniture -- `bench.long-3` (32x16)
- **brazier**: position (5, 9), type: furniture -- `brazier.small-pot` (32x48)
- **pot-1**: position (2, 8), type: furniture -- `pot.ceramic-tall-3`
- **pot-2**: position (15, 13), type: furniture -- `pot.stone-tall-1`
- **bucket**: position (13, 12), type: furniture -- `bucket.1`
- **candle-1**: position (8, 7), type: furniture -- `candle.1` (on worktable)
- **candle-2**: position (2, 4), type: furniture -- `candle.3` (on reading desk)
- **candleholder-1**: position (6, 3), type: furniture -- `candleholder.steel-1`
- **candleholder-2**: position (13, 3), type: furniture -- `candleholder.steel-2`
- **lantern**: position (12, 8), type: furniture -- `lantern.small`
- **carpet-work**: position (7, 7), type: furniture -- `carpet-obj.1` (64x48)
- **carpet-entry**: position (8, 11), type: furniture -- `carpet-obj.3` (64x48)
- **chest**: position (13, 12), type: chest -- `chest.steel-closed` (32x32)
- **crate**: position (2, 10), type: furniture -- `crate.medium-closed` (16x32)
- **vase**: position (5, 3), type: furniture -- `vase.small`
- **books-1**: position (3, 4), type: furniture -- `books.row-4`
- **books-2**: position (10, 10), type: furniture -- `books.row-5`
- **window-n-1**: position (7, 2), type: furniture -- `window.wood-2` (north wall)
- **window-n-2**: position (13, 2), type: furniture -- `window.wood-3` (north wall)
- **window-e**: position (18, 6), type: furniture -- `window.wood-6` (east wall)
- **hana-spawn**: position (8, 7), type: npc -- Hana works at the central table
- **return-door**: position (9, 14), type: transition -- exit to Everwick square

## Notes

- Hana's workshop is where the player learns the three core mechanics:
  memory collection, remix, and broadcast (Act I, Scene 4).
- The amber lanterns by the door are the landmark Artun mentions: "the
  building with the amber lanterns." They should be visible from the
  exterior map as well.
- The geometric patterns on the worktable are the visual language of
  Mnemonic Architecture -- circles within circles, intersected by lines
  that suggest neural pathways. When the player places a memory fragment
  on the table during the tutorial, the etchings illuminate.
- The reagent shelf is the first hint that memory work has a physical,
  almost alchemical component. Hana is not a wizard -- she is a craftsperson
  who works with the material of remembrance.
- Hana's barely-used bed and travel pack communicate her character without
  dialogue: she is always working, always moving, and Everwick is only a
  temporary stop on a longer journey.
- The chest contains tutorial rewards that Hana gives the player after
  completing the memory remix exercise.
